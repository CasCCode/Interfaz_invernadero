import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Mediciones.css';
import BackButton from '../components/BackButton';

function Mediciones() {
    const { id } = useParams();
    
    const tanks = [
        { id: 1, name: 'Agua', percentage: 75, color: '#00aaff' },
        { id: 2, name: 'Zinc', percentage: 50, color: '#888888' },
        { id: 3, name: 'Magnesio', percentage: 30, color: '#bb33ff' },
        { id: 4, name: 'Boro', percentage: 90, color: '#ffcc00' },
    ];

    return (
        <div className="mediciones-container">
            <BackButton />
            <h2 className="titulo">Mediciones de Tanques - Invernadero {id}</h2>
            
            <div className="graficas-container">
                {/* Gráfico de Barras */}
                <div className="grafica-card">
                    <div className="decoracion-linea"></div>
                    <h3>Niveles Actuales</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tanks}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]}/>
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

                {/* Gráficos Circulares */}
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

            {/* Nuevo footer decorativo */}
            <div className="decoracion-footer">
                <div className="footer-content">
                    {tanks.map(tank => (
                        <div key={tank.id} className="footer-item">
                            <span className="color-marker" style={{backgroundColor: tank.color}}></span>
                            <span>{tank.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Mediciones;