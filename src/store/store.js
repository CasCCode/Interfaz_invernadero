import { configureStore } from '@reduxjs/toolkit';
import greenhouseReducer from './slices/GreenhouseSlice';

const store = configureStore({
  reducer: {
    greenhouse: greenhouseReducer,
  },
});

export default store;