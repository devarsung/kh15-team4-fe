import React, { useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import "../css/Card.css";

export default React.memo(function Card(props) {
    const { id, card, laneNo, laneId } = props;
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
    };

    const clickclick = useCallback(() => {
        console.log("clickclick");
    }, []);

    return (<>
        <div className="card p-2" ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={clickclick}>
            <div>
                <h6>[{card.cardNo}]{card.cardTitle}</h6>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <input type="checkbox" className="form-check-input z-3"/>
                <img src="/profile.jpg" className="rounded-circle z-3" />
            </div>
        </div>
    </>)
});