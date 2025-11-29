import { useEffect, useRef } from 'react';

export const useInput = () => {
    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent browser scrolling / focus hijack for game controls
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                case 'KeyA':
                case 'ArrowLeft':
                case 'KeyS':
                case 'ArrowDown':
                case 'KeyD':
                case 'ArrowRight':
                case 'Space':
                    if (typeof e.preventDefault === 'function') e.preventDefault();
                    break;
                default:
                    break;
            }
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keys.current.w = true; break;
                case 'KeyA':
                case 'ArrowLeft':
                    keys.current.a = true; break;
                case 'KeyS':
                case 'ArrowDown':
                    keys.current.s = true; break;
                case 'KeyD':
                case 'ArrowRight':
                    keys.current.d = true; break;
                case 'Space': keys.current.space = true; break;
                default: break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    keys.current.w = false; break;
                case 'KeyA':
                case 'ArrowLeft':
                    keys.current.a = false; break;
                case 'KeyS':
                case 'ArrowDown':
                    keys.current.s = false; break;
                case 'KeyD':
                case 'ArrowRight':
                    keys.current.d = false; break;
                case 'Space': keys.current.space = false; break;
                default: break;
            }
        };

        // non-passive to allow preventDefault on Space/Arrow keys
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown, { passive: false });
            window.removeEventListener('keyup', handleKeyUp, { passive: false });
        };
    }, []);

    return keys;
};