import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { FaUsers, FaSave } from "react-icons/fa";
import { BsFillPencilFill, BsFillPersonPlusFill, BsThreeDotsVertical, BsFillTrash3Fill } from "react-icons/bs"
import UserSearchModal from "./UserSearchModal";
import { useModal } from "../hooks/useModal";
import Avatar from "./Avatar";
import * as bootstrap from 'bootstrap';
import { connectWebSocket, subscribeWebSocket, unsubscribeWebSocket } from '../utils/webSocketClient.js';
import { userAccessTokenState, userNoState } from "../utils/storage.js";
import { useRecoilValue } from "recoil";

export default function BoardHeader(props) {
    const {boardNo, board} = props;
    const [userList, setUserList] = useState([]);
    const { isOpen, openModal, closeModal } = useModal();
    const userNo = useRecoilValue(userNoState);
    const userAccessToken = useRecoilValue(userAccessTokenState);

    const subIdRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            await usersSubscribe(boardNo);
        };
        init();

        return () => {
            if (subIdRef.current) {
                unsubscribeWebSocket(subIdRef.current);
                subIdRef.current = null;
            }
        };
    }, [boardNo]);

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    }, [userList]);

    //접속자 채널 구독
    const usersSubscribe = useCallback(async (boardNo) => {
        await connectWebSocket(userAccessToken);
        const destination = `/private/users/${boardNo}`;
        const callback = (result) => {
            setUserList(result);
        };
        const subId = await subscribeWebSocket(destination, callback, userAccessToken);
        subIdRef.current = subId; // 구독 ID 저장
    }, [userAccessToken]);

    const handleSearchModalOpen = useCallback(() => {
        openModal();
    }, []);

    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(board.boardTitle);
    const changeBoardTitle = useCallback(async()=>{
        if(title.length <= 0) return;
        if(title === board.boardTitle) return;
        await axios.patch(`/board/title/${boardNo}`, {boardTitle: title});
    },[boardNo, title]);

    return (<>
        <div className="container-fluid py-3 px-4 bg-white border-bottom">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center flex-wrap flex-direction-row">
                    {editMode ? (
                        <input type="text" className="form-control w-auto" autoFocus
                            value={title} 
                            onChange={e=>setTitle(e.target.value)}
                            onBlur={e=>{changeBoardTitle(); setTitle(board.boardTitle); setEditMode(false);}}
                        />
                    ) : (
                        <h3 className="mb-0 me-2 fw-semibold text-dark">{board.boardTitle}</h3>
                    )}
                    {board.accountNo === userNo && (
                        <button className="btn btn-sm btn-outline-secondary" title="제목 수정"
                            onClick={e=>setEditMode(true)}>
                            <BsFillPencilFill />
                        </button>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
                    <div className="dropdown">
                        <div className="d-flex align-items-center">
                            {userList.length > 0 && (
                                userList.map(user => (
                                    <div key={user.accountNo} data-bs-toggle="tooltip" title={user.accountNickname}>
                                        <Avatar nickname={user.accountNickname} size={36}
                                            classes={`border me-1 d-none d-sm-flex`} />
                                    </div>
                                ))
                            )}
                            <button
                                className="dropdown-toggle rounded-circle bg-light border text-dark d-flex align-items-center justify-content-center fw-bold me-1"
                                style={{ width: "36px", height: "36px" }} title="접속 중인 멤버 보기" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                +4
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: "200px" }}>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{ width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/1.webp')`, backgroundSize: "cover" }}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {board.accountNo === userNo && (
                        <button className="btn btn-outline-primary btn-sm d-flex align-items-center"
                            onClick={handleSearchModalOpen}>
                            <BsFillPersonPlusFill className="me-1" />
                            <span>초대</span>
                        </button>
                    )}
                    

                    <div className="dropdown">
                        <button className="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown">
                            <BsThreeDotsVertical />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <FaUsers className="me-2" />
                                    <span>멤버 목록 보기</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item d-flex align-items-center text-danger" href="#">
                                    <BsFillTrash3Fill className="me-2" />
                                    <span>보드 삭제</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        <UserSearchModal isOpen={isOpen} closeModal={closeModal} boardNo={boardNo} />
    </>)
}