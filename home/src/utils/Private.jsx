//로그인에 성공해야만 진입이 가능한 차단기
//= Spring Boot의 인터셉터의 역할
import { useRecoilValue } from "recoil";
import { loginState, authCheckedState } from "./storage";
import { Navigate } from "react-router-dom";

export default function Private({children}) {
    //recoil
    const authChecked = useRecoilValue(authCheckedState);
    const isLogin = useRecoilValue(loginState);

    //view
    if(authChecked === false) {//유저정보 로딩중이라면
        return (<h1>Loading...</h1>);//대기화면
    }

    //return 로그인상태 ? 통과 : 다른페이지로이동;
    //return login === true ? 통과 : navigate("/member/login");//이건 화면을 반환하는게 아님, 불가
    return isLogin === true ? children : <Navigate to={"/login"}/>;
}