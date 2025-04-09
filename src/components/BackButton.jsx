import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="back-button"
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft size={20} /> Volver
    </button>
  );
};

export default BackButton;