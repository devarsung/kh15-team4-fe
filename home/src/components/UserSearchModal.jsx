import Modal from 'react-modal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle, debounce } from "lodash";
import axios from 'axios';
import Avatar from './Avatar';
import { toast } from 'react-toastify';
import "../css/Modal.css";

export default function UserSearchModal(props) {
    const { isOpen, closeModal, boardNo } = props;
    const [keyword, setKeyword] = useState("");
    const [beginRow, setBeginRow] = useState(null);
    const [endRow, setEndRow] = useState(null);

    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [last, setLast] = useState(true);

    useEffect(() => {
        searchUsers(keyword);
    }, [keyword]);

    const searchUsers = useCallback(throttle(async (keyword) => {
        if (keyword.length < 3) {
            setUserList([]);
            return;
        }

        const { data } = await axios.post(`/account/search`, { keyword: keyword });
        setUserList(data);
    }, 250), []);

    const handleCloseModal = useCallback(() => {
        setKeyword("");
        setUserList([]);
        closeModal();
    }, []);

    const inviteRequest = useCallback(async (target) => {
        // const messageData = {
        //     destination: `/app/invite`,
        //     object: {
        //         boardNo: boardNo,
        //         receiverNo: target.accountNo
        //     }
        // };
        // publish(messageData);
        try {
            const {data} = await axios.post(`/invite/`, { boardNo: boardNo, receiverNo: target.accountNo });
            if(data.type === "success") {
                toast.success(data.statusMessage);
            }
            else if(data.type === "warning") {
                toast.warning(data.statusMessage);
            }
            
        }
        catch (e) {
            toast.error("오류가 발생했습니다. 잠시후 다시 시도하세요");
        }
    }, [boardNo]);

    return (<>
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal d-block"
            overlayClassName="card-modal-overlay"
            bodyOpenClassName="modal-open"
        >
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">회원 검색</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input type="text" className="form-control mb-3" placeholder="닉네임 또는 이메일 검색..." autoComplete="off"
                            value={keyword} onChange={e => setKeyword(e.target.value)} />
                        <ul className="list-group">
                            {userList.map(user => (
                                <li key={user.accountNo} className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        {/* <img src="https://picsum.photos/seed/picsum/200/300" className="rounded-circle me-3" width="40" height="40" alt="프로필" /> */}
                                        <Avatar nickname={user.accountNickname} size={40} />
                                        <div className="ms-3">
                                            <div className="fw-bold">{user.accountNickname}</div>
                                            <div className="text-muted" style={{ fontSize: "0.875rem" }}>{user.accountEmail}</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={e => inviteRequest(user)}>초대하기</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-dark" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </div>

        </Modal>
    </>)
}