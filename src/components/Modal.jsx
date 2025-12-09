/**
 * Modal Component with Styled Components and PropTypes
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.overlay};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.textDark};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: ${props => props.$width || '500px'};
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ModalHeader = styled.h2`
  margin: 0;
  border-bottom: 2px solid ${props => props.theme.colors.borderLight};
  padding-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.xl};
  color: ${props => props.theme.colors.text};
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Modal = ({ isOpen, onClose, title, children, width, className }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick} className={className}>
      <ModalContent $width={width} onClick={(e) => e.stopPropagation()}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  className: PropTypes.string,
};

export default Modal;
