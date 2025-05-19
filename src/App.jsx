import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import GreenhousePage from './pages/GreenhousePage';
import Tanques from './pages/Tanques';
import Distribucion from './pages/Distribucion';
import Mediciones from './pages/Mediciones';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AddGreenhouse from './pages/AddGreenhouse';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/greenhouse/:id" element={<GreenhousePage />} />
            <Route path="/greenhouse/:id/tanques" element={<Tanques />} />
            <Route path="/greenhouse/:id/distribucion" element={<Distribucion />} />
            <Route path="/greenhouse/:id/mediciones" element={<Mediciones />}/>
            <Route path="/add-greenhouse" element={<AddGreenhouse />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;