import axios from "axios";
import { useCallback, useState, useMemo } from "react"
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../components/template/Logo";
import '../css/Login.css';
import { toast } from 'react-toastify';

export default function Join() {
    const navigate = useNavigate();

    //state
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");//email input

    const [certNumber, setCertNumber] = useState("");//인증번호 input
    const [certSending, setCertSending] = useState(false);//발송중 여부

    const [pw, setPw] = useState("");//pw input
    const [pwVisible, setPwVisible] = useState(false);
    const [pwSafe, setPwSafe] = useState(0);

    //callback

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
        if (data === true) {//존재하는 이메일이면(이미 회원)
            navigate("/login", { state: { hasAccount: true, email: email } });
        }
        else {
            sendCertMail();
        }
    }, [email]);

    //이메일로 인증번호 발송 요청
    const sendCertMail = useCallback(async (reRequest) => {
        setCertSending(true);//이메일 발송 시작
        await axios.post("/cert/", { certEmail: email });//이메일 발송 요청
        setCertSending(false);//이메일 발송 종료
        setStep(2);

        if (reRequest) {
            toast.success(<>새 인증번호를 이메일로 보냈습니다.<br />받은 편지함을 확인하세요.</>);
        }
    }, [email]);

    //인증번호 입력값 검사
    const changeCertNumber = useCallback(e => {
        //숫자만 입력 가능하도록 형식 검사
        const regex = /^[0-9]*$/;
        if (regex.test(e.target.value) === false) {
            toast.warning("숫자만 입력해주세요");
            return;
        }
        setCertNumber(e.target.value);//설정
    }, [certNumber]);

    //인증번호 검사
    const checkCertNumber = useCallback(async () => {
        if (certNumber.length <= 0) {
            toast.warning("인증번호를 입력하세요");
            return;
        }

        try {
            await axios.post("/cert/check", {
                certEmail: email,
                certNumber: certNumber
            });
            //Plan A: 인증성공
            setStep(3);
        }
        catch (e) {
            //Plan B: 인증실패
            toast.error("번호가 유효하지 않습니다")
        }
    }, [email, certNumber]);

    //비밀번호 형식, 안전도 검사
    const checkPwFormat = useCallback((value)=>{
        if(value.length < 8 || value.length > 16) {
            setPwSafe(0);
            return;
        }

        if(value.length >= 8) {
            setPwSafe(1);
            if(/[A-Z]+/.test(value) && /[a-z]+/.test(value) && /[0-9]+/.test(value)) {
                setPwSafe(2);
                if(/[!@#$]+/.test(value)) {
                    setPwSafe(3);
                }
            }
        }
    },[]);

    //비밀번호 안전도 클래스
    const pwSafeClass = useMemo(()=>{
        switch(pwSafe) {
            case 1: return "bg-danger";
            case 2: return "bg-warning";
            case 3: return "bg-primary";
            default: return "bg-light";
        }
    },[pwSafe]);

    //계정 생성 요청
    const join = useCallback(async ()=>{
        if(pwSafe < 3) {
            toast.warning("비밀번호는 대소문자,숫자,특수문자 포함 8~16자로 설정해주세요");
            return;
        }

        const account = {accountEmail: email, accountPw: pw};
        await axios.post("/account/", account);
        navigate("/");
    },[email, pw, pwSafe]);

    return (<>

        {/* 테스트용 */}
        {/* <div className="mt-3">
            <button onClick={() => setStep(1)}>1</button>
            <button onClick={() => setStep(2)}>2</button>
            <button onClick={() => setStep(3)}>3</button>
        </div> */}

        <div className="login-wrapper">
            <div className="login-box text-center">
                <Logo textColor="text-dark" />

                <div className="row mt-3">
                    {step === 1 && (
                        <div className="col-12">
                            <h5 className="mb-3">계속하려면 가입하세요</h5>

                            <div className="mb-3">
                                <input type="email" className="form-control" placeholder="이메일을 입력하세요"
                                    value={email} onChange={e=>setEmail(e.target.value)} disabled={certSending} />
                                <div className="invalid-feedback text-start">이메일 형식에 맞지 않습니다</div>
                            </div>

                            <p className="mb-3 terms-text">가입하면 cloud 이용 약관에 동의하고 개인정보 보호정책을 인정한 것으로 간주됩니다.</p>

                            <button type="submit" className="btn btn-dark w-100 mb-3"
                                onClick={checkEmailFormat} disabled={certSending}>
                                {certSending === true ? <FaSpinner className="fa-spin" /> : "가입"}
                            </button>

                            <Link to="/login" className="link-text">이미 계정이 있습니까? 로그인</Link>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="col-12">
                            <h5 className="mb-3">인증번호를 이메일로 보냈습니다</h5>

                            <p className="info-text mb-2">계정 설정을 완료하려면 다음 주소로 보내드린 인증번호를 입력하세요:</p>
                            <p className="info-text fw-bold">{email}</p>

                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="인증번호를 입력하세요"
                                    value={certNumber} onChange={changeCertNumber} />
                                <div className="invalid-feedback text-start">인증번호가 유효하지 않습니다</div>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 mb-3" onClick={checkCertNumber}>확인</button>

                            <a className="link-text" href="#" onClick={e => { e.preventDefault(); sendCertMail(true); }}>이메일을 받지 못하셨습니까? 이메일 다시 보내기</a>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="col-12">
                            <div className="mb-3 text-start">
                                <label htmlFor="" className="form-label label-text">이메일 주소</label>
                                <p className="info-text fw-bold">{email}</p>
                            </div>

                            <div className="mb-3 text-start">
                                <label htmlFor="" className="form-label label-text">비밀번호</label>
                                <div className="input-group has-validation">
                                    <input type={pwVisible === true ? "text" : "password"} className="form-control" placeholder="비밀번호 만들기"
                                        value={pw} onChange={e=>{setPw(e.target.value); checkPwFormat(e.target.value);}} />
                                    <span className="input-group-text" onClick={()=>setPwVisible(!pwVisible)}>
                                        {pwVisible === true ? <IoEyeSharp /> : <IoEyeOutline />}
                                    </span>
                                    <div className="invalid-feedback">비밀번호가 유효하지 않습니다</div>
                                </div>
                            </div>

                            <div className="pw-safe-wrapper mb-3">
                                <span className={`pw-safe-box ${pwSafe>=1 ? pwSafeClass : "bg-light"}`}></span>
                                <span className={`pw-safe-box ${pwSafe>=2 ? pwSafeClass : "bg-light"}`}></span>
                                <span className={`pw-safe-box ${pwSafe>=3 ? pwSafeClass : "bg-light"}`}></span>
                            </div>

                            <p className="mb-3 terms-text">가입하면 cloud 이용 약관에 동의하고 개인정보 보호정책을 인정한 것으로 간주됩니다.</p>

                            <button type="submit" className="btn btn-dark w-100 mb-3" onClick={join}>확인</button>
                        </div>
                    )}

                </div>

                <hr />

                <Logo textColor="text-body" />
            </div>
        </div>

    </>)
}