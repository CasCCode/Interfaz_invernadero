import { useParams } from 'react-router-dom';
import './Tanques.css'; // Importa el CSS

function Tanques() {
    const { id } = useParams();

    const tanks = [
        { id: 1, name: 'Agua', percentage: 75, color: '#00aaff' },
        { id: 2, name: 'Zinc', percentage: 50, color: '#888888' },
        { id: 3, name: 'Magnesio', percentage: 30, color: '#bb33ff' },
        { id: 4, name: 'Boro', percentage: 90, color: '#ffcc00' },
    ];

    // Botón para volver atrás
    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="tanques-container">
            {/* Botón fijo para volver a la página anterior */}
            <button className="back-button" onClick={handleBack}>⬅ Volver</button>

            <h2 className="titulo">Niveles de los Tanques - Invernadero {id}</h2>

            <div className="tanques-grid">
                {tanks.map((tank) => (
                    <div key={tank.id} className="tank">
                        {/* Nombre del tanque */}
                        <div className="tank-title">
                            <span className="tank-icon">★</span>
                            {tank.name}
                        </div>

                        {/* Porcentaje con fuente pixelada */}
                        <div className="percentage-below">{tank.percentage}%</div>

                        {/* Contenedor del tanque (vaso) */}
                        <div className="tank-body">
                            {/* Nivel del líquido */}
                            <div
                                className="liquid"
                                style={{
                                    height: `${tank.percentage}%`,
                                    backgroundColor: tank.color,
                                }}
                            >
                                {/* Tres olas animadas para mayor fluidez */}
                                <div className="wave wave1" />
                                <div className="wave wave2" />
                                <div className="wave wave3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Onda verde al final de la página (SVG) */}
            <div className="bottom-wave-container">
                <svg
                    className="bottom-wave"
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="#67D38F"
                        fillOpacity="1"
                        d="
              M0,224
              L48,213.3
              C96,203,192,181,288,186.7
              C384,192,480,224,576,218.7
              C672,213,768,171,864,149.3
              C960,128,1056,128,1152,144
              C1248,160,1344,192,1392,208
              L1440,224
              L1440,320
              L1392,320
              C1344,320,1248,320,1152,320
              C1056,320,960,320,864,320
              C768,320,672,320,576,320
              C480,320,384,320,288,320
              C192,320,96,320,48,320
              L0,320
              Z
            "
                    ></path>
                </svg>
            </div>
        </div>
    );
}

export default Tanques;