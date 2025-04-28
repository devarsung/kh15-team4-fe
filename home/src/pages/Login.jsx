import axios from "axios";
import { useCallback, useEffect, useState } from 'react';
import '../css/Login.css';
import { FaPen } from "react-icons/fa";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { PiDot } from "react-icons/pi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/template/Logo';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const ddd = location.state?.email;

    //state
    const [email, setEmail] = useState("");
    const [emailPass, setEmailPass] = useState(false);
    const [pw, setPw] = useState("");
    const [pwVisible, setPwVisible] = useState(false);

    useEffect(() => {

    }, []);

    const checkEmailExist = useCallback(async () => {
        const { data } = await axios.get(`/account/accountEmail/${email}`);
        if (data === true) {//존재하는 이메일이면(회원이라면)
            setEmailPass(true);
        }
        else {//비회원이라면
            navigate("/join");
        }
    }, [email]);

    const editEmail = useCallback(()=>{
        setEmailPass(false);
        setPwVisible(false);
        setPw("");
    },[]);

    return (<>
        <div className="login-wrapper">
            <div className="login-box text-center">
                <Logo textColor="text-primary" />

                <div className="row mt-3">
                    <div className="col-12">
                        <h5 className="mb-3">계속하려면 로그인하세요</h5>

                        <div className="mb-3">
                            <div className="input-group has-validation">
                                <input type="email" className="form-control" placeholder="이메일을 입력하세요"
                                    value={email} onChange={e=>setEmail(e.target.value)} onClick={editEmail}/>
                                {emailPass === true && (
                                    <span className="input-group-text" onClick={editEmail}><FaPen /></span>
                                )}
                            </div>
                        </div>

                        {emailPass === true && (
                            <div className="mb-3">
                                <div className="input-group">
                                    <input type={pwVisible === true ? "text" : "password"} className="form-control" placeholder="비밀번호를 입력하세요" 
                                        value={pw} onChange={e=>setPw(e.target.value)}/>
                                    <span className="input-group-text" onClick={() => setPwVisible(!pwVisible)}>
                                        {pwVisible === true ? <IoEyeSharp /> : <IoEyeOutline />}
                                    </span>
                                </div>
                            </div>
                        )}

                        {emailPass === true ? (
                            <button type="submit" className="btn btn-primary w-100 mb-3">로그인</button>
                        ) : (
                            <button type="submit" className="btn btn-primary w-100 mb-3" onClick={checkEmailExist}>계속</button>
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