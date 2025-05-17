import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import '../css/Login.css';
import { FaPen } from "react-icons/fa";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { PiDot } from "react-icons/pi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/template/Logo';
import { toast } from "react-toastify";
import { useSign } from "../hooks/useSign";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const {loginRequest} = useSign();

    //state
    const [hasAccount, setHasAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [emailPass, setEmailPass] = useState(false);
    const [pw, setPw] = useState("");
    const [pwVisible, setPwVisible] = useState(false);

    const [stay, setStay] = useState(false);//로그인 유지

    useEffect(() => {
        setHasAccount(location.state?.hasAccount || false);
        setEmail(location.state?.email || "");
    }, []);

    //이메일 형식 검사
    const checkEmailFormat = useCallback(() => {
        if (email.length <= 0) {
            toast.warning("이메일 주소를 입력하세요");
            return;
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(email) === false) {
            toast.error("이메일 형식이 올바르지 않습니다");
            return;
        }

        checkEmailExist();
    }, [email]);

    //존재하는 이메일인지 확인
    const checkEmailExist = useCallback(async () => {
        const { data } = await axios.get(`/account/accountEmail/${email}`);
        if (data === true) {//존재하는 이메일이면(회원이라면)
            setEmailPass(true);
        }
        else {//비회원이라면
            navigate("/join");
        }
    }, [email]);

    //이메일 재입력하기
    const editEmail = useCallback(() => {
        setEmailPass(false);
        setPwVisible(false);
        setPw("");
    }, []);

    //로그인 핸들러
    const handleLogin = useCallback(async () => {
        if (pw.length <= 0) {
            toast.warning("비밀번호를 입력하세요");
            return;
        }

        //로그인 요청
        loginRequest(email, pw, stay);
    }, [email, pw, stay]);

    return (<>
        <div className="login-wrapper">
            <div className="login-box text-center">
                <Logo textColor="text-dark" />

                <div className="row mt-3">
                    <div className="col-12">
                        <h5 className="mb-3">계속하려면 로그인하세요</h5>

                        {hasAccount === true && (
                            <p className="info-text mb-3">이 이메일에 연결된 계정을 이미 보유하고 계신 것 같습니다. 로그인하거나, 비밀번호를 잊은 경우 재설정하세요.</p>
                        )}

                        <div className="mb-3">
                            <div className="input-group has-validation">
                                <input type="email" className="form-control" placeholder="이메일을 입력하세요"
                                    value={email} onChange={e => setEmail(e.target.value)} onClick={editEmail} />
                                {emailPass === true && (
                                    <span className="input-group-text" role="button" tabIndex={0}
                                        onClick={editEmail}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                editEmail();
                                            }
                                        }}>
                                        <FaPen />
                                    </span>
                                )}
                            </div>
                        </div>

                        {emailPass === true && (
                            <div className="mb-3">
                                <div className="input-group">
                                    <input type={pwVisible === true ? "text" : "password"} className="form-control" placeholder="비밀번호를 입력하세요"
                                        value={pw} onChange={e => setPw(e.target.value)} />
                                    <span className="input-group-text" role="button" tabIndex={0}
                                        onClick={() => setPwVisible(!pwVisible)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                setPwVisible(!pwVisible);
                                            }
                                        }}>
                                        {pwVisible === true ? <IoEyeSharp /> : <IoEyeOutline />}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 로그인 유지 체크박스 */}
                        <div className="mb-3 text-start">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="flexCheckDefault"
                                    checked={stay} onChange={e => setStay(e.target.checked)} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    로그인 유지
                                </label>
                            </div>
                        </div>

                        {emailPass === true ? (
                            <button type="submit" className="btn btn-dark w-100 mb-3" onClick={handleLogin}>로그인</button>
                        ) : (
                            <button type="submit" className="btn btn-dark w-100 mb-3" onClick={checkEmailFormat}>계속</button>
                        )}

                        <a className="link-text" href="#">로그인 할 수 없습니까?</a>
                        <PiDot />
                        <Link to="/join" className="link-text">계정 만들기</Link>
                    </div>
                </div>

                <hr />

                <Logo textColor="text-body" />
            </div>
        </div>
    </>)
}