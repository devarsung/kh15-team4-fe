import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import "../css/Card.css";

export default React.memo(function Card(props) {
    const { id, card, laneNo, laneId } = props;

    if (!card) {
        return null;
    }

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: id,
        data: {
            type: "card",
            cardNo: card.cardNo,
            laneNo: laneNo,
            laneId: laneId
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (<>
        <div className="card" ref={setNodeRef} style={style}>
            <button className="btn btn-info btn-sm mt-2"
                ref={setActivatorNodeRef} {...listeners} {...attributes}>
                핸들</button>
            <h5 className="my-2">[{card.cardNo}]{card.cardTitle}</h5>
        </div>
    </>)
});