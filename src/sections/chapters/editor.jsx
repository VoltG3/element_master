

import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameRegistry from '../../GameRegistry';

export const Editor = () => {
  // 1. Definējam stāvokļus (State)
  const [mapWidth, setMapWidth] = useState(20);
  const [mapHeight, setMapHeight] = useState(15);
  const [currentMapData, setCurrentMapData] = useState([]); 
  const [selectedTile, setSelectedTile] = useState(null);
  const [showGrid, setShowGrid] = useState(true); // 2. Grid toggle stāvoklis

  // Refs priekš resize loģikas, lai piekļūtu aktuālajiem datiem event listeneros
  const stateRef = useRef({ mapWidth, mapHeight, currentMapData });
  useEffect(() => {
      stateRef.current = { mapWidth, mapHeight, currentMapData };
  }, [mapWidth, mapHeight, currentMapData]);

  // Inicializējam tukšu karti pirmajā reizē
  useEffect(() => {
    const initialMap = Array(15 * 20).fill(null);
    setCurrentMapData(initialMap);
  }, []);

  const registryItems = Array.isArray(GameRegistry) ? GameRegistry : [];
  
  const blocks = registryItems.filter(item => item.name && item.name.startsWith('block.'));
  const entities = registryItems.filter(item => item.name && item.name.startsWith('entities.'));
  const items = registryItems.filter(item => item.name && item.name.startsWith('item.'));

  // 3. Vienots stils pogām
  const buttonStyle = {
      display: 'inline-block',
      cursor: 'pointer',
      border: '1px solid #333',
      padding: '4px 8px',
      backgroundColor: '#e0e0e0',
      marginRight: '8px',
      marginBottom: '8px',
      fontSize: '13px',
      color: '#000',
      textDecoration: 'none',
      borderRadius: '3px',
      userSelect: 'none'
  };

  const saveMap = () => {
    const mapData = {
      width: mapWidth,
      height: mapHeight,
      tiles: currentMapData 
    };
    const fileName = "level_01.json";
    const json = JSON.stringify(mapData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadMap = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (file) {
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        try {
          const loadedMap = JSON.parse(e.target.result);
          if (loadedMap.width) setMapWidth(loadedMap.width);
          if (loadedMap.height) setMapHeight(loadedMap.height);
          if (loadedMap.tiles) setCurrentMapData(loadedMap.tiles);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
    }
  };

  const handleTileClick = (index) => {
      if (!selectedTile) return;
      const newData = [...currentMapData];
      newData[index] = selectedTile.id; 
      setCurrentMapData(newData);
  };

  // 4. Resize loģika (Datu pārnešana)
  const resizeMapData = (newWidth, newHeight) => {
      const { mapWidth: oldW, mapHeight: oldH, currentMapData: oldData } = stateRef.current;

      if (newWidth < 1 || newHeight < 1) return;
      if (newWidth === oldW && newHeight === oldH) return;

      const newMapData = Array(newWidth * newHeight).fill(null);

      // Kopējam vecos datus uz jauno masīvu, saglabājot (x, y) pozīcijas
      for (let y = 0; y < Math.min(oldH, newHeight); y++) {
          for (let x = 0; x < Math.min(oldW, newWidth); x++) {
              const oldIndex = y * oldW + x;
              const newIndex = y * newWidth + x;
              newMapData[newIndex] = oldData[oldIndex];
          }
      }

      setMapWidth(newWidth);
      setMapHeight(newHeight);
      setCurrentMapData(newMapData);
  };

  // Mouse Event Handlers priekš Resize
  const handleMouseDown = (direction) => (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const { mapWidth: startW, mapHeight: startH } = stateRef.current;
      const TILE_SIZE = 32;

      const onMouseMove = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          if (direction === 'width') {
              const colsDiff = Math.round(dx / TILE_SIZE);
              const newW = startW + colsDiff;
              if (newW !== stateRef.current.mapWidth) {
                  resizeMapData(newW, stateRef.current.mapHeight);
              }
          } else if (direction === 'height') {
              const rowsDiff = Math.round(dy / TILE_SIZE);
              const newH = startH + rowsDiff;
              if (newH !== stateRef.current.mapHeight) {
                  resizeMapData(stateRef.current.mapWidth, newH);
              }
          }
      };

      const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  };

  // Palīgfunkcija, lai atrastu bildi priekš paletes
  const renderPaletteItem = (item, color) => (
      <div 
          key={item.id} 
          onClick={() => setSelectedTile(item)}
          title={item.name}
          style={{ 
              border: selectedTile?.id === item.id ? `2px solid ${color}` : '1px solid #ccc', 
              cursor: 'pointer', 
              padding: '2px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff'
          }}
      >
          {item.textures && item.textures[0] ? 
              <img src={item.textures[0]} alt={item.name} style={{maxWidth:'100%', maxHeight:'100%'}} /> :
          item.texture ? 
              <img src={item.texture} alt={item.name} style={{maxWidth:'100%', maxHeight:'100%'}} /> :
              <span style={{fontSize:'10px', overflow:'hidden'}}>{item.name}</span>
          }
      </div>
  );

  return (
    <div className="editor-container" style={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
      {/* Sānjosla */}
      <div className="toolbar" style={{ width: '280px', padding: '15px', borderRight: '1px solid #ccc', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f8f8' }}>
        <div style={{ marginBottom: '20px' }}>
            <button onClick={saveMap} style={buttonStyle}>Save Map</button>
            <label style={buttonStyle}>
                Load Map
                <input type="file" accept=".json,.txt" onChange={loadMap} style={{display: 'none'}} />
            </label>
            <button onClick={() => setShowGrid(!showGrid)} style={buttonStyle}>
                Grid: {showGrid ? 'ON' : 'OFF'}
            </button>
        </div>

        <div className="palette" style={{ flex: 1 }}>
            <h4>Blocks</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {blocks.map(b => renderPaletteItem(b, 'blue'))}
            </div>

            <h4>Entities</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {entities.map(e => renderPaletteItem(e, 'red'))}
            </div>

            <h4>Items</h4>
            {/* 1. Tagad Items arī rāda bildes */}
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {items.map(i => renderPaletteItem(i, 'green'))}
            </div>
        </div>
        
        {/* 5. Mapes izmērs */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #ccc', fontSize: '12px' }}>
            Map Size: <strong>{mapWidth} x {mapHeight}</strong>
        </div>
      </div>

      {/* Viewport ar Resize iespējām */}
      <div className="viewport" style={{ flex: 1, padding: '40px', backgroundColor: '#555', overflow: 'auto', position: 'relative' }}>
        <div style={{ position: 'relative', width: 'fit-content' }}>
            
            {/* GRID */}
            <div 
                className="grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${mapWidth}, 32px)`,
                    gridTemplateRows: `repeat(${mapHeight}, 32px)`,
                    gap: showGrid ? '1px' : '0px',
                    border: '1px solid #222',
                    backgroundColor: '#222'
                }}
            >
                {currentMapData.map((tileId, index) => {
                    const obj = registryItems.find(r => r.id === tileId);
                    let imgSrc = null;
                    if (obj) {
                        if (obj.texture) imgSrc = obj.texture;
                        else if (obj.textures && obj.textures.length > 0) imgSrc = obj.textures[0];
                    }

                    return (
                        <div 
                            key={index} 
                            onClick={() => handleTileClick(index)}
                            style={{ 
                                width: '32px', 
                                height: '32px', 
                                backgroundColor: '#fff', 
                                // border: showGrid ? '1px solid #eee' : 'none', // Robežas var būt traucējošas ar gap, bet var atstāt
                                boxSizing: 'border-box',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {imgSrc && <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />}
                        </div>
                    );
                })}
            </div>

            {/* Resize Rokturi */}
            {/* Labā mala */}
            <div 
                onMouseDown={handleMouseDown('width')}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: -15,
                    width: '15px',
                    height: '100%',
                    backgroundColor: '#777',
                    cursor: 'col-resize',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: '5px',
                    borderBottomRightRadius: '5px'
                }}
            >
                <span style={{color: '#ccc', fontSize: '20px'}}>⋮</span>
            </div>

            {/* Apakšējā mala */}
            <div 
                onMouseDown={handleMouseDown('height')}
                style={{
                    position: 'absolute',
                    bottom: -15,
                    left: 0,
                    width: '100%',
                    height: '15px',
                    backgroundColor: '#777',
                    cursor: 'row-resize',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: '5px',
                    borderBottomRightRadius: '5px'
                }}
            >
                <span style={{color: '#ccc', fontSize: '20px'}}>⋯</span>
            </div>

        </div>
      </div>
    </div>
  );
};