import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useEffect } from "react";
import LaneHeader from "./LaneHeader";

export default function Lane(props) {
    const {lane, loadLaneList} = props;

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
        id: lane.laneNo
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    useEffect(()=>{
        //console.log("Lane mounted", lane);
    },[]);

    return (<>
        <div className="lane" ref={setNodeRef} style={style}>
            <LaneHeader setActivatorNodeRef={setActivatorNodeRef} listeners={listeners} attributes={attributes}
                laneNo={lane.laneNo} loadLaneList={loadLaneList}>
                <h5>[{lane.laneNo}] {lane.laneTitle}</h5>
            </LaneHeader>
            
            <p>order: {lane.laneOrder}</p>
        </div>
    </>)
}