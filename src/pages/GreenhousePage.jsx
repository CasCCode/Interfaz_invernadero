import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaCog } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GreenhousePage.css';
import distribucionImg from '../assets/distribucion.jpg';
import nivelesImg from '../assets/niveles.jpg';
import medicionesImg from '../assets/mediciones.jpg';

function GreenhousePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const greenhouse = useSelector(state => state.greenhouse.greenhouses.find(g => g.id.toString() === id));
  if (!greenhouse) return <h2>Invernadero no encontrado</h2>;

  return (
    <div className="greenhouse-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}> <FaArrowLeft size={24} /> </button>
        <button className="settings-button"> <FaCog size={24} /> </button>
      </div>
      <img src={greenhouse.image} alt={greenhouse.name} className="greenhouse-image" />
      <div className="info">
        <h2>{greenhouse.name}</h2>
        <p>Cultivo: {greenhouse.crop}</p>
        <p>Estado: {greenhouse.status}</p>
      </div>
      <div className="options">
        <Link to="#" className="option">
          <img src={distribucionImg} alt="Distribución de Siembra" className="option-image" />
          <span>Distribución de Siembra</span>
        </Link>
        <Link to={`/greenhouse/${id}/tanques`} className="option">
          <img src={nivelesImg} alt="Niveles de los Tanques" className="option-image" />
          <span>Niveles de los Tanques</span>
        </Link>
        <Link to="#" className="option">
          <img src={medicionesImg} alt="Mediciones" className="option-image" />
          <span>Mediciones</span>
        </Link>
      </div>
    </div>
  );
}

export default GreenhousePage;