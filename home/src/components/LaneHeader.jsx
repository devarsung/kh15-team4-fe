import axios from "axios";
import { useCallback } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function LaneHeader(props) {
    const { setActivatorNodeRef, listeners, attributes, children, laneNo, loadLaneList } = props;

    const editLaneTitle = useCallback(async()=>{

    },[]);

    const deleteLane = useCallback(async()=>{
        try {
            await axios.delete(`/lane/${laneNo}`);
            loadLaneList();
        }
        catch(e){}
        
    },[laneNo]);

    return (<>
        <div className="row px-2">
            <div className="col-8 p-0" ref={setActivatorNodeRef} {...listeners} {...attributes}>
                {children}
            </div>
            <div className="col-4 p-0 text-end">
                <button className="border-0 p-0"><FaEdit/></button>
                <button className="border-0 p-0 ms-2" onClick={deleteLane}><FaTrashAlt/></button>
            </div>
        </div>
    </>)
}