/**
 * Button Component with Styled Components and PropTypes
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.$size === 'small' ? '6px 12px' : props.$size === 'large' ? '12px 24px' : '8px 16px'};
  background-color: ${props => {
    if (props.disabled) return props.theme.colors.lightGray;
    switch (props.$variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'danger': return props.theme.colors.danger;
      default: return props.theme.colors.primary;
    }
  }};
  color: ${props => props.theme.colors.textDark};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.$size === 'small' ? props.theme.fontSize.sm : props.theme.fontSize.base};
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: ${props => props.theme.transitions.normal};
  opacity: ${props => props.disabled ? 0.6 : 1};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    opacity: ${props => props.disabled ? 0.6 : 0.9};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className,
  ...rest
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      className={className}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;
