import axios from "axios";
import { useCallback } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useKanban } from "../hooks/useKanban";

export default function LaneHeader(props) {
    const { setActivatorNodeRef, listeners, attributes, children, laneNo, loadData } = props;
    const {deleteLane} = useKanban();

    const handleDeleteLane = useCallback(async ()=>{
        await deleteLane(laneNo);
        await loadData();
    },[laneNo]);

    const editLaneTitle = useCallback(async()=>{

    },[]);

    return (<>
        <div className="row px-2">
            <div className="col-8 p-0" ref={setActivatorNodeRef} {...listeners} {...attributes}>
                {children}
            </div>
            <div className="col-4 p-0 text-end">
                <button className="border-0 p-0"><FaEdit/></button>
                <button className="border-0 p-0 ms-1" onClick={handleDeleteLane}><FaTrashAlt/></button>
            </div>
        </div>
    </>)
}