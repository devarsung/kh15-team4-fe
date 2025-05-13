import { Link, useNavigate } from "react-router-dom";
import { FaDatabase, FaDollarSign, FaGear, FaList, FaRightFromBracket, FaRightToBracket, FaUser } from "react-icons/fa6";
import { BsEnvelopePaperFill } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { loginState, userNicknameState, userNoState } from "../../utils/storage";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSign } from "../../hooks/useSign";
import Avatar from "../Avatar";
import { useWebSocketClient } from "../../hooks/useWebSocketClient";
import { useInvite } from "../../hooks/useInvite";

export default function TopMenu() {
    const userNo = useRecoilValue(userNoState);
    const { loginRequest, logoutRequest, isLogin } = useSign();
    const userNickname = useRecoilValue(userNicknameState);
    const handleLogout = useCallback(async (e) => {
        e.preventDefault();
        logoutRequest();
    }, []);

    const quickLogin = useCallback((e) => {
        e.preventDefault();
        const email = "devarsung@gmail.com";
        const pw = "helloworld";
        const stay = false;
        loginRequest(email, pw, stay);
    }, []);
    const quickLogin2 = useCallback((e) => {
        e.preventDefault();
        const email = "milkcar777@gmail.com";
        const pw = "Password1!";
        const stay = false;
        loginRequest(email, pw, stay);
    }, []);

    const { disconnect, unsubscribe } = useWebSocketClient();
    const { newInvite, inviteSubscribe, unreadInviteCount } = useInvite();
    useEffect(() => {
        if (isLogin) {
            unreadInviteCount();
            inviteSubscribe();
        } else {
            disconnect();
            unsubscribe(`/private/invite/${userNo}`);
        }

        return () => {
            unsubscribe(`/private/invite/${userNo}`);
        };
    }, [isLogin]);

    return (<>
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Navbar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02"
                    aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav">
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
                            <Link to="/myWorkSpace" className="nav-link">
                                workspace
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={quickLogin}>
                                빠른로그인
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={quickLogin2}>
                                빠른로그인2
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

                    <ul className="navbar-nav ms-auto">
                        {isLogin ? (<>
                            <li className="nav-item d-flex align-items-center">
                                <Link to="/invitation" className="nav-link d-flex justify-content-center align-items-center position-relative" style={{ height: "48px" }}>
                                    <BsEnvelopePaperFill className="fs-3" />
                                    {newInvite && (
                                        <span className="position-absolute translate-middle-x bg-danger rounded-circle" style={{ top: "5px", left: "40px", width: "10px", height: "10px" }}></span>
                                    )}

                                </Link>
                            </li>
                            <li className="nav-item dropdown ms-0">
                                <a href="#" className="nav-link d-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown" role="button">
                                    <Avatar nickname={userNickname} size={40}></Avatar>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a className="dropdown-item" href="#">{userNickname}</a>
                                    <a className="dropdown-item" href="#">Pricing</a>
                                    <a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a>
                                </div>
                            </li>
                        </>) : (<>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    <FaRightToBracket className="me-2" />
                                    <span>Login</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/join" className="nav-link">
                                    <FaUser className="me-2" />
                                    <span>Join</span>
                                </Link>
                            </li>
                        </>)}
                    </ul>
                </div>
            </div>
        </nav>

    </>)
}