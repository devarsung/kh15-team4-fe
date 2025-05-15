import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useKanban } from "../hooks/useKanban";

export default function LaneHeader(props) {
    const { setActivatorNodeRef, listeners, attributes, laneNo, laneTitle } = props;
    const {deleteLane} = useKanban();
    const [editMode, setEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(laneTitle);
    
    useEffect(()=>{
        
    },[]);

    const handleDeleteLane = useCallback(async ()=>{
        await deleteLane(laneNo);
    },[laneNo]);

    const handleEditLaneTitle = useCallback(async()=>{

    },[]);

    return (<>
        <div className="kanban-lane-title d-flex justify-content-between align-items-center" 
            ref={setActivatorNodeRef} {...listeners} {...attributes}>
            {editMode === false ? (
                <span><h5>{laneTitle}</h5></span>
            ) : (
                <input type="text" className="form-control" 
                    value={newTitle} onChange={e=>setNewTitle(e.target.value)} 
                    onBlur={e=>{setEditMode(false);setNewTitle(laneTitle);}}
                />
            )}
            <div className="dropdown">
                <button className="btn border-0 bg-transparent text-dark btn-more dropdown-toggle p-0" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <BsThreeDotsVertical/>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-sm-start">
                    <li><a className="dropdown-item" href="#" onClick={e=>setEditMode(true)}><FaEdit/><span className="ms-2">수정</span></a></li>
                    <li><a className="dropdown-item" href="#" onClick={handleDeleteLane}><FaTrashAlt/><span className="ms-2">삭제</span></a></li>
                </ul>
            </div>
        </div>
    </>)
}