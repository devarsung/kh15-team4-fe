import { useCallback, useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import { loginState, userLoadingState } from "../utils/storage";
import { useRecoilValue } from "recoil";

export default function MyPage(){
    const navigate = useNavigate();

    const [boardList, setBoardList] = useState([]);
    const [title, setTitle] = useState("");

    const userLoading = useRecoilValue(userLoadingState);
    const isLogin = useRecoilValue(loginState);
    useEffect(()=>{
        if(userLoading === false) return;
        if(isLogin === false) return;

        loadBoardList();
    },[userLoading, isLogin]);

    const createBoard = useCallback(async()=>{
        await axios.post(`/board/`, {boardTitle: title}).then(resp=>{
            
            navigate(`/board/${resp.data}`);
        });
    },[title]);

    const loadBoardList = useCallback(async ()=>{
        const {data} = await axios.get(`/board/`);
        setBoardList(data);
    },[]);

    return(<>
        <h1>마이페이지</h1>

        <input type="text" value={title} onChange={e=>setTitle(e.target.value)}/>
        <button onClick={createBoard}>+board</button>

        <div className="row mt-4">
            {boardList.map(board=>(
                <div className="col-3" key={board.boardNo}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{board.boardTitle}</h5>
                            <Link to={`/board/${board.boardNo}`} className="card-link">상세페이지로</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>)
}