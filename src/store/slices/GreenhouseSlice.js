import { createSlice } from '@reduxjs/toolkit';
import pimentonImg from '../../assets/pimenton.jpg'; 
import tomateImg from '../../assets/tomates.jpg'; 

const initialState = {
  greenhouses: [
    { id: 1, name: 'Invernadero N°1', crop: 'Pimentón', status: 'OK', image: pimentonImg },
    { id: 2, name: 'Invernadero N°2', crop: 'Tomate', status: 'OK', image: tomateImg }
  ]
};

const greenhouseSlice = createSlice({
  name: 'greenhouse',
  initialState,
  reducers: {
    // Aquí van a ir las acciones que vamos a utilizar para modificar el estado de los invernaderos
  }
});

export default greenhouseSlice.reducer;