import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import BackButton from '../components/BackButton';
import { Helmet } from 'react-helmet';
import distribucionImg from '../assets/distribucion.jpg';
import nivelesImg from '../assets/niveles.jpg';
import medicionesImg from '../assets/mediciones.jpg';
import './GreenhousePage.css';

function GreenhousePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [greenhouse, setGreenhouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGreenhouse() {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", auth.currentUser.uid, "invernaderos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGreenhouse({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error obteniendo el invernadero:", error);
      }
      setLoading(false);
    }
    fetchGreenhouse();
  }, [id]);

  if (loading) return <h2>Cargando...</h2>;
  if (!greenhouse) return <h2>Invernadero no encontrado</h2>;

  // --- CÁLCULO DEL ESTADO DEL INVERNADERO ---
  const ahora = new Date();
  let lastRiegoDate;
  if (greenhouse.creationDate && typeof greenhouse.creationDate.toDate === 'function') {
    lastRiegoDate = greenhouse.creationDate.toDate();
  } else {
    lastRiegoDate = new Date(greenhouse.creationDate);
  }
  const diffMs = ahora - lastRiegoDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Extraer el número de días recomendados del string "Cada X-Y días"
  const recommendedMatch = greenhouse.cropInfo.recommendedFrequency
    ? greenhouse.cropInfo.recommendedFrequency.match(/\d+/)
    : null;
  const recommendedDays = recommendedMatch ? parseInt(recommendedMatch[0], 10) : 5;

  // Definir estado basado en el riego
  let estado = "Sin definir";
  let estadoColor = "#333"; // Color neutral por defecto
  if (diffDays <= recommendedDays) {
    estado = "Estable"; // Dentro del tiempo de riego recomendado
    estadoColor = "#2d882d"; // Verde
  } else {
    estado = "⚠️ Riego atrasado: revisar novedades"; // Se ha excedido el tiempo recomendado
    estadoColor = "#dc3545"; // Rojo
  }

  return (
    <div className="greenhouse-container">
      <Helmet>
        <title>Invernadero | GrowSphere</title>
      </Helmet>
      <BackButton />
      <div className="header-card">
        <img 
          src={greenhouse.imageUrl}  // Usamos imageUrl para la imagen
          alt={greenhouse.name} 
          className="greenhouse-image"
        />
        <div className="info-container">
          <h2 className="info-title">{greenhouse.name}</h2>
          <div className="info-details">
            <p><strong>Cultivo:</strong> {greenhouse.cropInfo?.cropType}</p>
            <p>
              <strong>Estado:</strong> 
              <span style={{ color: estadoColor, marginLeft: '10px' }}>
                {estado}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="options-title">
        <h3>Seleccione qué detalles del invernadero desea conocer</h3>
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