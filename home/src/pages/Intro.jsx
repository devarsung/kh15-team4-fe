import { FaUsers } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { BsEasel2Fill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Footer from "../components/template/Footer";

export default function Intro() {
    const navigate = useNavigate();
    const goToLogin = useCallback((e) => {
        e.preventDefault();
        navigate("/login");
    }, []);

    return (<>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column"}}>

            <div className="py-5 text-center flex-grow-1" style={{ backgroundColor: "#F8F8F9", display: "grid", placeItems: "center" }}>
                <h1 className="display-5 fw-bold text-dark">팀 협업을 더 똑똑하게</h1>
                <p className="lead text-muted mb-4">간편한 보드와 직관적인 UI로, 팀워크를 더 빠르게.</p>
                <a href="#" className="btn btn-dark btn-lg px-4" onClick={goToLogin}>무료로 시작하기</a>
            </div>

            <section className="py-5 text-center flex-grow-1" style={{ backgroundColor: "#F3F4F5",display: "grid", placeItems: "center" }}>
                <div className="row align-items-center justify-content-center">
                    <div className="col-md-4 d-flex flex-column align-items-center mb-4">
                        <FaTasks className="fs-1 mb-3" />
                        <h5 className="fw-semibold">할 일 관리</h5>
                        <p className="text-muted text-center">변경사항이 즉시 공유되어 팀 전체가 항상 최신 상태로 협업할 수 있어요.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <BsEasel2Fill className="fs-1 mb-3" />
                        <h5 className="fw-semibold">사용자 친화적 UI</h5>
                        <p className="text-muted">누구나 쉽게 사용할 수 있는 인터페이스로 빠른 적응이 가능합니다.</p>
                    </div>
                    <div className="col-md-4 mb-4">
                        <FaUsers className="fs-1 mb-3" />
                        <h5 className="fw-semibold">팀 협업</h5>
                        <p className="text-muted">멤버 초대, 권한 설정 등 협업에 최적화된 기능을 제공합니다.</p>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center flex-grow-1" style={{ backgroundColor: "#FDFDFD", display: "grid", placeItems: "center"}}>
                <h2 className="fw-bold mb-3 text-dark">지금 바로 시작해보세요</h2>
                <p className="text-muted mb-4">간단한 가입만으로 팀 보드를 바로 만들 수 있어요.</p>
                <a href="#" className="btn btn-outline-dark btn-lg" onClick={goToLogin}>가입하고 보드 만들기</a>
            </section>

        </div>
    </>)
}