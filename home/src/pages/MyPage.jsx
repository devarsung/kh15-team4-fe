import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { userEmailState, userNicknameState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";
import Avatar from "../components/Avatar";
import { useSign } from "../hooks/useSign";

export default function MyPage() {
    const navigate = useNavigate();
    const isLogin = useSign();
    const userNo = useRecoilValue(userNoState);
    const userNickname = useRecoilValue(userNicknameState);
    const userEmail = useRecoilValue(userEmailState);
    const [account, setAccount] = useState({});
    const [origin, setOrigin] = useState({});

    useEffect(() => {
        if (isLogin === false) return;
        loadAccount();
    }, [isLogin]);

    const loadAccount = useCallback(async () => {
        const { data } = await axios.get(`/account/${userNo}`);
        setAccount(data);
        setOrigin(data);
    }, [userNo]);

    const a = useCallback(async (e) => {

    }, []);

    return (<>
        <div className="container my-4">
            <div className="mt-4">
                <h2>My Page</h2>
            </div>

            <div className="card mt-4 p-4 d-flex flex-row align-items-center">
                <Avatar nickname={userNickname} size={80} className="me-4" />
                <div className="ms-4">
                    <h5 className="mb-1">{userEmail}</h5>
                    <span className="text-muted fs-6">Joined at: {account.accountJoin ? account.accountJoin.split("T")[0] : ""}</span>
                </div>
            </div>

            <div className="p-3 mt-4 border rounded">
                <h4 className="mb-4">Edit Profile</h4>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Nickname</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" value={account.accountNickname} />
                            <button className="btn btn-outline-primary" type="button">Update</button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Phone Number</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" value={account.accountTel} />
                            <button className="btn btn-outline-primary" type="button">Update</button>
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

            <div className="p-3 border rounded mt-4">
                <h4 className="mb-4">Change Password</h4>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Current Password</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" />
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label text-start">New Password</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" />
                    </div>
                </div>
                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Confirm Password</label>
                    <div className="col-sm-9">
                        <input type="password" className="form-control" />
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-3 col-sm-9">
                        <button className="btn btn-outline-danger" type="button">Update Password</button>
                    </div>
                </div>
            </div>
        </div>

    </>)
}