import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import GreenhousePage from './pages/GreenhousePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/greenhouse/:id" element={<GreenhousePage />} />
      </Routes>
    </Router>
  );
}

export default App;