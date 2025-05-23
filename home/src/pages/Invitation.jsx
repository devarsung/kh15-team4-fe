import { Link, useNavigate, useParams } from "react-router-dom";
import { useSign } from "../hooks/useSign";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { userNoState } from "../utils/storage";
import { newInviteState } from "../utils/intive";

export default function Invitation() {
    const navigate = useNavigate();
    const { isLogin } = useSign();
    const userNo = useRecoilValue(userNoState);
    const [newInvite, setNewInvite] = useRecoilState(newInviteState);
    
    const [inviteList, setInviteList] = useState([]);
    useEffect(() => {
        if (isLogin === false) return;
        readInvite();
        loadInviteList();
    }, [isLogin]);

    const readInvite = useCallback(async ()=>{
        if(newInvite === false) {return;}
        await axios.get(`/invite/readInvite`);
        setNewInvite(false);
    },[newInvite]);

    const loadInviteList = useCallback(async () => {
        const { data } = await axios.post(`/invite/list`, {receiverNo: userNo, boardInviteStatus: "PENDING"});
        setInviteList(data);
    }, []);

    const acceptInvite = useCallback(async(target)=>{
        try{
            const {data} = await axios.patch(`/invite/accept`, target);
            navigate(`/board/${data}`);
        }
        catch(e) {

        }
    },[]);

    const rejectInvite = useCallback(async(target)=>{
        console.log(target);
        await axios.patch(`/invite/reject`, target);
        loadInviteList();
    },[]);

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
                                    {invite.createdAt}
                                </div>
                                <div>
                                    <button className="btn btn-success btn-sm mx-2" onClick={e=>acceptInvite(invite)}>수락</button>
                                    <button className="btn btn-danger btn-sm" onClick={e=>rejectInvite(invite)}>거절</button>
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