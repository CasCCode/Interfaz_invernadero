import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import GreenhousePage from './pages/GreenhousePage';
import Tanques from './pages/Tanques';
import Distribucion from './pages/Distribucion';
import Mediciones from './pages/Mediciones';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/greenhouse/:id" element={<GreenhousePage />} />
        <Route path="/greenhouse/:id/tanques" element={<Tanques />} />
        <Route path="/greenhouse/:id/distribucion" element={<Distribucion />} />
        <Route path="/greenhouse/:id/mediciones" element={<Mediciones />}/>
      </Routes>
    </Router>
  );
}

export default App;