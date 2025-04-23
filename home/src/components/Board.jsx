import { useCallback, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function Board(){
    const {boardNo} = useParams();

    const [title, setTitle] = useState("");
    const [cols, setCols] = useState([]);

    const loadBoardInfo = useCallback(()=>{},[]);

    const loadColAndCard = useCallback(()=>{},[]);

    const createColumn = useCallback(async ()=>{
        await axios.post(`/column/`, {columnTitle: title}).then(resp=>{
            
        });
    },[title]);

    return(<>
        <h1>{boardNo} 번 보드 어딘가</h1>

        <input type="text" value={title} onChange={e=>setTitle(e.target.value)}/>
        <button onClick={createColumn}>+column</button>


    </>)
}