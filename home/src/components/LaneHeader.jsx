import axios from "axios";
import { useCallback, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useKanban } from "../hooks/useKanban";

export default function LaneHeader(props) {
    const { setActivatorNodeRef, listeners, attributes, children, laneNo, loadData } = props;
    const {deleteLane} = useKanban();

    useEffect(()=>{
        
    },[]);

    const handleDeleteLane = useCallback(async ()=>{
        await deleteLane(laneNo);
        await loadData();
    },[laneNo]);

    const editLaneTitle = useCallback(async()=>{

    },[]);

    return (<>
        <div className="kanban-lane-title d-flex justify-content-between align-items-center" 
            ref={setActivatorNodeRef} {...listeners} {...attributes}>
            <span>{children}</span>
            <div className="dropdown">
                <button className="btn border-0 bg-transparent text-dark btn-more dropdown-toggle p-0" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <BsThreeDotsVertical/>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-sm-start">
                    <li><a className="dropdown-item" href="#"><FaEdit/>수정</a></li>
                    <li><a className="dropdown-item" href="#" onClick={handleDeleteLane}><FaTrashAlt/>삭제</a></li>
                </ul>
            </div>
        </div>
    </>)
}