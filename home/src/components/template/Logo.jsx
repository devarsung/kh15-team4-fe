import { HiPuzzle } from "react-icons/hi";
import '../../css/Logo.css';

const Logo = ({textColor}) => {
  return (
    <div className={`logo ${textColor}`}>
        <HiPuzzle className='me-1'/>
        <span className="logo-text">Logo</span>
    </div>
  );
};

export default Logo;
