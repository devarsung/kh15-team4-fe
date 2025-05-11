import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { userEmailState, userNicknameState, userNoState } from "../utils/storage";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from 'react-toastify';
import Avatar from "../components/Avatar";
import { useSign } from "../hooks/useSign";

export default function MyPage() {
    const navigate = useNavigate();
    const {isLogin, updateNickname} = useSign();
    const userNo = useRecoilValue(userNoState);

    const [account, setAccount] = useState({});
    const [origin, setOrigin] = useState({});

    useEffect(() => {
        if (isLogin === false) return;
        loadAccount();
    }, [isLogin]);

    const loadAccount = useCallback(async () => {
        const { data } = await axios.get(`/account/${userNo}`);
        setAccount(data); setOrigin(data);
    }, [userNo]);

    const changeAccount = useCallback(e => {
        const { name, value } = e.target;
        setAccount(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const sendNicknameChageRequest = useCallback(async () => {
        if (account.accountNickname === origin.accountNickname) return;
        const regex = /^[A-Za-zㄱ-ㅎㅏ-ㅣ가-힣0-9]{3,10}$/;
        if (regex.test(account.accountNickname) === false) {
            toast.error("대소문자, 한글, 숫자 3~10글자");
            return;
        }

        try {
            await axios.patch(`/account/${userNo}`, { accountNickname: account.accountNickname });
            toast.success("변경되었습니다");
            loadAccount();
            updateNickname(account.accountNickname);
        }
        catch(e) {
            toast.error("잠시 후 다시 시도해주세요");
        }
    }, [account, origin]);

    const sendTelChangeRequest = useCallback(async (e) => {
        if (account.accountTel === origin.accountTel) return;
        const regex = /^[0-9]{8,12}$/;
        if (regex.test(account.accountTel) === false) {
            toast.error("올바른 전화번호를 입력하세요");
            return;
        }

        try {
            await axios.patch(`/account/${userNo}`, { accountTel: account.accountTel });
            toast.success("변경되었습니다");
            loadAccount();
        }
        catch(e) {
            toast.error("잠시 후 다시 시도해주세요");
        }
    }, [account, origin]);

    return (<>
        <div className="container my-4">
            <div className="mt-4">
                <h2>My Page</h2>
            </div>
            <div className="card mt-4 p-4 d-flex flex-row align-items-center">
                {origin.accountNickname && (<Avatar nickname={origin.accountNickname} size={80} className="me-4" />)}
                <div className="ms-4">
                    <h5 className="mb-1">{origin.accountEmail}</h5>
                    <span className="text-muted fs-6">Joined at: {origin.accountJoin ? origin.accountJoin.split("T")[0] : ""}</span>
                </div>
            </div>

            <div className="p-3 mt-4 border rounded">
                <h4 className="mb-4">Edit Profile</h4>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Nickname</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" name="accountNickname" 
                                value={account?.accountNickname} onChange={changeAccount} maxLength={10}/>
                            <button className="btn btn-outline-primary" type="button" onClick={sendNicknameChageRequest}>Update</button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Phone Number</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" name="accountTel"
                                value={account?.accountTel} onChange={changeAccount} maxLength={12}/>
                            <button className="btn btn-outline-primary" type="button" onClick={sendTelChangeRequest}>Update</button>
                        </div>
                    </div>
                </div>

                {/* <div className="row mb-3 pb-3 border-bottom align-items-center">
                            <label className="col-sm-3 col-form-label text-start">Current Email</label>
                            <div className="col-sm-9">
                                <input type="email" className="form-control" defaultValue ="user@example.com" readOnly />
                            </div>
                        </div>
                        <div className="row mb-3 pb-3 border-bottom align-items-center">
                            <label className="col-sm-3 col-form-label text-start">New Email</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <input type="email" className="form-control" placeholder="Enter new email" />
                                    <button className="btn btn-outline-warning" type="button">Send Code</button>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3 pb-3 border-bottom align-items-center">
                            <label className="col-sm-3 col-form-label text-start">Verification Code</label>
                            <div className="col-sm-9">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Enter code" />
                                    <button className="btn btn-outline-success" type="button">Verify</button>
                                </div>
                            </div>
                        </div> */}
            </div>

            {/* <div className="p-3 border rounded mt-4">
                    <h4 className="mb-4">Change Password</h4>

                    <div className="row mb-3 pb-3 border-bottom align-items-center">
                        <label className="col-sm-3 col-form-label text-start">Current Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" defaultValue={"a"} readOnly/>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label text-start">New Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" defaultValue={"a"} readOnly/>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <label className="col-sm-3 col-form-label text-start">Confirm Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control" defaultValue={"a"} readOnly/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-sm-3 col-sm-9">
                            <button className="btn btn-outline-danger" type="button">Update Password</button>
                        </div>
                    </div>
                </div> */}

        </div>

    </>)
}