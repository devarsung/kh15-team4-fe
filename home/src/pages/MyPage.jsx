import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { loginState, userLoadingState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";

export default function MyPage() {
    const navigate = useNavigate();
    const [account, setAccount] = useState({});

    const userNo = useRecoilValue(userNoState);
    const userLoading = useRecoilValue(userLoadingState);
    const isLogin = useRecoilValue(loginState);
    useEffect(() => {
        if (userLoading === false) return;
        if (isLogin === false) return;
        loadAccount();a
    }, [userLoading, isLogin]);

    const loadAccount = useCallback(async () => {
        const { data } = await axios.get(`/account/${userNo}`);
        setAccount(data);
    }, []);

    const asdf = useCallback(async (e)=>{

    },[]);

    return (<>
        <div className="container">
            <div className="mt-4">
                <h2>My Info</h2>
            </div>

            <div className="p-3 border rounded mt-4">
                <h4 className="mb-3">My BoardList</h4>
                <div className="row mt-4">
                    <div className="col-3">닉네임</div>
                    <div className="col-9">
                        <input type="text" name="accountNickname" className="form-control" value={account.accountNickname}
                           readOnly />
                    </div>
                </div>
            </div>


        </div>



    </>)
}