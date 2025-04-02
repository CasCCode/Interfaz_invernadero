import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import distribucionImg from '../assets/distribucion.jpg';
import BackButton from '../components/BackButton';
import './Distribucion.css'

function DistribucionPage() {
    const { id } = useParams();
    const greenhouse = useSelector(state => state.greenhouse.greenhouses.find(g => g.id.toString() === id));
    if (!greenhouse) return <h2>Invernadero no encontrado</h2>;
    return(
        <div className="distribucion-container">
            <BackButton/>
            <div className="encabezado">
               <div className="detalles-encabezado">
                    <h2 className="titulos">Novedades del inverdadero {greenhouse.name}!</h2>
               </div>
            </div>
            <img
                src={distribucionImg}
                className="distribucion-img"
            />
        </div>
    );
}

export default DistribucionPage;