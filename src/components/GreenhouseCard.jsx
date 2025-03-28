import { Card, Badge } from "react-bootstrap";
import './GreenhouseCard.css';

function GreenhouseCard({ name, crop, status, image }) {
    return (
        <Card className="greenhouse-card">
            <Card.Img 
                variant="top" 
                src={image} 
                alt={name} 
                className="card-image"
            />
            <Card.Body className="card-body-custom">
                <Card.Title className="card-title">{name}</Card.Title>
                <div className="card-badge-container">
                    <Badge className="card-badge" bg="success">{crop}</Badge>
                    <Badge className="card-badge" bg={status === 'OK' ? 'success' : 'danger'}>
                        {status}
                    </Badge>
                </div>
            </Card.Body>
        </Card>
    );
}

export default GreenhouseCard;