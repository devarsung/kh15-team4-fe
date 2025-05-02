import { useCallback, useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import BoardInfo from "./BoardInfo";
import LaneWrapper from "./LaneWrapper";

export default function Board(){
    const {boardNo} = useParams();
    
    return(<>
        <BoardInfo boardNo={boardNo}/>
        
        <div className="row mt-4">
            <LaneWrapper boardNo={boardNo}/>
        </div>
    </>)
}