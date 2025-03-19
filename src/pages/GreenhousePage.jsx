import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function GreenhousePage() {
  const { id } = useParams();
  const greenhouse = useSelector(state => state.greenhouse.greenhouses.find(g => g.id.toString() === id));
  if (!greenhouse) return <h2>Invernadero no encontrado</h2>;
  return (
    <div className="container">
      <h2>{greenhouse.name}</h2>
      <p>Cultivo: {greenhouse.crop}</p>
      <p>Estado: {greenhouse.status}</p>
      <div className="options">
        <Link to="#">Distribución de Siembra</Link>
        <Link to={`/greenhouse/${id}/tanques`}>Niveles de los Tanques</Link>
        <Link to="#">Mediciones</Link>
      </div>
    </div>
  );
}

export default GreenhousePage;