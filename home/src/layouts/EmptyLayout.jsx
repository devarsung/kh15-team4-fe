import { Outlet } from 'react-router-dom';
import '../css/EmptyLayout.css';

export default function EmptyLayout(){

    return(<>

        {/* 컨테이너 */}
        <div className="container">
            <Outlet/>

            <div className="background-image"></div>
        </div>
        
    </>)
}