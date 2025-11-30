import React, { useEffect, useRef } from 'react';
import { Application, Container, Sprite, Texture, AnimatedSprite, Assets, TilingSprite, WRAP_MODES, BlurFilter } from 'pixi.js';

// Suppress noisy Pixi Assets warnings for inlined data URLs (we load textures directly)
Assets.setPreferences?.({ skipCacheIdWarning: true });

// Minimal Pixi-based stage that replaces DOM grid rendering
// Props:
// - mapWidth, mapHeight: grid dimensions in tiles
// - tileSize: pixel size of one tile (default 32)
// - tileMapData: array of IDs for background layer
// - objectMapData: array of IDs for entities layer (excluding player)
// - registryItems: array of registry entries with { id, texture, textures, animationSpeed, width, height }
// - playerState: { x, y, direction, animation, health, width, height }
// - playerVisuals: registry item to use for the player visuals
const PixiStage = ({
  mapWidth,
  mapHeight,
  tileSize = 32,
  tileMapData = [],
  objectMapData = [],
  registryItems = [],
  playerState,
  playerVisuals,
  backgroundImage,
  backgroundColor,
  backgroundParallaxFactor = 0.3,
  cameraScrollX = 0,
}) => {
  const mountRef = useRef(null);
  const appRef = useRef(null);
  const parallaxRef = useRef(null);
  const parallaxSpriteRef = useRef(null);
  const cameraScrollRef = useRef(0);
  const bgRef = useRef(null);
  const objRef = useRef(null);
  const playerRef = useRef(null);
  const playerStateRef = useRef(null);

  // keep latest player state and camera scroll for ticker without re-subscribing
  useEffect(() => {
    playerStateRef.current = playerState;
  }, [playerState]);
  useEffect(() => {
    cameraScrollRef.current = Number(cameraScrollX) || 0;
  }, [cameraScrollX]);

  // Small helper cache for textures
  const textureCacheRef = useRef(new Map());
  const getTexture = (url) => {
    if (!url) return null;
    const cache = textureCacheRef.current;
    if (cache.has(url)) return cache.get(url);
    const tex = Texture.from(url);
    cache.set(url, tex);
    return tex;
  };

  // Background images resolver (from src/assets/background)
  // Meta stores `/assets/background/<name>`
  let bgContext;
  try {
    // webpack require.context (CRA)
    // relative to this file: '../../assets/background'
    bgContext = require.context('../../assets/background', false, /\.(png|jpe?g|svg)$/);
  } catch (e) {
    bgContext = null;
  }
  const resolveBackgroundUrl = (metaPath) => {
    if (!bgContext) return null;
    if (!metaPath) {
      const keys = bgContext.keys();
      if (keys && keys.length) {
        const mod = bgContext(keys[0]);
        return mod.default || mod;
      }
      return null;
    }
    const name = metaPath.split('/').pop();
    const rel = `./${name}`;
    try {
      const mod = bgContext(rel);
      return mod.default || mod;
    } catch (e) {
      // fallback to first available
      const keys = bgContext.keys();
      if (keys && keys.length) {
        const mod = bgContext(keys[0]);
        return mod.default || mod;
      }
      return null;
    }
  };

  // Build or rebuild parallax tiling sprite layer
  const rebuildParallax = () => {
    const app = appRef.current;
    const layer = parallaxRef.current;
    if (!app || !layer) return;

    // Clear previous
    layer.removeChildren();
    parallaxSpriteRef.current = null;

    const url = resolveBackgroundUrl(backgroundImage);

    // If image exists, create TilingSprite; otherwise, solid color Sprite
    if (url) {
      // Ensure texture is created and repeatable
      const tex = getTexture(url);
      if (!tex) return;
      if (tex.baseTexture) {
        tex.baseTexture.wrapMode = WRAP_MODES.REPEAT;
      }

      // Scale the tiling pattern vertically so exactly one tile fills the full map height.
      const targetH = mapHeight * tileSize;
      const texH = (tex.height || tex.baseTexture?.height || 1);
      const scaleY = targetH / texH;

      const sprite = new TilingSprite({ texture: tex, width: mapWidth * tileSize, height: targetH });
      // Keep natural horizontal scale, stretch only vertically to avoid multi-row tiling
      sprite.tileScale.set(1, scaleY);
      sprite.x = 0;
      sprite.y = 0;
      // Depth look: slightly dim and blur
      sprite.alpha = 0.9;
      try {
        sprite.filters = [new BlurFilter({ strength: 1.2, quality: 2 })];
      } catch (e) { /* filters optional */ }
      layer.addChild(sprite);
      parallaxSpriteRef.current = sprite;
    } else {
      // Solid color fill
      const color = backgroundColor || '#87CEEB';
      const hex = (typeof color === 'string' && color.startsWith('#')) ? parseInt(color.slice(1), 16) : (Number(color) || 0x87CEEB);
      const solid = new Sprite(Texture.WHITE);
      solid.tint = hex;
      solid.width = mapWidth * tileSize;
      solid.height = mapHeight * tileSize;
      solid.alpha = 0.95;
      try {
        solid.filters = [new BlurFilter({ strength: 0.8, quality: 2 })];
      } catch (e) { /* optional */ }
      layer.addChild(solid);
      parallaxSpriteRef.current = solid;
    }
  };

  // Convert ms-per-frame (JSON) to Pixi AnimatedSprite speed factor (1 = 60fps)
  const msToSpeed = (ms) => {
    const m = Number(ms);
    const msPerFrame = Number.isFinite(m) && m > 0 ? m : 500;
    const fps = 1000 / msPerFrame;
    return fps / 60; // Pixi speed factor
  };

  const getRegItem = (id) => registryItems.find((r) => r.id === id);

  // Initialize Application
  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      const app = new Application();
      await app.init({
        width: mapWidth * tileSize,
        height: mapHeight * tileSize,
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
      });
      if (destroyed) { app.destroy(true); return; }

      appRef.current = app;

      const bg = new Container();
      const obj = new Container();
      const playerLayer = new Container();

      bgRef.current = bg;
      objRef.current = obj;

      // Parallax layer (behind everything)
      const parallaxLayer = new Container();
      parallaxRef.current = parallaxLayer;
      app.stage.addChild(parallaxLayer);
      app.stage.addChild(bg);
      app.stage.addChild(obj);
      app.stage.addChild(playerLayer);

      // Preload textures to avoid Assets cache warnings for data URLs and ensure textures are ready
      try {
        const urlSet = new Set();
        const addUrl = (u) => { if (typeof u === 'string' && u.length) urlSet.add(u); };
        registryItems.forEach((def) => {
          addUrl(def?.texture);
          if (Array.isArray(def?.textures)) def.textures.forEach(addUrl);
        });
        if (playerVisuals) {
          addUrl(playerVisuals.texture);
          if (Array.isArray(playerVisuals.textures)) playerVisuals.textures.forEach(addUrl);
        }
        const bgUrl = resolveBackgroundUrl(backgroundImage);
        if (bgUrl) addUrl(bgUrl);
        const urls = Array.from(urlSet);
        if (urls.length) {
          await Assets.load(urls);
        }
      } catch (e) {
        console.warn('Pixi Assets preload encountered an issue (continuing):', e);
      }

      // Create player sprite container
      let playerSprite = null;
      if (playerVisuals) {
        if (Array.isArray(playerVisuals.textures) && playerVisuals.textures.length > 1) {
          const frames = playerVisuals.textures.map((u) => getTexture(u)).filter(Boolean);
          if (frames.length > 0) {
            playerSprite = new AnimatedSprite(frames);
            playerSprite.animationSpeed = msToSpeed(playerVisuals.animationSpeed);
            playerSprite.play();
          }
        }
        if (!playerSprite) {
          const tex = getTexture(playerVisuals.texture) || Texture.WHITE;
          playerSprite = new Sprite(tex);
        }
      } else {
        // fallback placeholder
        playerSprite = new Sprite(Texture.WHITE);
        playerSprite.tint = 0x00ff00;
        playerSprite.width = tileSize;
        playerSprite.height = tileSize;
      }

      playerSprite.anchor.set(0, 0); // align top-left to match DOM positioning
      playerLayer.addChild(playerSprite);
      playerRef.current = playerSprite;

      // Mount canvas
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(app.canvas);
      }

      // Handle WebGL context loss/restoration gracefully to avoid crashes
      if (app.canvas) {
        app.canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault(); // allow Pixi to handle restoration
          console.warn('WebGL context was lost. Attempting to restore...');
        });
        app.canvas.addEventListener('webglcontextrestored', () => {
          console.info('WebGL context restored. Rebuilding layers...');
          rebuildLayers();
          rebuildParallax();
        });
      }

      // First draw of map layers
      rebuildLayers();
      // Build or rebuild parallax background
      rebuildParallax();

      // Update player and parallax each frame
      app.ticker.add(() => {
        const s = playerStateRef.current;
        // Update player sprite if available
        if (s && playerRef.current) {
          const p = playerRef.current;
          if (s.width) p.width = s.width;
          if (s.height) p.height = s.height;
          const dir = s.direction || 1;
          const mag = Math.abs(p.scale.x || 1);
          p.scale.x = dir >= 0 ? mag : -mag;
          const effectiveWidth = s.width || p.width || tileSize;
          p.x = dir >= 0 ? (s.x || 0) : ( (s.x || 0) + effectiveWidth );
          p.y = s.y || 0;
        }

        // Update parallax background tile offset based on camera scroll
        const f = Number(backgroundParallaxFactor) || 0.3;
        const camX = cameraScrollRef.current || 0;
        if (parallaxSpriteRef.current) {
          const spr = parallaxSpriteRef.current;
          if (spr.tilePosition) {
            spr.tilePosition.x = -camX * f;
            spr.tilePosition.y = 0;
          } else {
            // Solid color sprite: nothing to tile, keep static
          }
        }
      });
    };

    const rebuildLayers = () => {
      const app = appRef.current;
      if (!app || !bgRef.current || !objRef.current) return;

      // Clear previous
      bgRef.current.removeChildren();
      objRef.current.removeChildren();

      // Background tiles
      for (let i = 0; i < mapWidth * mapHeight; i++) {
        const id = tileMapData[i];
        if (!id) continue;
        const def = getRegItem(id);
        if (!def) continue;

        let sprite;
        let frames = null;
        if (Array.isArray(def.textures) && def.textures.length > 1) {
          frames = def.textures.map((u) => getTexture(u)).filter(Boolean);
        }
        if (frames && frames.length > 0) {
          sprite = new AnimatedSprite(frames);
          sprite.animationSpeed = msToSpeed(def.animationSpeed);
          sprite.play();
        } else {
          const tex = getTexture(def.texture) || null;
          if (!tex) continue;
          sprite = new Sprite(tex);
        }

        const x = (i % mapWidth) * tileSize;
        const y = Math.floor(i / mapWidth) * tileSize;
        sprite.x = x;
        sprite.y = y;
        sprite.width = tileSize;
        sprite.height = tileSize;
        bgRef.current.addChild(sprite);
      }

      // Objects (non-player)
      for (let i = 0; i < mapWidth * mapHeight; i++) {
        const id = objectMapData[i];
        if (!id || id.includes('player')) continue;
        const def = getRegItem(id);
        if (!def) continue;

        let sprite;
        let frames = null;
        if (Array.isArray(def.textures) && def.textures.length > 1) {
          frames = def.textures.map((u) => getTexture(u)).filter(Boolean);
        }
        if (frames && frames.length > 0) {
          sprite = new AnimatedSprite(frames);
          sprite.animationSpeed = msToSpeed(def.animationSpeed);
          sprite.play();
        } else {
          const tex = getTexture(def.texture) || null;
          if (!tex) continue;
          sprite = new Sprite(tex);
        }

        const x = (i % mapWidth) * tileSize;
        const y = Math.floor(i / mapWidth) * tileSize;
        sprite.x = x;
        sprite.y = y;
        sprite.width = tileSize;
        sprite.height = tileSize;
        objRef.current.addChild(sprite);
      }
    };

    init();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
      textureCacheRef.current.forEach((t) => t.destroy && t.destroy(true));
      textureCacheRef.current.clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapWidth, mapHeight, tileSize, playerVisuals]);

  // Rebuild layers when map data changes
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    // Rebuild background and object layers
    if (bgRef.current && objRef.current) {
      // Simple approach: full rebuild
      // Background
      bgRef.current.removeChildren();
      for (let i = 0; i < mapWidth * mapHeight; i++) {
        const id = tileMapData[i];
        if (!id) continue;
        const def = registryItems.find((r) => r.id === id);
        if (!def) continue;

        let sprite;
        let frames = null;
        if (Array.isArray(def.textures) && def.textures.length > 1) {
          frames = def.textures.map((u) => getTexture(u)).filter(Boolean);
        }
        if (frames && frames.length > 0) {
          sprite = new AnimatedSprite(frames);
          sprite.animationSpeed = msToSpeed(def.animationSpeed);
          sprite.play();
        } else {
          const tex = getTexture(def.texture) || null;
          if (!tex) continue;
          sprite = new Sprite(tex);
        }
        const x = (i % mapWidth) * tileSize;
        const y = Math.floor(i / mapWidth) * tileSize;
        sprite.x = x;
        sprite.y = y;
        sprite.width = tileSize;
        sprite.height = tileSize;
        bgRef.current.addChild(sprite);
      }

      // Objects
      objRef.current.removeChildren();
      for (let i = 0; i < mapWidth * mapHeight; i++) {
        const id = objectMapData[i];
        if (!id || id.includes('player')) continue;
        const def = registryItems.find((r) => r.id === id);
        if (!def) continue;

        let sprite;
        let frames = null;
        if (Array.isArray(def.textures) && def.textures.length > 1) {
          frames = def.textures.map((u) => getTexture(u)).filter(Boolean);
        }
        if (frames && frames.length > 0) {
          sprite = new AnimatedSprite(frames);
          sprite.animationSpeed = msToSpeed(def.animationSpeed);
          sprite.play();
        } else {
          const tex = getTexture(def.texture) || null;
          if (!tex) continue;
          sprite = new Sprite(tex);
        }
        const x = (i % mapWidth) * tileSize;
        const y = Math.floor(i / mapWidth) * tileSize;
        sprite.x = x;
        sprite.y = y;
        sprite.width = tileSize;
        sprite.height = tileSize;
        objRef.current.addChild(sprite);
      }
    }
  }, [tileMapData, objectMapData, registryItems, mapWidth, mapHeight, tileSize]);

  // Rebuild parallax when props change
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    rebuildParallax();
  }, [backgroundImage, backgroundColor, backgroundParallaxFactor, mapWidth, mapHeight, tileSize]);

  // Resize application when map size changes
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    app.renderer.resize(mapWidth * tileSize, mapHeight * tileSize);
    // Resize parallax tiling sprite too and recalc vertical tile scale
    if (parallaxSpriteRef.current) {
      const spr = parallaxSpriteRef.current;
      spr.width = mapWidth * tileSize;
      spr.height = mapHeight * tileSize;
      const tex = spr.texture;
      const texH = (tex?.height || tex?.baseTexture?.height || 1);
      const scaleY = (mapHeight * tileSize) / texH;
      spr.tileScale.set(1, scaleY);
    }
  }, [mapWidth, mapHeight, tileSize]);

  return (
    <div
      ref={mountRef}
      style={{ width: mapWidth * tileSize, height: mapHeight * tileSize }}
    />
  );
};

export default PixiStage;
