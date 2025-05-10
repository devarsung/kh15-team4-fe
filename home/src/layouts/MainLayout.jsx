import { Outlet } from 'react-router-dom'
export default function MainLayout(){

    return(<>
        {/* 컨테이너 */}
        <div className="container-fluid mb-5 p-0" style={{minHeight: "350px"}}>
            <Outlet/>
        </div>
    </>)
}