import { Link, useNavigate } from "react-router-dom";
import { FaDatabase, FaDollarSign, FaGear, FaList, FaRightFromBracket, FaRightToBracket, FaUser } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { loginState } from "../../utils/storage";
import { useCallback } from "react";
import axios from "axios";
import { useSign } from "../../hooks/useSign";

export default function TopMenu() {
    const {loginRequest, logoutRequest} = useSign();
    const isLogin = useRecoilValue(loginState);

    const handleLogout = useCallback(async (e)=>{
        e.preventDefault();
        logoutRequest();
    },[]);

    const quickLogin = useCallback((e)=>{
        e.preventDefault();
        const email = "devarsung@gmail.com";
        const pw = "helloworld";
        const stay = false;
        loginRequest(email, pw, stay);
    },[]);

    return (<>
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                    <FaRightToBracket className="me-2" />
                                    <span>Login</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/myPage" className="nav-link">
                                mypage
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={quickLogin}>
                                빠른로그인
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#">About</a>
                                <a className="dropdown-item" href="#">Pricing</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#">Separated link</a>
                            </div>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {isLogin ? (
                                <Link className="nav-link" onClick={handleLogout}>
                                    <FaRightFromBracket className="me-2" />
                                    <span>Logout</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="nav-link">
                                    <FaRightToBracket className="me-2" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </li>
                        <li className="nav-item">
                            {isLogin ? (
                                <Link to="/myPage" className="nav-link">
                                    <FaUser className="me-2" />
                                    <span>myPage</span>
                                </Link>
                            ) : (
                                <Link to="/join" className="nav-link">
                                    <FaUser className="me-2" />
                                    <span>Join</span>
                                </Link>
                            )}
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    </>)
}