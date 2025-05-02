import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function BoardInfo(props) {
    const boardNo = props.boardNo;
    const [board, setBoard] = useState({});

    useEffect(()=>{
        loadBoardInfo();
    },[]);

    const loadBoardInfo = useCallback(async () => {
        const { data } = await axios.get(`/board/${boardNo}`);
        setBoard(data);
    }, []);

    return (<>
        <div className="row">
            <div className="col">
                <h1>{board.boardTitle}</h1>
            </div>
        </div>
    </>)
}