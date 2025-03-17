import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GreenhouseCard from '../components/GreenhouseCard';

import { FaArrowLeft, FaCog } from 'react-icons/fa';
import { Container, Card, Row, Col, Image } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import profileImg from '../assets/profileImg.jpg'; // Ajuste en la ruta

function HomePage() {
  const greenhouses = useSelector(state => state.greenhouse.greenhouses);
  return (
    <div className="container">
      <Container className="p-3 bg-success text-white text-center rounded-bottom">
        <div className="text-center bg-success text-white p-4 rounded">
          <div className="d-flex justify-content-between">
            <FaArrowLeft className="fs-1"/> {/* Icono de volver */}
            <FaCog className="fs-1"/> {/* Icono de ajustes */}
          </div>
          <Image src={profileImg} roundedCircle width={100} height={100} className="my-3" />
          <h1>¡Bienvenido usuario!</h1>
        </div>
      </Container>
      <p>Seleccione un invernadero para administrarlo.</p>
      
      {greenhouses.map((gh, index) => (
        <Link key={index} to={`/greenhouse/${gh.id}`}>
          <GreenhouseCard {...gh} /> <br />
        </Link>
      ))}
    </div>
  );
}

export default HomePage;