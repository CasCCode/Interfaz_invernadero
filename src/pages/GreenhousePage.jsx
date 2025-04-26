import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GreenhousePage.css';
import distribucionImg from '../assets/distribucion.jpg';
import nivelesImg from '../assets/niveles.jpg';
import medicionesImg from '../assets/mediciones.jpg';
import BackButton from '../components/BackButton';
import { Helmet } from 'react-helmet';

function GreenhousePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const greenhouse = useSelector(state => state.greenhouse.greenhouses.find(g => g.id.toString() === id));
  if (!greenhouse) return <h2>Invernadero no encontrado</h2>;

  return (
    <div className="greenhouse-container">
      <Helmet>
        <title>Invernadero | GrowSphere</title>
      </Helmet>
      <BackButton />     
      <div className="header-card">
        <img 
          src={greenhouse.image} 
          alt={greenhouse.name} 
          className="greenhouse-image"
        />        
        <div className="info-container">
          <h2 className="info-title">{greenhouse.name}</h2>          
          <div className="info-details">
            <p><strong>Cultivo:</strong> {greenhouse.crop}</p>
            <p>
              <strong>Estado:</strong> 
              <span style={{ 
                color: greenhouse.status === 'OK' ? '#2d882d' : '#dc3545',
                marginLeft: '10px'
              }}>
                {greenhouse.status}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="options-title">
        <h3>Seleccione qué detalles del {greenhouse.name} desea conocer</h3>
      </div>
      <div className="options row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {[
          { img: distribucionImg, text: 'Novedades', to: `/greenhouse/${id}/distribucion` },
          { img: nivelesImg, text: 'Niveles de los Tanques', to: `/greenhouse/${id}/tanques` },
          { img: medicionesImg, text: 'Mediciones', to: `/greenhouse/${id}/mediciones` }
        ].map((item, index) => (
          <div key={index} className="col">
            <Link to={item.to} className="option">
              <img 
                src={item.img} 
                alt={item.text} 
                className="option-image"
              />
              <span>{item.text}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GreenhousePage;