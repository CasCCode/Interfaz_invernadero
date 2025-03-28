import { useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GreenhouseCard from '../components/GreenhouseCard';
import { Container, Image, Row, Col } from "react-bootstrap"; // Añadir Row y Col
import 'bootstrap/dist/css/bootstrap.min.css';
import profileImg from '../assets/profileImg.jpg';
import './HomePage.css';

function HomePage() {
  const greenhouses = useSelector(state => state.greenhouse.greenhouses);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="homepage-container">
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