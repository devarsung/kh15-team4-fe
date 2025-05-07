import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { rectSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import React from "react";
import { useEffect, useState } from "react";
import LaneHeader from "./LaneHeader";
import "../css/Lane.css";
import Card from "./Card";

export default React.memo(function Lane(props) {
    const { id, lane } = props;

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: id,
        data: {
            type: "lane",
            laneNo: lane.laneNo
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    useEffect(() => {
    }, []);

    return (<>
        <div className="lane" ref={setNodeRef} style={style}>
            <LaneHeader setActivatorNodeRef={setActivatorNodeRef} listeners={listeners} attributes={attributes}
                laneNo={lane.laneNo}>
                <h5>[{lane.laneNo}] {lane.laneTitle}</h5>
            </LaneHeader>

            <div className="card-area">
                <SortableContext items={lane.cardList.map(card => `card${card.cardNo}`)} strategy={rectSortingStrategy}>
                    {lane.cardList.map(card => (
                        <Card key={`card${card.cardNo}`} id={`card${card.cardNo}`} card={card} laneNo={lane.laneNo} laneId={id}></Card>
                    ))}
                </SortableContext>
            </div>

        </div>
    </>)
});