import { Link, useNavigate, useParams } from "react-router-dom";
import { useSign } from "../hooks/useSign";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {useInvite} from "../hooks/useInvite";

export default function Invitation() {
    const navigate = useNavigate();
    const { isLogin } = useSign();
    
    const [inviteList, setInviteList] = useState([]);
    const {readInvite} = useInvite();
    useEffect(() => {
        if (isLogin === false) return;
        readInvite();
        loadInviteList();
    }, [isLogin]);

    const loadInviteList = useCallback(async () => {
        const { data } = await axios.get(`/invite/`);
        setInviteList(data);
    }, []);

    return (<>
        <div className="container my-4">
            <div className="mt-4">
                <h2>초대장</h2>
            </div>

            <div className="list-group mt-4">
                {inviteList.length > 0 ? (
                    inviteList.map(invite => (
                        <div className="list-group-item" key={invite.boardInviteNo}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{invite.accountNickname}</strong>님이&nbsp;
                                    <strong>{invite.boardTitle}</strong>에 초대했습니다.
                                </div>
                                <div>
                                    <button className="btn btn-success btn-sm mx-2">수락</button>
                                    <button className="btn btn-danger btn-sm">거절</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="list-group-item text-center text-muted">
                        초대장이 없습니다.
                    </div>
                )}
            </div>
        </div>
    </>)
}