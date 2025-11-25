import React, { useState, useEffect } from 'react';
import { getRegistry } from '../../GameRegistry';
import AnimatedItem from '../../utilites/AnimatedItem';

export default function Repository() {
    const registryItems = getRegistry();

    // Stils konteinerim, lai elementi izkārtotos glīti (Grid)
    const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px'
    };

    // Stils katrai kartītei
    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    };

    // Stils bildei (64x64)
    const imageStyle = {
        width: '64px',
        height: '64px',
        objectFit: 'contain', // Lai bilde neizstaipītos, ja proporcijas nav perfektas
        imageRendering: 'pixelated', // Svarīgi pikseļu grafikai (2D spēlēm)
        marginBottom: '10px',
        border: '1px dashed #aaa'
    };

    const fieldsContainerStyle = {
        width: '100%',
        fontSize: '12px',
        textAlign: 'left'
    };

    return (
        <div style={containerStyle}>
            {registryItems.map((item, index) => (
                <div key={item.id || index} style={cardStyle}>
                    
                    {/* Izvēlamies: Animācija vai Parasta bilde */}
                    {item.textures && item.textures.length > 0 ? (
                        <AnimatedItem
                            textures={item.textures}
                            texture={item.texture}
                            speed={item.animationSpeed}
                            style={imageStyle}
                            alt={item.name}
                        />
                    ) : (
                        <img 
                            src={item.texture} 
                            alt={item.name} 
                            style={imageStyle}
                            onError={(e) => { e.target.style.display = 'none'; }} 
                        />
                    )}

                    {/* Filtrējam ārā gan 'texture', gan 'textures', gan 'animationSpeed' no teksta saraksta */}
                    <div style={fieldsContainerStyle}>
                        {Object.entries(item)
                            .filter(([key]) => !['texture', 'textures', 'animationSpeed'].includes(key))
                            .map(([key, value]) => (
                                <div key={key} style={{ marginBottom: '4px', wordBreak: 'break-all' }}>
                                    <strong>{key}:</strong> 
                                    <span style={{ marginLeft: '5px', color: '#555' }}>
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </span>
                                </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {registryItems.length === 0 && <p>No items found in registry.</p>}
        </div>
    );
}