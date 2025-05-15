import { Outlet, useLocation } from 'react-router-dom'
import Footer from "../components/template/Footer";

export default function MainLayout() {
    const location = useLocation();
    const isBoard = /^\/board\/\d+/.test(location.pathname);
    const isHome = location.pathname === '/';

    return (<>
        <div className={`d-flex flex-column min-vh-100`}>
            {/* 메인 페이지, 보드 페이지, 나머지에 따라 분기 */}
            <div className={`container-fluid p-0 ${!isBoard ? 'flex-grow-1' : ''}`}>
                <Outlet />
            </div>

            {/* 메인 페이지에서는 푸터 고정 */}
            {isHome && (
                <Footer></Footer>
            )}

            {/* 나머지 페이지에서는 footer 없고 여백만 추가 */}
            {!isBoard && !isHome && (
                <div className="mt-5"></div>
            )}
        </div>
    </>)
}