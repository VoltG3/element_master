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
            switch (e.code) {
                case 'KeyW': keys.current.w = true; break;
                case 'KeyA': keys.current.a = true; break;
                case 'KeyS': keys.current.s = true; break;
                case 'KeyD': keys.current.d = true; break;
                case 'Space': keys.current.space = true; break;
                default: break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW': keys.current.w = false; break;
                case 'KeyA': keys.current.a = false; break;
                case 'KeyS': keys.current.s = false; break;
                case 'KeyD': keys.current.d = false; break;
                case 'Space': keys.current.space = false; break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keys;
};