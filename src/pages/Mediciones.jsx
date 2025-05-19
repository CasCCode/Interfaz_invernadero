import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Mediciones.css';
import BackButton from '../components/BackButton';
import { Helmet } from 'react-helmet';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Mediciones() {
  const { id } = useParams();
  const [greenhouse, setGreenhouse] = useState(null);
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
        });
    }
  }, [id]);
  if (!greenhouse)
    return <p style={{ textAlign: 'center' }}>Cargando datos del invernadero...</p>;
  const ahora = new Date();
  let lastDate;
  if (greenhouse.creationDate && typeof greenhouse.creationDate.toDate === 'function') {
    lastDate = greenhouse.creationDate.toDate();
  } else {
    lastDate = new Date(greenhouse.creationDate);
  }
  const diffMs = ahora - lastDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const currentTankLevel = Math.max(
    greenhouse.cropInfo.initialTankLevel - (diffDays * greenhouse.cropInfo.tankDropRate),
    0
  );
  const computedLevel = Math.floor(currentTankLevel);
  const tanks = [
    { id: 1, name: 'Agua', percentage: computedLevel, color: '#00aaff' },
    { id: 2, name: 'Zinc', percentage: computedLevel, color: '#888888' },
    { id: 3, name: 'Magnesio', percentage: computedLevel, color: '#bb33ff' },
    { id: 4, name: 'Boro', percentage: computedLevel, color: '#ffcc00' },
  ];
  return (
    <div className="mediciones-container">
      <Helmet>
        <title>Mediciones | GrowSphere</title>
      </Helmet>
      <BackButton />
      <h2 className="titulo">Mediciones de Tanques - Invernadero {greenhouse.name}</h2>
      <div className="graficas-container">
        <div className="grafica-card">
          <div className="decoracion-linea"></div>
          <h3>Niveles Actuales</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tanks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage">
                  {tanks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="circular-grid">
          {tanks.map((tank) => (
            <div key={tank.id} className="circular-card">
              <div className="decoracion-puntos"></div>
              <h4>{tank.name}</h4>
              <div className="circular-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[{ value: tank.percentage }, { value: 100 - tank.percentage }]}
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      innerRadius="60%"
                      outerRadius="80%"
                    >
                      <Cell fill={tank.color} />
                      <Cell fill="#eee" />
                    </Pie>
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={tank.color}
                      style={{ fontSize: '24px', fontWeight: 'bold' }}
                    >
                      {tank.percentage}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="decoracion-footer">
        <div className="footer-content">
          {tanks.map((tank) => (
            <div key={tank.id} className="footer-item">
              <span className="color-marker" style={{ backgroundColor: tank.color }}></span>
              <span>{tank.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mediciones;