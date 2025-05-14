import React, { useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { BsThreeDotsVertical } from "react-icons/bs";
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

    const colors = ["#FFEB3B", "#FFD54F", "#AED581", "#81D4FA", "#CE93D8", "#FFF59D"];
    const createBgColor = useCallback(()=>{
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor;
    },[]);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        // backgroundColor: createBgColor()
    };

    return (<>
        <div className="kanban-card" ref={setNodeRef} style={style} 
            {...listeners} {...attributes}>
            <div className="card-header">
                <div className="form-check form-check-custom">
                    <input className="form-check-input rounded-circle" type="checkbox"/>
                </div>
                <div className="dropdown">
                    <button className="btn border-0 bg-transparent text-dark btn-more dropdown-toggle p-0" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <BsThreeDotsVertical />
                    </button>
                    <ul className="card-dropdown-menu dropdown-menu dropdown-menu-end dropdown-menu-sm-start">
                        <li><a className="dropdown-item" href="#"><span>수정</span></a></li>
                        <li><a className="dropdown-item" href="#"><span>색상</span></a></li>
                        <li><a className="dropdown-item" href="#"><span>멤버</span></a></li>
                        <li><a className="dropdown-item" href="#"><span>삭제</span></a></li>
                    </ul>
                </div>
            </div>

            <div className="card-body">
                [{card.cardNo}]{card.cardTitle}
            </div>

            <div className="card-footer">
                <img className="avatar" src="https://i.pravatar.cc/32?img=10" alt="avatar" />
            </div>
        </div>

    </>)
});