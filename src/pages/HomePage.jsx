import { useState } from "react";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import GreenhouseCard from '../components/GreenhouseCard';
import { Container, Image, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import profileImg from '../assets/profileImg.jpg';
import './HomePage.css';
import { Helmet } from 'react-helmet';
import { FaTimes } from 'react-icons/fa'; // Importamos el ícono

function HomePage() {
  const greenhouses = useSelector(state => state.greenhouse.greenhouses);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("¿Estás seguro que quieres cerrar sesión?");
    if (!confirmed) return;
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="homepage-container">
      <Helmet>
        <title>Inicio | GrowSphere</title>
      </Helmet>

      {/* Muestra el botón de configuración solo si no se ha activado el panel */}
      {!showMenu && (
        <button className="config-button" onClick={() => setShowMenu(true)}>
          &#9881;
        </button>
      )}

      {/* Panel de configuración deslizante */}
      <div className={`config-panel ${showMenu ? 'active' : ''}`}>
        {/* Usamos el ícono de React Icons para la "X" de cierre */}
        <FaTimes 
          className="close-panel-icon"
          onClick={() => setShowMenu(false)} 
        />
        <h3>Configuración</h3>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      
      <Container fluid className="p-0">
        <div className="welcome-section">
          <div className="header-content">
            <Image 
              src={profileImg} 
              roundedCircle 
              width={120} 
              height={120} 
              className="profile-image"
            />
            <h1 className="welcome-title">¡Bienvenido usuario!</h1>
          </div>
        </div>
        <Row className="justify-content-center mt-5">
          <Col xs={12} className="text-center">
            <p className="selection-text">Seleccione un invernadero para administrarlo</p>
          </Col>
        </Row>
        <Row className="g-4 justify-content-center mt-3">
          {greenhouses.map((gh, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-4">
              <Link to={`/greenhouse/${gh.id}`} className="text-decoration-none h-100">
                <GreenhouseCard {...gh} />
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;