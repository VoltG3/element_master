/**
 * UI Slice
 * Manages UI state (modals, menus, notifications, etc.)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMapModalOpen: true,
  isSettingsOpen: false,
  isTerminalOpen: false,
  isPauseMenuOpen: false,
  notifications: [],
  cameraScrollX: 0,
  shouldCenterMap: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMapModalOpen: (state, action) => {
      state.isMapModalOpen = action.payload;
    },
    setSettingsOpen: (state, action) => {
      state.isSettingsOpen = action.payload;
    },
    setTerminalOpen: (state, action) => {
      state.isTerminalOpen = action.payload;
      // Also set global flag for game loop
      try {
        window.__GAME_TERMINAL_OPEN__ = action.payload;
      } catch {}
    },
    setPauseMenuOpen: (state, action) => {
      state.isPauseMenuOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setCameraScrollX: (state, action) => {
      state.cameraScrollX = action.payload;
    },
    setShouldCenterMap: (state, action) => {
      state.shouldCenterMap = action.payload;
    },
    resetUI: () => initialState,
  },
});

export const {
  setMapModalOpen,
  setSettingsOpen,
  setTerminalOpen,
  setPauseMenuOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setCameraScrollX,
  setShouldCenterMap,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
