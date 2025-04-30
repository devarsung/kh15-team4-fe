import { useNavigate } from 'react-router-dom';
import { HiPuzzle } from "react-icons/hi";
import '../../css/Logo.css';

const Logo = ({textColor}) => {
  const navigate = useNavigate();
  return (
    <div className={`logo ${textColor}`} tabIndex={1} onClick={e=>navigate("/")}>
        <HiPuzzle className='me-1'/>
        <span className="logo-text">Logo</span>
    </div>
  );
};

export default Logo;
