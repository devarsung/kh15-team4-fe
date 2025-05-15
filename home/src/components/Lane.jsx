import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { rectSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import LaneHeader from "./LaneHeader";
import Card from "./Card";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useKanban } from "../hooks/useKanban";
import "../css/Lane.css";

export default React.memo(function Lane(props) {
    const { createCard } = useKanban();
    const { id, lane, cardMapInLane, boardNo, palette } = props;
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

    const [cardCreateMode, setCardCreateMode] = useState(false);
    const [cardTitle, setCardTitle] = useState("");

    const handleCreateCard = useCallback(async () => {
        await createCard(boardNo, lane.laneNo, cardTitle);
        setCardTitle("");
        setCardCreateMode(false);
    }, [boardNo, lane, cardTitle]);

    useEffect(() => {
    }, []);

    return (<>
        <div className="kanban-lane" ref={setNodeRef} style={style}>
            <LaneHeader setActivatorNodeRef={setActivatorNodeRef} listeners={listeners} attributes={attributes}
                laneNo={lane.laneNo} laneTitle={lane.laneTitle}>
            </LaneHeader>

            <SortableContext items={lane.cardIdList.map(cardId => cardId)} strategy={rectSortingStrategy}>
                {lane.cardIdList.map(cardId => (
                    <Card key={cardId} id={cardId} card={cardMapInLane[cardId]} 
                        laneNo={lane.laneNo} laneId={id} boardNo={boardNo} palette={palette}></Card>
                ))}
            </SortableContext>

            <div className="card-create-box">
                {cardCreateMode === false ? (
                    <button className="btn btn-secondary w-100" onClick={e=>setCardCreateMode(true)}>
                        <FaPlus className="me-2" />
                        <span>Add a card</span>
                    </button>
                ) : (
                    <div>
                        <input type="text" className="form-control mb-1" placeholder="Enter Card Title..."
                            value={cardTitle} onChange={e=>setCardTitle(e.target.value)} />
                        <button className="btn btn-primary" onClick={handleCreateCard}>Add card</button>
                        <button className="btn btn-secondary ms-1" onClick={e=>{setCardTitle(""); setCardCreateMode(false);}}>
                            <FaXmark />
                        </button>
                    </div>
                )}
            </div>


        </div>
    </>)
});