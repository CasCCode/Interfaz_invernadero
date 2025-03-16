function GreenhouseCard({ name, crop, status, image }) {
    return (
      <div className="card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>Cultivo: {crop}</p>
        <p>Estado: {status}</p>
      </div>
    );
  }
  
  export default GreenhouseCard;