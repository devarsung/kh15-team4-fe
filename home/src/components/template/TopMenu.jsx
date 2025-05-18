import { Link, useNavigate } from "react-router-dom";
import { FaDatabase, FaDollarSign, FaGear, FaList, FaRightFromBracket, FaRightToBracket, FaUser } from "react-icons/fa6";
import { BsEnvelopePaperFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginState, userAccessTokenState, userNicknameState, userNoState } from "../../utils/storage";
import { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSign } from "../../hooks/useSign";
import Avatar from "../Avatar";
import { connectWebSocket, subscribeWebSocket, unsubscribeWebSocket, disconnectWebSocket } from "../../utils/webSocketClient.js"
import { newInviteState } from "../../utils/intive";

export default function TopMenu() {
    const userNo = useRecoilValue(userNoState);
    const userAccessToken = useRecoilValue(userAccessTokenState);
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

    const [newInvite, setNewInvite] = useRecoilState(newInviteState);
    const subIdRef = useRef(null);
    useEffect(() => {
        if (isLogin) {
            unreadInviteCount();
            inviteSubscribe();
        } else {
            if (subIdRef.current) {
                unsubscribeWebSocket(subIdRef.current);
                subIdRef.current = null;
            }
            disconnectWebSocket();
        }

        return () => {
            if (subIdRef.current) {
                unsubscribeWebSocket(subIdRef.current);
                subIdRef.current = null;
            }
        };
    }, [isLogin, userNo, userAccessToken]);

    const inviteSubscribe = useCallback(async () => {
        try {
            await connectWebSocket(userAccessToken);
            const destination = `/private/invite/${userNo}`;
            const callback = (result) => {
                setNewInvite(result.hasInvitation);
            };

            const subId = await subscribeWebSocket(destination, callback, userAccessToken);
            subIdRef.current = subId;
        } catch (error) {
            console.error("WebSocket 연결 혹은 구독 실패:", error);
        }
    }, [userNo, userAccessToken]);

    const unreadInviteCount = useCallback(async () => {
        const { data } = await axios.get(`/invite/unreadInviteCount`);
        setNewInvite(data > 0);
    }, []);

    return (<>
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">KANBAN</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02"
                    aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                <FaRightToBracket className="me-2" />
                                <span>Login</span>
                            </Link>
                        </li> */}
                        {isLogin && (<>
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
                        </>)}
                        
                        {/* <li className="nav-item">
                            <Link className="nav-link" onClick={quickLogin}>
                                빠른로그인
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={quickLogin2}>
                                빠른로그인2
                            </Link>
                        </li> */}
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                            <div className="dropdown-menu">
                                <Link className="dropdown-item" onClick={quickLogin}>de</Link>
                                <Link className="dropdown-item" onClick={quickLogin2}>mi</Link>
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
                                    <Link to="/myPage" className="dropdown-item">{userNickname}</Link>
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