import { useCallback, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

export default function MyHome(){
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const createBoard = useCallback(async()=>{
        await axios.post(`/board/`, {boardTitle: title}).then(resp=>{
            
            navigate(`/board/${resp.data}`);
        });
    },[title]);

    return(<>
        <h1>홈</h1>

        <input type="text" value={title} onChange={e=>setTitle(e.target.value)}/>
        <button onClick={createBoard}>+board</button>
    </>)
}