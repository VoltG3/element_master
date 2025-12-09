# Migration Checklist

Use this checklist to gradually migrate the codebase to use the new architecture.

---

## Phase 1: Immediate Changes (Ready to Use Now) ✅

### ✅ Start Using New Patterns

- [x] Redux store is set up and ready
- [x] Theme system is configured
- [x] Error handler is ready
- [x] Constants are defined
- [x] Base components created

### 🎯 Action Items:

#### For New Code:
- [ ] Use `Button` component instead of styled buttons
- [ ] Use `Modal` component for dialogs
- [ ] Import constants from `gameConstants.js`
- [ ] Use `errorHandler` for error logging
- [ ] Import from `engine/registry` (not `GameRegistry`)

#### Example Conversions:

```javascript
// ❌ OLD
<button style={{ padding: '8px', background: '#4CAF50' }}>Click</button>

// ✅ NEW
import Button from '../components/Button';
<Button variant="primary">Click</Button>
```

```javascript
// ❌ OLD
const TILE_SIZE = 32;

// ✅ NEW
import { TILE_SIZE } from '../constants/gameConstants';
```

---

## Phase 2: Update Imports (Low Risk) 📦

### Import Path Updates

Find and replace these imports across all files:

#### Registry Imports
```bash
# Find files using old import
grep -r "from './GameRegistry'" src/
grep -r "from '../GameRegistry'" src/
grep -r "from '../../GameRegistry'" src/

# Replace with:
from './engine/registry'
from '../engine/registry'
from '../../engine/registry'
```

**Files to Update:**
- [ ] `src/sections/chapters/game.jsx`
- [ ] `src/sections/chapters/editor.jsx`
- [ ] `src/utilites/useGameEngine.js`
- [ ] Any other files importing GameRegistry

#### Engine Imports (if any old paths remain)
```bash
# Find old engine imports
grep -r "from './GameEngine/" src/
grep -r "from '../GameEngine/" src/

# Replace with engine/ paths
```

---

## Phase 3: Add PropTypes (Medium Effort) 🛡️

### Components Needing PropTypes

#### High Priority (User-facing):
- [ ] `src/sections/chapters/Game.jsx`
- [ ] `src/sections/chapters/GameHeader.jsx`
- [ ] `src/sections/chapters/GameSettings.jsx`
- [ ] `src/sections/chapters/GameTerminal.jsx`
- [ ] `src/sections/chapters/PixiStage.jsx`

#### Medium Priority:
- [ ] `src/utilites/BackgroundMusicPlayer.jsx`
- [ ] `src/utilites/AnimatedItem.jsx`
- [ ] `src/sections/chapters/Home.jsx`
- [ ] `src/sections/chapters/Editor.jsx`
- [ ] `src/sections/chapters/Crystals.jsx`
- [ ] `src/sections/chapters/Repository.jsx`

#### Low Priority:
- [ ] `src/sections/section.header.js`
- [ ] `src/sections/section.footer.js`
- [ ] `src/sections/section.content.js`
- [ ] Navigation components

### PropTypes Template:

```javascript
import PropTypes from 'prop-types';

ComponentName.propTypes = {
  // Add all props with their types
  propName: PropTypes.string.isRequired,
  optionalProp: PropTypes.number,
  callback: PropTypes.func,
  children: PropTypes.node,
};

ComponentName.defaultProps = {
  optionalProp: 0,
};
```

---

## Phase 4: Convert to Styled Components (High Effort) 🎨

### Files with Inline Styles to Convert

#### Priority 1 (Complex, reusable styles):
- [ ] `src/sections/chapters/game.jsx`
  - Modal overlay
  - Modal content
  - Map card
  - Button styles

- [ ] `src/sections/chapters/GameHeader.jsx`
  - Header container
  - Stats display
  - Button styles

- [ ] `src/sections/chapters/GameSettings.jsx`
  - Settings panel
  - Form elements
  - Sliders/inputs

- [ ] `src/sections/chapters/GameTerminal.jsx`
  - Terminal container
  - Command input
  - Output display

#### Priority 2 (Simpler components):
- [ ] `src/sections/section.header.js`
- [ ] `src/sections/section.footer.js`
- [ ] `src/sections/section.content.js`
- [ ] Navigation components

#### Priority 3 (Low complexity):
- [ ] Other section files as needed

### Conversion Template:

```javascript
// 1. Import styled-components
import styled from 'styled-components';

// 2. Create styled components
const Container = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;

// 3. Replace inline styles with styled components
// OLD:
<div style={{ padding: '16px', background: '#111', borderRadius: '8px' }}>

// NEW:
<Container>
```

---

## Phase 5: Migrate to Redux (High Effort, High Value) 🔄

### State Migration Plan

#### Step 1: Game State
- [ ] Move `activeMapData` to Redux (`gameSlice`)
- [ ] Move `tileMapData` to Redux
- [ ] Move `objectMapData` to Redux
- [ ] Move `mapWidth/mapHeight` to Redux
- [ ] Update `game.jsx` to use Redux

**Benefit:** Eliminates passing map data through multiple components

#### Step 2: Player State
- [ ] Refactor `useGameEngine` to dispatch to Redux
- [ ] Move player state from hook to `playerSlice`
- [ ] Update components reading player state

**Benefit:** Player state accessible anywhere without props

#### Step 3: UI State
- [ ] Move `isModalOpen` to Redux (`uiSlice`)
- [ ] Move `isSettingsOpen` to Redux
- [ ] Move `isTerminalOpen` to Redux
- [ ] Update modal controls

**Benefit:** UI state management centralized

#### Step 4: Settings State
- [ ] Move `soundEnabled` to Redux (`settingsSlice`)
- [ ] Move `runtimeSettings` to Redux
- [ ] Hook up localStorage persistence

**Benefit:** Settings persist automatically

### Redux Migration Template:

```javascript
// 1. Import Redux hooks
import { useSelector, useDispatch } from 'react-redux';
import { setActiveMap } from '../store/slices/gameSlice';

// 2. Replace useState with Redux
// OLD:
const [mapData, setMapData] = useState(null);

// NEW:
const mapData = useSelector(state => state.game.activeMapData);
const dispatch = useDispatch();

// 3. Replace setState with dispatch
// OLD:
setMapData(newData);

// NEW:
dispatch(setActiveMap(newData));
```

---

## Phase 6: Error Handling Integration 🚨

### Add Error Handling to Critical Functions

#### High Priority:
- [ ] `src/utilites/useGameEngine.js`
  - Wrap game loop with error handler
  - Catch physics errors
  - Catch collision errors

- [ ] `src/engine/registry/index.js`
  - Already has try-catch, enhance with errorHandler

- [ ] `src/sections/chapters/game.jsx`
  - Wrap map loading
  - Wrap file reading

#### Medium Priority:
- [ ] Asset loading functions
- [ ] Save/load functions
- [ ] API calls (if any)

### Error Handler Integration:

```javascript
import errorHandler from '../services/errorHandler';

// Simple try-catch
try {
  riskyOperation();
} catch (error) {
  errorHandler.error(error, {
    context: 'ComponentName',
    action: 'operationName',
  });
}

// Or wrap entire function
const safeFunction = errorHandler.wrapAsync(
  async () => {
    // your code
  },
  { context: 'ModuleName' }
);
```

---

## Phase 7: Comments Translation 📝

### Files with Latvian Comments

#### Engine Files:
- [ ] `src/engine/registry/index.js` (partially done)
- [ ] `src/engine/physics/collision.js`
- [ ] `src/engine/loop/updateFrame.js`

#### Utility Files:
- [ ] `src/utilites/useGameEngine.js`
- [ ] Other utilities as needed

#### Section Files:
- [ ] `src/sections/chapters/game.jsx`
- [ ] Other sections as needed

### Translation Guidelines:

- Keep comments concise and clear
- Use JSDoc format for functions
- Explain "why", not "what" (code should be self-documenting)

```javascript
// ❌ BAD (obvious)
// Add 1 to x
x = x + 1;

// ✅ GOOD (explains why)
// Offset by 1 to account for zero-indexed arrays
x = x + 1;
```

---

## Phase 8: Cleanup (Final Phase) 🧹

### Remove Deprecated Code

**⚠️ Only do this after all migrations are complete!**

- [ ] Delete `src/GameRegistry.js`
- [ ] Delete `src/redux/` directory (old Redux)
- [ ] Delete `src/engine-legacy/` backup
- [ ] Remove unused imports
- [ ] Remove unused variables
- [ ] Run linter and fix warnings

### Final Verification:

```bash
# Check for old imports
grep -r "GameRegistry" src/
grep -r "from './redux" src/

# Should return no results!
```

---

## Testing Checklist ✅

After each phase, test:

### Functionality:
- [ ] Game loads without errors
- [ ] Player movement works
- [ ] Items can be collected
- [ ] Projectiles fire correctly
- [ ] Map selection works
- [ ] Settings persist
- [ ] Sound toggles work

### Console:
- [ ] No errors in console
- [ ] Only intentional warnings (like deprecation notices)
- [ ] Redux DevTools shows state updates

### Performance:
- [ ] Game runs at 60fps
- [ ] No memory leaks
- [ ] Smooth animations

---

## Progress Tracking

### Phase Completion:

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: New Patterns | ✅ Ready | 100% |
| Phase 2: Update Imports | ⏳ Pending | 0% |
| Phase 3: Add PropTypes | ⏳ Pending | 0% |
| Phase 4: Styled Components | ⏳ Pending | 0% |
| Phase 5: Redux Migration | ⏳ Pending | 0% |
| Phase 6: Error Handling | ⏳ Pending | 0% |
| Phase 7: Comment Translation | ⏳ Pending | 10% |
| Phase 8: Cleanup | ⏳ Pending | 0% |

### Overall Progress: 13.75% ✨

---

## Tips for Migration

### 1. **Do One Thing at a Time**
Don't try to convert everything at once. Pick one file, one phase.

### 2. **Test After Each Change**
Make sure the game still works after each modification.

### 3. **Use Git Branches**
Create a branch for each phase:
```bash
git checkout -b phase-2-update-imports
# ... make changes ...
git commit -m "Phase 2: Updated all imports"
git checkout main
git merge phase-2-update-imports
```

### 4. **Keep Old Code Until Verified**
Don't delete deprecated files until 100% sure they're not needed.

### 5. **Document as You Go**
Add comments explaining why you changed something.

---

## Need Help?

Refer to these files:
- `QUICK_REFERENCE.md` - Code examples
- `REFACTORING_SUMMARY.md` - Detailed change log
- `PROJECT_STRUCTURE.md` - Architecture overview

---

**Last Updated:** 2025-12-09
**Current Phase:** Phase 1 Complete ✅
