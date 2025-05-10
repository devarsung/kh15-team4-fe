import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { BsFillPencilFill, BsFillPersonPlusFill, BsThreeDotsVertical, BsFillTrash3Fill  } from "react-icons/bs"

export default function BoardHeader(props) {
    const boardNo = props.boardNo;
    const [board, setBoard] = useState({});

    useEffect(() => {
        loadBoardInfo();
    }, []);

    const loadBoardInfo = useCallback(async () => {
        const { data } = await axios.get(`/board/${boardNo}`);
        setBoard(data);
    }, []);

    return (<>
        <div className="container-fluid py-3 px-4 bg-white border-bottom shadow-sm rounded">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center flex-wrap">
                    <h3 className="mb-0 me-2 fw-semibold text-primary">{board.boardTitle}</h3>
                    <button className="btn btn-sm btn-outline-secondary" title="제목 수정">
                        <BsFillPencilFill/>
                    </button>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
                    <div className="dropdown">
                        <div className="d-flex align-items-center">
                            <div className="avatar rounded-circle border me-1 d-inline-block d-none d-sm-inline-block"
                                style={{width: "36px", height: "36px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/1.webp')`, backgroundSize: "cover"}}
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title="홍길동"></div>
                            <div className="avatar rounded-circle border me-1 d-inline-block d-none d-sm-inline-block"
                                style={{width: "36px", height: "36px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/2.webp')`, backgroundSize: "cover"}}
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title="김영희"></div>

                            <button
                                className="dropdown-toggle rounded-circle bg-light border text-dark d-flex align-items-center justify-content-center fw-bold me-1"
                                style={{width: "36px", height: "36px"}} title="접속 중인 멤버 보기" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                +4
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" style={{minWidth: "200px"}}>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/1.webp')`, backgroundSize: "cover"}}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/2.webp')`, backgroundSize: "cover"}}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/3.webp')`, backgroundSize: "cover"}}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/4.webp')`, backgroundSize: "cover"}}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                                <li className="dropdown-item d-flex align-items-center">
                                    <div className="rounded-circle border me-2" style={{width: "32px", height: "32px", backgroundImage: `url('https://mdbcdn.b-cdn.net/img/new/avatars/5.webp')`, backgroundSize: "cover"}}></div>
                                    <span>홍길동</span><small className="d-block text-muted">hong@example.com</small>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button className="btn btn-outline-primary btn-sm d-flex align-items-center">
                        <BsFillPersonPlusFill className="me-1"/>
                        <span>초대</span>
                    </button>

                    <div className="dropdown">
                        <button className="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown">
                            <BsThreeDotsVertical/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <FaUsers className="me-2"/>
                                    <span>멤버 목록 보기</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item d-flex align-items-center text-danger" href="#">
                                    <BsFillTrash3Fill className="me-2"/>
                                    <span>보드 삭제</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

    </>)
}