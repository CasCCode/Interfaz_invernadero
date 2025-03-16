import { createSlice } from '@reduxjs/toolkit';
import greenhouseImg from '../../assets/greenhouse.jpg'; // Ajuste en la ruta

const initialState = {
  greenhouses: [
    { id: 1, name: 'Invernadero N°1', crop: 'Pimentón', status: 'OK', image: greenhouseImg },
    { id: 2, name: 'Invernadero N°2', crop: 'Tomate', status: 'OK', image: greenhouseImg }
  ]
};

const greenhouseSlice = createSlice({
  name: 'greenhouse',
  initialState,
  reducers: {}
});

export default greenhouseSlice.reducer;