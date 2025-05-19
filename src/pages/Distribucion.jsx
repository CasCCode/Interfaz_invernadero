import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import BackButton from '../components/BackButton';
import './Distribucion.css';
import { Helmet } from 'react-helmet';
import CultivosMap from '../components/CultivosMap';

function DistribucionPage() {
  const { id } = useParams();

  // Buscamos primero en el store de Redux.
  const reduxGreenhouse = useSelector(state =>
    state.greenhouse.greenhouses.find(g => g.id.toString() === id)
  );

  // Si no se encuentra en Redux, usamos un estado local.
  const [localGreenhouse, setLocalGreenhouse] = useState(null);
  const greenhouse = reduxGreenhouse || localGreenhouse;

  // Estado para saber si se registró el riego osea para quitar la advertencia de plagas
  // y para reiniciar el contador de días para el riego.
  const [riegoRealizado, setRiegoRealizado] = useState(false);
  // Este estado se usará para ignorar el contador de riego y reiniciarlo a la fecha actual.
  const [lastRiegoOverride, setLastRiegoOverride] = useState(null);

  // Si no lo encontró en Redux, consultamos a Firestore.
  useEffect(() => {
    if (!reduxGreenhouse && auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid, 'invernaderos', id);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setLocalGreenhouse({ id: docSnap.id, ...docSnap.data() });
          }
        })
        .catch((error) =>
          console.error("Error al obtener el documento del invernadero:", error)
        );
    }
  }, [reduxGreenhouse, id]);

  if (!greenhouse) return <h2>Invernadero no encontrado</h2>;

  // Se utiliza la fecha de creación del invernadero para calcular cuánto han disminuido los niveles.
  const ahora = new Date();
  let lastRiegoDateForTanks;
  if (greenhouse.creationDate && typeof greenhouse.creationDate.toDate === 'function') {
    lastRiegoDateForTanks = greenhouse.creationDate.toDate();
  } else {
    lastRiegoDateForTanks = new Date(greenhouse.creationDate);
  }
  const diffMsTanks = ahora - lastRiegoDateForTanks;
  const diffDaysTanks = diffMsTanks / (1000 * 60 * 60 * 24);
  // Cálculo del nivel actual de los tanques (nunca menor a 0).
  const currentTankLevel = Math.max(
    greenhouse.cropInfo.initialTankLevel - (diffDaysTanks * greenhouse.cropInfo.tankDropRate),
    0
  );
  const emoteTanque = "🛢️";
  const mensajeTanque = `Nivel de los tanques: ${Math.floor(currentTankLevel)}%.`;

  // Este es el calculo del contador para el riego
  // Se utiliza lastRiegoOverride si existe de lo contrario, se usa la fecha original.
  const riegoReferenceDate = lastRiegoOverride
    ? lastRiegoOverride
    : lastRiegoDateForTanks;
  const diffMsRiego = ahora - riegoReferenceDate;
  const diffDaysRiego = diffMsRiego / (1000 * 60 * 60 * 24);

  // Extraer el primer número de recommendedFrequency osea si es "Cada 5-7 días" extrae 5
  const recommendedMatch = greenhouse.cropInfo.recommendedFrequency
    ? greenhouse.cropInfo.recommendedFrequency.match(/\d+/)
    : null;
  const recommendedDays = recommendedMatch ? parseInt(recommendedMatch[0], 10) : 5;

  // Cálculo de los días restantes para el próximo riego.
  const daysRemaining = Math.max(recommendedDays - diffDaysRiego, 0);
  
  // Aca si han transcurrido al menos recommendedDays desde el último registro,
  // se muestra que el riego es necesario.
  const riegoNecesario = diffDaysRiego >= recommendedDays;
  const emoteRiego = "💧";
  let mensajeRiego = "";

  if (riegoRealizado) {
    mensajeRiego = "Riego registrado.";
  } else if (!riegoNecesario) {
    // Se muestra los días restantes para el siguiente riego.
    mensajeRiego = `Faltan ${Math.ceil(daysRemaining)} día(s) para el próximo riego.`;
  } else {
    mensajeRiego = "¡Riego necesario!";
  }

  // Para plagas: si han pasado (recommendedDays + 2) días desde la fecha original (para plagas)
  // se muestra la advertencia en esta parte se usa la fecha de creación que pone el usuario.
  const excesoTiempo = diffDaysTanks >= (recommendedDays + 2);
  const emotePlagas = excesoTiempo ? "⚠️" : "🐛";
  const mensajePlagas = excesoTiempo
    ? "Advertencia: Se han detectado pulgas."
    : "No se ha detectado presencia de pulgas.";

  // Función para registrar riego este reinicia el contador de riego (lastRiegoOverride)
  // y marca el riego como registrado. 
  const handleRegistrarRiego = () => {
    setLastRiegoOverride(new Date());
    setRiegoRealizado(true);
  };

  // Arreglo de tanques para esta página se mantiene igual, pudiendo usarse currentTankLevel
  const tanks = [
    { id: 1, name: 'Agua', percentage: Math.floor(currentTankLevel), color: '#00aaff' },
    { id: 2, name: 'Zinc', percentage: Math.floor(currentTankLevel), color: '#888888' },
    { id: 3, name: 'Magnesio', percentage: Math.floor(currentTankLevel), color: '#bb33ff' },
    { id: 4, name: 'Boro', percentage: Math.floor(currentTankLevel), color: '#ffcc00' },
  ];

  return (
    <div className="distribucion-container">
      <Helmet>
        <title>Novedades | GrowSphere</title>
      </Helmet>
      <BackButton />
      <div className="encabezado">
        <div className="detalles-encabezado">
          <h2 className="titulos">Novedades del invernadero {greenhouse.name}</h2>
          <p className="subtitulo">Estado actual de la distribución y siembra</p>
        </div>
      </div>
      <div className="contenido-principal">
        <div className="seccion-imagen">
          <h3>Distribución actual de cultivos</h3>
          <div className="card-imagen">
            <CultivosMap plantingLocation={greenhouse.cropInfo.plantingLocation} />
          </div>
          <div className="leyenda-imagen">
            <span className="leyenda-item">🌱 Zona de nuevos cultivos</span>
            <span className="leyenda-item">🟫 Zona de cultivos maduros</span>
            <span className="leyenda-item">⚠️ Zonas con incidencias</span>
          </div>
        </div>
        <div className="seccion-novedades">
          <h3>Resumen del estado</h3>
          <div className="novedades-lista">
            <div className="novedad-item plaga">
              <div className="novedad-icono">{emotePlagas}</div>
              <div className="novedad-contenido">
                <p>{mensajePlagas}</p>
              </div>
            </div>
            <div className="novedad-item default">
              <div className="novedad-icono">{emoteTanque}</div>
              <div className="novedad-contenido">
                <p>{mensajeTanque}</p>
              </div>
            </div>
            <div className="novedad-item riego">
              <div className="novedad-icono">{emoteRiego}</div>
              <div className="novedad-contenido">
                <p>{mensajeRiego}</p>
                {riegoNecesario && !riegoRealizado && (
                  <button className="btn-registrar" onClick={handleRegistrarRiego}>
                    <span>Registrar Riego</span>
                  </button>
                )}
              </div>
            </div>
            {currentTankLevel < 30 && (
              <div className="novedad-item alerta-tanque">
                <div className="novedad-icono">⚠️</div>
                <div className="novedad-contenido">
                  <p>¡Atención! El nivel de los tanques es bajo ({Math.floor(currentTankLevel)}%).</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistribucionPage;