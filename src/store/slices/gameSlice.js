/**
 * Game Slice
 * Manages game-level state (maps, registry, game status)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeMapData: null,
  tileMapData: [],
  objectMapData: [],
  mapWidth: 20,
  mapHeight: 15,
  isLoading: false,
  error: null,
  isPaused: false,
  isGameOver: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setActiveMap: (state, action) => {
      const { mapData, tileMapData, objectMapData, mapWidth, mapHeight } = action.payload;
      state.activeMapData = mapData;
      state.tileMapData = tileMapData;
      state.objectMapData = objectMapData;
      state.mapWidth = mapWidth;
      state.mapHeight = mapHeight;
      state.isGameOver = false;
    },
    updateObjectMap: (state, action) => {
      state.objectMapData = action.payload;
    },
    removeObjectAtIndex: (state, action) => {
      const index = action.payload;
      if (state.objectMapData[index] !== undefined) {
        state.objectMapData[index] = null;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPaused: (state, action) => {
      state.isPaused = action.payload;
    },
    setGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    resetGame: (state) => {
      return { ...initialState, activeMapData: state.activeMapData };
    },
  },
});

export const {
  setActiveMap,
  updateObjectMap,
  removeObjectAtIndex,
  setLoading,
  setError,
  setPaused,
  setGameOver,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
