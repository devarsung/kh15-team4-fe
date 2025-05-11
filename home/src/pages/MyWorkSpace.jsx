import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import "../css/MyWorkSpace.css";
import { useSign } from "../hooks/useSign";

export default function MyWorkSpace() {
    const navigate = useNavigate();
    const {isLogin} = useSign();
    const [myBoardList, setMyBoardList] = useState([]);
    const [guestBoardList, setGuestBoardList] = useState([]);
    const [createMode, setCreateMode] = useState(false);
    const [boardTitle, setBoardTitle] = useState("");

    useEffect(() => {
        if (isLogin === false) return;
        loadData();
    }, [isLogin]);

    const loadData = useCallback(async () => {
        const { data } = await axios.get(`/board/`);
        setMyBoardList(data);
        //setGuestBoardList(data.guestBoardList);
    }, []);

    const createBoard = useCallback(async () => {
        if (boardTitle.length <= 0) {
            return;
        }
        await axios.post(`/board/`, { boardTitle: boardTitle }).then(resp => {
            navigate(`/board/${resp.data}`);
        });
    }, [boardTitle]);

    const goToBoardDetail = useCallback((target) => {
        navigate(`/board/${target.boardNo}`);
    }, []);

    return (<>
        <div className="container my-4">
            <div className="mt-4">
                <h2>WorkSpace</h2>
            </div>

            <div className="p-3 border rounded mt-4">
                <h4 className="mb-3">My BoardList</h4>
                <div className="row row-cols-2 row-cols-md-4 g-4">
                    {myBoardList.map(board => (
                        <div className="col" key={board.boardNo}>
                            <button className="btn btn-outline-secondary btn-workspace"
                                onClick={e => goToBoardDetail(board)}>
                                {board.boardTitle}
                            </button>
                        </div>
                    ))}

                    {/* 버튼 */}
                    <div className="col">
                        {createMode === true ? (
                            <div className="border rounded h-100 d-flex flex-column justify-content-between p-3 bg-light">
                                <input type="text" className="form-control" placeholder="Enter Board Title..." 
                                    value={boardTitle} onChange={e => setBoardTitle(e.target.value)}/>
                                <div className="mt-3">
                                    <button className="btn btn-sm btn-primary w-50 me-1" onClick={createBoard}>Create</button>
                                    <button className="btn btn-sm btn-outline-secondary ms-1" onClick={e => { setBoardTitle(""); setCreateMode(false); }}><FaXmark /></button>
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-secondary btn-workspace" onClick={e => setCreateMode(true)}>
                                <FaPlus className="me-2" />
                                <span>create board</span>
                            </button>
                        )}
                    </div>

                </div>
            </div>

            <div className="p-3 border rounded mt-4">
                <h4 className="mb-3">Guest BoardList</h4>
                {guestBoardList.length > 0 ? (
                    <div className="row row-cols-2 row-cols-md-4 g-4">
                        {guestBoardList.map(board => (
                            <div className="col" key={board.boardNo}>
                                <button className="btn btn-outline-success btn-workspace"
                                    onClick={e => goToBoardDetail(board)}>
                                    {board.boardTitle}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted mt-3">No guest boards available.</p>
                )}
            </div>
        </div>

    </>)
}