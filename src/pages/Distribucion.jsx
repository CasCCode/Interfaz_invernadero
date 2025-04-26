import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import distribucionImg from '../assets/distribucion.jpg';
import BackButton from '../components/BackButton';
import './Distribucion.css';
import { Helmet } from 'react-helmet';

function DistribucionPage() {
    const { id } = useParams();
    const greenhouse = useSelector(state => state.greenhouse.greenhouses.find(g => g.id.toString() === id));
    
    if (!greenhouse) return <h2>Invernadero no encontrado</h2>;

    // Datos de ejemplo para novedades - deberías obtenerlos de tu estado real
    const novedades = [
        { id: 1, tipo: 'plaga', descripcion: 'Detección de pulgones en sector 3B', fecha: '2023-07-20' },
        { id: 2, tipo: 'crecimiento', descripcion: 'Crecimiento óptimo en zona central', fecha: '2023-07-19' },
        { id: 3, tipo: 'riego', descripcion: 'Fallo en sistema de riego sector 2A', fecha: '2023-07-18' }
    ];

    return(
        <div className="distribucion-container">
            <Helmet>
                <title>Novedades | GrowSphere</title>
            </Helmet>
            <BackButton/>
            <div className="encabezado">
               <div className="detalles-encabezado">
                    <h2 className="titulos">Novedades del invernadero {greenhouse.name}</h2>
                    <p className="subtitulo">Estado actual de la distribución y siembra</p>
               </div>
            </div>

            <div className="contenido-principal">
                <div className="seccion-imagen">
                    <h3>Distribución actual de cultivos</h3>
                    <img
                        src={distribucionImg}
                        className="distribucion-img"
                        alt="Mapa de distribución del invernadero"
                    />
                    <div className="leyenda-imagen">
                        <span className="leyenda-item">🌱 Zona de nuevos cultivos</span>
                        <span className="leyenda-item">🟫 Zona de cultivos maduros</span>
                        <span className="leyenda-item">⚠️ Zonas con incidencias</span>
                    </div>
                </div>

                <div className="seccion-novedades">
                    <h3>Últimas novedades y alertas</h3>
                    <div className="novedades-lista">
                        {novedades.map(novedad => (
                            <div key={novedad.id} className={`novedad-item ${novedad.tipo}`}>
                                <div className="novedad-icono">
                                    {novedad.tipo === 'plaga' && '🐛'}
                                    {novedad.tipo === 'crecimiento' && '📈'}
                                    {novedad.tipo === 'riego' && '💧'}
                                </div>
                                <div className="novedad-contenido">
                                    <span className="novedad-fecha">{novedad.fecha}</span>
                                    <p>{novedad.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DistribucionPage;