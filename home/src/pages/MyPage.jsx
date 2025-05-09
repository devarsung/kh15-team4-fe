import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { loginState, userLoadingState, userNoState } from "../utils/storage";
import { useRecoilValue } from "recoil";

export default function MyPage() {
    const navigate = useNavigate();
    const [account, setAccount] = useState({});
    const [origin, setOrigin] = useState({});

    const userNo = useRecoilValue(userNoState);
    const userLoading = useRecoilValue(userLoadingState);
    const isLogin = useRecoilValue(loginState);
    useEffect(() => {
        if (userLoading === false) return;
        if (isLogin === false) return;
        loadAccount();
    }, [userLoading, isLogin]);

    const loadAccount = useCallback(async () => {
        const { data } = await axios.get(`/account/${userNo}`);
        setAccount(data);
        setOrigin(data);
    }, []);

    const asdf = useCallback(async (e) => {

    }, []);

    return (<>
        <div className="container mt-4">

            <div className="mt-4">
                <h2>MyPage</h2>
            </div>

            <div className="p-3 border rounded mt-4">
                <h4 className="mb-4">Profile Info</h4>

                <div className="row align-items-center mb-4 pb-3 border-bottom">
                    <label className="col-sm-3 col-form-label text-start">Profile Image</label>
                    <div className="col-sm-9 d-flex align-items-center">
                        {/* <img src="https://picsum.photos/seed/picsum/200/300" className="rounded-circle me-3 profile-img" alt="Profile" /> */}
                        <img src="https://picsum.photos/seed/picsum/200/300" class="rounded-circle me-3" alt="Profile" width="80" height="80"/>
                        <button className="btn btn-outline-secondary btn-sm">Change Image</button>
                    </div>
                </div>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Nickname</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" value="myNickname" />
                            <button className="btn btn-outline-primary" type="button">Update</button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Phone Number</label>
                    <div className="col-sm-9">
                        <div className="input-group">
                            <input type="text" className="form-control" value="010-1234-5678" />
                            <button className="btn btn-outline-primary" type="button">Update</button>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 pb-3 border-bottom align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Current Email</label>
                    <div className="col-sm-9">
                        <input type="email" className="form-control" value="user@example.com" readonly />
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
                </div>

                <div className="row mb-3 align-items-center">
                    <label className="col-sm-3 col-form-label text-start">Joined At</label>
                    <div className="col-sm-9">
                        <input type="text" className="form-control" value="2024-06-15" readonly />
                    </div>
                </div>

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