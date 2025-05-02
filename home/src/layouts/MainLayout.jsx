import { Outlet } from 'react-router-dom'
import TopMenu from '../components/template/TopMenu'

export default function MainLayout(){

    return(<>
        {/* Top Menu */}
         <TopMenu/>

         {/* 컨테이너 */}
        <div className="container mt-5 pt-5" style={{minHeight: "350px"}}>
            <Outlet/>
        </div>
        
    </>)
}