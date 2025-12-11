import React from 'react';
import { buttonStyle } from './constants';

export const NewMapModal = ({
    isOpen,
    tempMapName,
    setTempMapName,
    tempCreatorName,
    setTempCreatorName,
    confirmNewMap,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px',
                display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
                <h3 style={{ marginTop: 0 }}>Create New Map</h3>

                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Map Name:</label>
                    <input
                        type="text"
                        value={tempMapName}
                        onChange={(e) => setTempMapName(e.target.value)}
                        style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Creator Nickname:</label>
                    <input
                        type="text"
                        value={tempCreatorName}
                        onChange={(e) => setTempCreatorName(e.target.value)}
                        style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#f0f0f0' }}>Cancel</button>
                    <button onClick={confirmNewMap} style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white', borderColor: '#4CAF50' }}>Create</button>
                </div>
            </div>
        </div>
    );
};
