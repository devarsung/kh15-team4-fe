import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { userNoState, userEmailState, userNicknameState, authCheckedState, loginState } from "../utils/storage";
import axios from "axios";

export const useSign = () => {
    const isLogin = useRecoilValue(loginState);
    const [userNo, setUserNo] = useRecoilState(userNoState);
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);
    const [userNickname, setUserNickname] = useRecoilState(userNicknameState);
    const [authChecked, setAuthChecked] = useRecoilState(authCheckedState);
    const navigate = useNavigate();

    const loginRequest = async (email, pw, stay) => {
        const { data } = await axios.post("/account/login", {
            accountEmail: email,
            accountPw: pw,
        });

        setUserNo(data.userNo);
        setUserEmail(data.userEmail);
        setUserNickname(data.userNickname);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

        if(stay) {
            window.sessionStorage.removeItem("refreshToken");
            window.localStorage.setItem("refreshToken", data.refreshToken);
        } else {
            window.localStorage.removeItem("refreshToken");
            window.sessionStorage.setItem("refreshToken", data.refreshToken);
        }
        navigate("/");
    };

    const logoutRequest = async () => {
        //서버로 로그아웃 요청
        try {
            await axios.post("/account/logout");
        }
        catch(e){}

        //recoil에 저장된 데이터 제거
        setUserNo(null);
        setUserEmail(null);
        setUserNickname(null);

        //axios에 설정된 헤더(Authorization) 제거
        delete axios.defaults.headers.common["Authorization"];

        //sessionStorage refreshToken 제거
        window.sessionStorage.removeItem("refreshToken");
        window.localStorage.removeItem("refreshToken");

        navigate("/");
    }

    const refreshLogin = async () => {
        if(isLogin === true) return;
        let stay = false;//로그인 상태 유지 체크박스
        let refreshToken = window.sessionStorage.getItem("refreshToken");

        if(refreshToken === null) {
            refreshToken = window.localStorage.getItem("refreshToken");
            if(refreshToken === null) {
                setAuthChecked(true);
                return;
            }
            else {
                stay = true;
            }
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${refreshToken}`;
            const {data} = await axios.post("/account/refresh");
            setUserNo(data.userNo);
            setUserEmail(data.userEmail);
            setUserNickname(data.userNickname);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

            if(stay) {
                window.sessionStorage.removeItem("refreshToken");
                window.localStorage.setItem("refreshToken", data.refreshToken);
            }
            else {
                window.localStorage.removeItem("refreshToken");
                window.sessionStorage.setItem("refreshToken", data.refreshToken);
            }

            setAuthChecked(true);
        }
        catch(e) {
            setAuthChecked(true);
        }
    }

    const updateNickname = (newNickname) => {
        setUserNickname(newNickname);
    }

    return { loginRequest, logoutRequest, refreshLogin, isLogin, updateNickname };
};
