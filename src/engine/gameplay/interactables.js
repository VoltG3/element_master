// Interactables logic - objects that can be used once and change state
// Unlike items (which disappear), interactables stay but change texture

export function checkInteractables(ctx, currentX, currentY, mapWidth, objectLayerData) {
  const { registryItems, TILE_SIZE, MAX_HEALTH, playShotSfx, onStateUpdate, gameState } = ctx;
  if (!objectLayerData) return;

  const centerX = currentX + gameState.current.width / 2;
  const centerY = currentY + gameState.current.height / 2;

  const gridX = Math.floor(centerX / TILE_SIZE);
  const gridY = Math.floor(centerY / TILE_SIZE);
  const index = gridY * mapWidth + gridX;
  if (index < 0 || index >= objectLayerData.length) return;

  const objId = objectLayerData[index];
  if (!objId) return;

  const objDef = registryItems.find(r => r.id === objId);
  if (!objDef || !objDef.name || !objDef.name.startsWith('interactable.')) return;

  // Check if already used (track used interactables in gameState)
  if (!gameState.current.usedInteractables) {
    gameState.current.usedInteractables = new Set();
  }

  if (gameState.current.usedInteractables.has(index)) return; // Already used

  // Check if has effect
  if (!objDef.effect) return;

  // Health effect
  if (objDef.effect.health) {
    const healthBonus = parseInt(objDef.effect.health, 10);
    if (gameState.current.health >= MAX_HEALTH) return; // Don't use if already full health

    const newHealth = Math.min(gameState.current.health + healthBonus, MAX_HEALTH);
    gameState.current.health = newHealth;

    // Play sound
    try {
      const vol = Math.max(0, Math.min(1, objDef?.sfxVolume ?? 1));
      playShotSfx(objDef?.sfx, vol);
    } catch {}

    // Mark as used
    gameState.current.usedInteractables.add(index);

    // Notify state update with 'interactable' event - this will switch to next texture
    if (onStateUpdate) onStateUpdate('interactable', index);
    return;
  }

  // Future: Add other interactable effects (ammo, etc.)
  if (objDef.effect.fireball) {
    const ammoBonus = parseInt(objDef.effect.fireball, 10) || 0;
    gameState.current.ammo = Math.max(0, (gameState.current.ammo || 0) + ammoBonus);

    try {
      const vol = Math.max(0, Math.min(1, objDef?.sfxVolume ?? 1));
      playShotSfx(objDef?.sfx, vol);
    } catch {}

    gameState.current.usedInteractables.add(index);
    if (onStateUpdate) onStateUpdate('interactable', index);
    return;
  }
}
