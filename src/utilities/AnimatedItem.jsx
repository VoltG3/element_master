import React, { useState, useEffect } from 'react';

const AnimatedItem = ({ textures, texture, speed, style, alt, className }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Ja ir vairākas tekstūras, sākam animāciju
        if (textures && textures.length > 1) {
            const interval = setInterval(() => {
                setIndex((prevIndex) => (prevIndex + 1) % textures.length);
            }, speed || 500); // Noklusējuma ātrums 500ms

            return () => clearInterval(interval);
        }
    }, [textures, speed]);

    // Izvēlamies ko renderēt: animācijas kadru, vienīgo tekstūru vai statisko bildi
    let imgSrc = null;
    if (textures && textures.length > 0) {
        imgSrc = textures[index % textures.length];
    } else if (texture) {
        imgSrc = texture;
    }

    if (!imgSrc) return null;

    return (
        <img
            src={imgSrc}
            alt={alt || ''}
            style={style}
            className={className}
            draggable={false} // Bieži noderīgi spēlēs/editoros
        />
    );
};

export default AnimatedItem;