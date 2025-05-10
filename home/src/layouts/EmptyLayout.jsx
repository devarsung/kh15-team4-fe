import { Outlet } from 'react-router-dom';
import Footer from "../components/template/Footer";

export default function EmptyLayout(){

    return(<>
        <div className="container-fluid p-0">
            <Outlet />
        </div>

        <Footer/>
    </>)
}