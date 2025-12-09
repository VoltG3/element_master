import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    z-index: 1000;
    pointer-events: none;
`;

const AmmoDisplay = styled.div`
    font-size: 28px;
    font-weight: bold;
    color: rgba(255, 200, 50, 0.95);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    font-family: monospace;
    pointer-events: none;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const HealthDisplay = styled.div`
    font-size: 32px;
    font-weight: bold;
    color: rgba(255, 50, 50, 0.9);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    font-family: monospace;
    pointer-events: none;
`;

const SoundButton = styled.button`
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    margin-left: 12px;
    user-select: none;
    pointer-events: auto;
    color: #fff;
    background-color: ${props => props.$enabled ? 'rgba(40, 140, 60, 0.9)' : 'rgba(160, 40, 40, 0.9)'};
    border-color: ${props => props.$enabled ? '#2e7d32' : '#7f1d1d'};

    &:hover {
        opacity: 0.9;
    }
`;

const GameHeader = ({ health, ammo = 0, soundEnabled = false, onToggleSound }) => {
    return (
        <HeaderContainer>
            <AmmoDisplay>
                🔥 {ammo || 0}
            </AmmoDisplay>

            <RightSection>
                <HealthDisplay>
                    ❤️ {health}
                </HealthDisplay>
                <SoundButton
                    $enabled={soundEnabled}
                    onClick={() => {
                        if (typeof onToggleSound === 'function') onToggleSound();
                        try { window.dispatchEvent(new CustomEvent('game-sound-user-gesture')); } catch {}
                    }}
                    title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
                >
                    {soundEnabled ? 'Sound ON' : 'Sound OFF'}
                </SoundButton>
            </RightSection>
        </HeaderContainer>
    );
};

GameHeader.propTypes = {
    health: PropTypes.number.isRequired,
    ammo: PropTypes.number,
    soundEnabled: PropTypes.bool,
    onToggleSound: PropTypes.func.isRequired
};

export default GameHeader;