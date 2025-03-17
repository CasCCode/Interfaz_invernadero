import { Card } from "react-bootstrap";

function GreenhouseCard({ name, crop, status, image }) {
    return (
      <Card className="text-center shadow">

        <Card.Img src={image} alt={name} className="card-img-fixed"/>
        <h3>{name}</h3>
        <strong>Cultivo: {crop}</strong> <br />
        <strong>Estado: {status}</strong>
      </Card>
    );
  }
  
  export default GreenhouseCard;