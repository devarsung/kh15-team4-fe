import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useEffect, useState } from "react";
import LaneHeader from "./LaneHeader";
import CardWrapper from "./CardWrapper";

export default function Lane(props) {
    const {id, lane, loadLaneList} = props;

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
        id: id,
        data: {
            type: "lane",
            no: lane.laneNo
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    useEffect(()=>{
        //console.log("Lane mounted", lane);
    },[]);

    const [cardList, setCardList] = useState({
        1: [{cardNo: 1, cardTitle: "card1", cardOrder: 1},{cardNo: 2, cardTitle: "card2", cardOrder: 2}],
        2: [{cardNo: 3, cardTitle: "card3", cardOrder: 1},{cardNo: 4, cardTitle: "card4", cardOrder: 2}],
        3: [{cardNo: 5, cardTitle: "card5", cardOrder: 1},{cardNo: 6, cardTitle: "card6", cardOrder: 2}]
    });

    return (<>
        <div className="lane" ref={setNodeRef} style={style}>
            <LaneHeader setActivatorNodeRef={setActivatorNodeRef} listeners={listeners} attributes={attributes}
                laneNo={lane.laneNo} loadLaneList={loadLaneList}>
                <h5>[{lane.laneNo}] {lane.laneTitle}</h5>
            </LaneHeader>
            
            <p>order: {lane.laneOrder}</p>

            <CardWrapper cardList={cardList[lane.laneNo]}></CardWrapper>
        </div>
    </>)
}