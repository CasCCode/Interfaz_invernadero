import { configureStore } from '@reduxjs/toolkit';
import greenhouseReducer from './slices/GreenhouseSlice';

const store = configureStore({
  reducer: {
    greenhouse: greenhouseReducer,
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;