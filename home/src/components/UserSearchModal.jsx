import Modal from 'react-modal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle, debounce } from "lodash";
import axios from 'axios';

export default function UserSearchModal(props) {
    const { isOpen, closeModal } = props;
    const [keyword, setKeyword] = useState("");
    const [beginRow, setBeginRow] = useState(null);
    const [endRow, setEndRow] = useState(null);
    const [open, setOpen] = useState(true);
    const [userList, setUserList] =  useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize]= useState(10);
    const [last, setLast] = useState(true);

    const loading = useRef(false);

    useEffect(()=>{
        if(!isOpen) return;
        const a = getScrollPercentage();
        console.log(a);
    },[]);

    const searchUsers = useCallback(throttle(async (keyword)=>{
        if(keyword.length < 3) {
            setUserList([]);
            return;
        }

        const {data} = await axios.get(`${keyword}`);
        setUserList(data);
    }, 250), []);

    const getScrollPercentage = useCallback(()=>{
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
        if (scrollHeight === 0) return 100; // 페이지가 스크롤될 만큼 길지 않은 경우
      
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        return Math.min(Math.max(scrollPercent, 0), 100); // 0% ~ 100% 사이로 제한
    }, []);

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
                        <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <input type="text" className="form-control mb-3" placeholder="닉네임 또는 이메일 검색..." autoComplete="off"
                            value={keyword} onChange={e=>setkeyword(e.target.value)} onFocus={e=>setOpen(true)}/>
                        {open===true && (
                            <ul className="list-group">
                                {userList.map(user=>(
                                    <li key={user.accountNo} className="list-group-item d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                            <div>
                                                <div className="fw-bold">김개발</div>
                                                <div className="text-muted" style={{fontSize: "0.875rem"}}>devkim@example.com</div>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm">초대하기</button>
                                    </li>
                                ))}
                                
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">이디자이너</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>leeux@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                <li className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <img src="https://via.placeholder.com/40" className="rounded-circle me-3" width="40" height="40" alt="프로필" />
                                        <div>
                                            <div className="fw-bold">박기획</div>
                                            <div className="text-muted" style={{fontSize: "0.875rem"}}>pmpark@example.com</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn-sm">초대하기</button>
                                </li>
                                
                            </ul>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>

        </Modal>
    </>)
}