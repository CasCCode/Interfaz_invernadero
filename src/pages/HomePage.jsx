import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import GreenhouseCard from '../components/GreenhouseCard';

function HomePage() {
  const greenhouses = useSelector(state => state.greenhouse.greenhouses);
  return (
    <div className="container">
      <h1>¡Bienvenido usuario!</h1>
      <p>Seleccione un invernadero para administrarlo.</p>
      {greenhouses.map((gh, index) => (
        <Link key={index} to={`/greenhouse/${gh.id}`}>
          <GreenhouseCard {...gh} />
        </Link>
      ))}
    </div>
  );
}

export default HomePage;