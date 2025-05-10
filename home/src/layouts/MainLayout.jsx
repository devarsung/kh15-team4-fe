import { Outlet } from 'react-router-dom'
export default function MainLayout(){

    return(<>
        <div className="container-fluid p-0" style={{minHeight: "350px"}}>
            <Outlet/>
        </div>

        <div className="mt-5"></div>
    </>)
}