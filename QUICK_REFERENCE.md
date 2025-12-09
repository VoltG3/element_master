# Quick Reference Guide

## 🚀 Quick Start Patterns

### Import Paths Reference

```javascript
// Registry
import { getRegistry, findItemById } from './engine/registry';

// Constants
import { TILE_SIZE, GRAVITY, MAX_HEALTH } from './constants/gameConstants';

// Redux Store & Slices
import store from './store';
import { setActiveMap } from './store/slices/gameSlice';
import { setHealth, addAmmo } from './store/slices/playerSlice';
import { setSoundEnabled } from './store/slices/settingsSlice';
import { setMapModalOpen } from './store/slices/uiSlice';

// Error Handler
import errorHandler from './services/errorHandler';

// Styled Components
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Button from './components/Button';
import Modal from './components/Modal';
```

---

## 🎨 Styled Components Examples

### Basic Styled Component
```javascript
import styled from 'styled-components';

const Container = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;
```

### With Props
```javascript
const Button = styled.button`
  background: ${props => props.$primary ?
    props.theme.colors.primary :
    props.theme.colors.secondary};
  padding: ${props => props.$large ? '12px 24px' : '8px 16px'};
`;

// Usage
<Button $primary $large>Click me</Button>
```

### Using Theme
```javascript
// Access in component
const MyComponent = styled.div`
  color: ${props => props.theme.colors.primary};
  margin: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;
```

---

## 🔄 Redux Usage Patterns

### Reading State
```javascript
import { useSelector } from 'react-redux';

const Component = () => {
  // Select single value
  const health = useSelector(state => state.player.health);

  // Select multiple values
  const { x, y, direction } = useSelector(state => ({
    x: state.player.x,
    y: state.player.y,
    direction: state.player.direction,
  }));

  // Select with computation
  const isAlive = useSelector(state => state.player.health > 0);
};
```

### Dispatching Actions
```javascript
import { useDispatch } from 'react-redux';
import { setHealth, addAmmo } from '../store/slices/playerSlice';

const Component = () => {
  const dispatch = useDispatch();

  const heal = () => {
    dispatch(setHealth(100));
  };

  const pickupAmmo = (amount) => {
    dispatch(addAmmo(amount));
  };
};
```

### Custom Hooks
```javascript
// Create reusable selectors
import { useSelector } from 'react-redux';

export const usePlayer = () => {
  return useSelector(state => state.player);
};

export const usePlayerHealth = () => {
  return useSelector(state => state.player.health);
};

export const useIsGamePaused = () => {
  return useSelector(state => state.game.isPaused);
};

// Usage
const Component = () => {
  const health = usePlayerHealth();
  const isPaused = useIsGamePaused();
};
```

---

## 🛡️ PropTypes Examples

### Basic PropTypes
```javascript
import PropTypes from 'prop-types';

const Component = ({ name, age, isActive }) => {
  // ...
};

Component.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool,
};

Component.defaultProps = {
  age: 0,
  isActive: false,
};
```

### Complex PropTypes
```javascript
Component.propTypes = {
  // Arrays
  items: PropTypes.arrayOf(PropTypes.string),
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),

  // Objects
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
  }),

  // Functions
  onClick: PropTypes.func,
  onChange: PropTypes.func.isRequired,

  // One of specific values
  status: PropTypes.oneOf(['pending', 'active', 'completed']),

  // One of specific types
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  // Any renderable content
  children: PropTypes.node,

  // React element
  icon: PropTypes.element,

  // Custom validator
  customProp: (props, propName, componentName) => {
    if (props[propName] < 0) {
      return new Error(`${propName} must be positive`);
    }
  },
};
```

---

## 🚨 Error Handling Patterns

### Basic Error Handling
```javascript
import errorHandler from '../services/errorHandler';

try {
  // Your code
  riskyOperation();
} catch (error) {
  errorHandler.error(error, {
    context: 'ComponentName',
    userId: user.id
  });
}
```

### Different Log Levels
```javascript
// Debug (only in development)
errorHandler.debug('Debug info', { data: someData });

// Info
errorHandler.info('User logged in', { userId: 123 });

// Warning
errorHandler.warn('Deprecated function used', { function: 'oldFunc' });

// Error
errorHandler.error('Critical error', { stackTrace: err.stack });
```

### Wrapping Functions
```javascript
// Async function
const safeFetch = errorHandler.wrapAsync(async (url) => {
  const response = await fetch(url);
  return response.json();
}, { context: 'API_FETCH' });

// Usage
const data = await safeFetch('/api/data');

// Sync function
const safeCalculation = errorHandler.wrapSync((a, b) => {
  return complexMath(a, b);
}, { context: 'MATH_MODULE' });

const result = safeCalculation(10, 20);
```

### Adding Error Listeners
```javascript
// Add custom error handler
errorHandler.addListener((error, context) => {
  // Send to analytics
  analytics.track('error', {
    message: error.message,
    ...context,
  });
});
```

---

## 🎮 Game Engine Patterns

### Using Constants
```javascript
import {
  TILE_SIZE,
  GRAVITY,
  MAX_HEALTH,
  SHOOT_COOLDOWN,
} from '../constants/gameConstants';

const updatePhysics = (player) => {
  player.vy += GRAVITY;
  if (player.vy > TERMINAL_VELOCITY) {
    player.vy = TERMINAL_VELOCITY;
  }
};
```

### Registry Access
```javascript
import { getRegistry, findItemById } from '../engine/registry';

// Get all items
const allItems = getRegistry();

// Find specific item
const player = findItemById('player_default_100');
const fireball = findItemById('projectile_fireball');

// Check if exists
if (player && player.texture) {
  // Use player data
}
```

---

## 📦 Component Structure Template

```javascript
/**
 * ComponentName
 * Description of what this component does
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import errorHandler from '../services/errorHandler';

// Styled components
const Container = styled.div`
  /* styles */
`;

const ComponentName = ({ prop1, prop2, children }) => {
  // Redux
  const stateValue = useSelector(state => state.slice.value);
  const dispatch = useDispatch();

  // Local state
  const [localState, setLocalState] = React.useState(null);

  // Effects
  React.useEffect(() => {
    try {
      // Effect logic
    } catch (error) {
      errorHandler.error(error, { context: 'ComponentName' });
    }
  }, []);

  // Handlers
  const handleClick = () => {
    try {
      // Handle logic
    } catch (error) {
      errorHandler.error(error, { context: 'handleClick' });
    }
  };

  // Render
  return (
    <Container>
      {children}
    </Container>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  children: PropTypes.node,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

---

## 🔑 Common Patterns

### Conditional Rendering
```javascript
// With styled-components
const Button = styled.button`
  display: ${props => props.$hidden ? 'none' : 'block'};
`;

<Button $hidden={!isVisible}>Click</Button>

// In JSX
{isLoading && <Spinner />}
{error ? <ErrorMessage /> : <Content />}
```

### Lists & Keys
```javascript
const items = useSelector(state => state.game.objectMapData);

return (
  <>
    {items.map((item, index) => (
      item && <Item key={item.id || index} data={item} />
    ))}
  </>
);
```

### Event Handlers
```javascript
// With parameters
const handleItemClick = (itemId) => {
  dispatch(selectItem(itemId));
};

<Item onClick={() => handleItemClick(item.id)} />

// Prevent default
const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(submitForm(formData));
};
```

---

## 🎯 Best Practices

### Do's ✅
- Use constants instead of magic numbers
- Add PropTypes to all components
- Wrap risky operations with errorHandler
- Use Redux for global state
- Use styled-components for styling
- Add JSDoc comments to functions
- Use meaningful variable names

### Don'ts ❌
- Don't use inline styles
- Don't ignore PropTypes warnings
- Don't use console.log (use errorHandler)
- Don't hardcode colors/sizes (use theme)
- Don't repeat constants across files
- Don't ignore error handling

---

## 📚 Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Styled Components Docs](https://styled-components.com/)
- [PropTypes Docs](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [React Hooks Docs](https://reactjs.org/docs/hooks-intro.html)

---

**Last Updated:** 2025-12-09
