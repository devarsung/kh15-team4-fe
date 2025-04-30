import { useNavigate } from 'react-router-dom';
import { HiPuzzle } from "react-icons/hi";
import '../../css/Logo.css';
import { useCallback } from 'react';

const Logo = ({textColor}) => {
  const navigate = useNavigate();

  const goToMain = useCallback(()=>{
    navigate("/");
  },[]);

  return (
    <div className={`logo ${textColor}`} tabIndex={1} onClick={goToMain}>
        <HiPuzzle className='me-1'/>
        <span className="logo-text">Logo</span>
    </div>
  );
};

export default Logo;
