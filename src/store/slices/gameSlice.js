/**
 * Game Slice
 * Manages game-level state (maps, registry, game status)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeMapData: null,
  tileMapData: [],
  objectMapData: [],
  objectTextureIndices: {}, // Track texture index per object position { index: textureIndex }
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
      state.objectTextureIndices = {}; // Reset texture indices on new map
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
    updateObjectAtIndex: (state, action) => {
      const { index, newId } = action.payload;
      if (state.objectMapData[index] !== undefined) {
        state.objectMapData[index] = newId;
      }
    },
    setObjectTextureIndex: (state, action) => {
      const { index, textureIndex } = action.payload;
      state.objectTextureIndices[index] = textureIndex;
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
  updateObjectAtIndex,
  setObjectTextureIndex,
  setLoading,
  setError,
  setPaused,
  setGameOver,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
