import { useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GreenhouseCard from '../components/GreenhouseCard';

import { FaArrowLeft, FaCog } from 'react-icons/fa';
import { Container, Image, Button, Offcanvas } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import profileImg from '../assets/profileImg.jpg'; // Ajuste en la ruta

function HomePage() {
  const greenhouses = useSelector(state => state.greenhouse.greenhouses);
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="container">
      <Container className="p-3 bg-success text-white text-center rounded-bottom">
        <div className="text-center bg-success text-white p-4 rounded">
          <div className="d-flex justify-content-between">
            
            <Button variant="outline-light" className=""> {/* Botón de volver */}
              <FaArrowLeft size={24}/> {/* Icono de flecha */}
            </Button>

            <Button variant="outline-light" className=""  
              onClick={() => setShowMenu(true)}> {/* Botón de ajustes */}
              <FaCog className="fs-1"/> {/* Icono de ajustes */}
            </Button>

            {/* Menú lateral Offcanvas */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Configuración</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <p>Agregar aquí las opciones de conf</p>
                <Button variant="light" onClick={() => console.log("Opción 1 seleccionada")}>
                  Opción 1
                </Button>
              </Offcanvas.Body>
            </Offcanvas>
            
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