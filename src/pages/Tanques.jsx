import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import BackButton from '../components/BackButton';
import { Helmet } from 'react-helmet';
import './Tanques.css';

function Tanques() {
  const { id } = useParams(); // id del invernadero
  const [greenhouse, setGreenhouse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para registrar llenado de tanques
  const [showFillForm, setShowFillForm] = useState(false);
  const [newFillLevel, setNewFillLevel] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid, 'invernaderos', id);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setGreenhouse({ id: docSnap.id, ...docSnap.data() });
          }
        })
        .catch((error) => {
          console.error("Error al obtener el documento del invernadero:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading)
    return <p style={{ textAlign: 'center' }}>Cargando datos del invernadero...</p>;
  if (!greenhouse)
    return <p style={{ textAlign: 'center' }}>Invernadero no encontrado.</p>;

  // --- CÁLCULO DEL NIVEL DE LOS TANQUES ---
  const ahora = new Date();
  let lastDate;
  if (greenhouse.creationDate && typeof greenhouse.creationDate.toDate === "function") {
    lastDate = greenhouse.creationDate.toDate();
  } else {
    lastDate = new Date(greenhouse.creationDate);
  }
  const diffMs = ahora - lastDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Calculamos el nivel actual, asegurándonos de que nunca sea menor a 0.
  const currentTankLevel = Math.max(
    greenhouse.cropInfo.initialTankLevel - (diffDays * greenhouse.cropInfo.tankDropRate),
    0
  );
  const computedLevel = Math.floor(currentTankLevel);

  // Se asume que los 4 tanques tienen el mismo nivel.
  const tanks = [
    { id: 1, name: 'Agua', percentage: computedLevel, color: '#00aaff' },
    { id: 2, name: 'Zinc', percentage: computedLevel, color: '#888888' },
    { id: 3, name: 'Magnesio', percentage: computedLevel, color: '#bb33ff' },
    { id: 4, name: 'Boro', percentage: computedLevel, color: '#ffcc00' },
  ];

  // Función para registrar el llenado de tanques.
  const handleFillSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiamos el mensaje de error
    if (newFillLevel === "" || isNaN(newFillLevel)) return;

    // Verificamos que el nuevo nivel no supere el 100%
    if (Number(newFillLevel) > 100) {
      setErrorMsg('El nuevo nivel no puede ser mayor a 100%.');
      return;
    }
    // Verificamos que el nuevo nivel no sea inferior al nivel actual de llenado.
    if (Number(newFillLevel) < greenhouse.cropInfo.initialTankLevel) {
      setErrorMsg(`El nuevo nivel no puede ser inferior al nivel actual de llenado.`);
      return;
    }
    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, "users", uid, "invernaderos", id);
      await updateDoc(docRef, {
        "cropInfo.initialTankLevel": Number(newFillLevel),
        creationDate: serverTimestamp(),
      });
      // Actualizamos el estado local para reflejar el cambio.
      setGreenhouse({
        ...greenhouse,
        cropInfo: {
          ...greenhouse.cropInfo,
          initialTankLevel: Number(newFillLevel),
        },
        creationDate: new Date(), // En producción se reflejará el timestamp del servidor.
      });
      setShowFillForm(false);
      setNewFillLevel("");
    } catch (error) {
      console.error("Error registrando llenado de tanques:", error);
    }
  };

  return (
    <div className="tanques-container">
      <Helmet>
        <title>Tanques | GrowSphere</title>
      </Helmet>
      <BackButton />
      <h2 className="titulo">Niveles de los Tanques - Invernadero {greenhouse.name}</h2>
      <div className="tanques-grid">
        {tanks.length > 0 ? (
          tanks.map((tank) => (
            <div key={tank.id} className="tank">
              <div className="tank-title">
                <span className="tank-icon">★</span>
                {tank.name}
              </div>
              <div className="percentage-below">{tank.percentage}%</div>
              <div className="tank-body">
                <div
                  className="liquid"
                  style={{
                    height: `${tank.percentage}%`,
                    backgroundColor: tank.color,
                  }}
                >
                  <div className="wave wave1" />
                  <div className="wave wave2" />
                  <div className="wave wave3" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
            No hay datos de tanques disponibles.
          </p>
        )}
      </div>

      {/* Sección para registrar el llenado de tanques (centrado) */}
      <div className="fill-form-container">
        {showFillForm ? (
          <form onSubmit={handleFillSubmit} noValidate className="fill-form">
            <label>Nuevo nivel de llenado (0-100)%:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newFillLevel}
              onChange={(e) => setNewFillLevel(e.target.value)}
              required
            />
            <div className="btn-group">
              <button type="submit" className="btn-green">
                Registrar Llenado
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowFillForm(false);
                  setErrorMsg("");
                }}
              >
                Cancelar
              </button>
            </div>
            {errorMsg && (
              <p className="error-msg">{errorMsg}</p>
            )}
          </form>
        ) : (
          <button className="btn-green" onClick={() => setShowFillForm(true)}>
            Registrar Llenado de Tanques
          </button>
        )}
      </div>
    </div>
  );
}

export default Tanques;