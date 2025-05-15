import React, { useCallback, useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { BsThreeDotsVertical } from "react-icons/bs";
import "../css/Card.css";
import { useKanban } from "../hooks/useKanban";
import Avatar from "./Avatar";

export default React.memo(function Card(props) {
    const { id, card, laneNo, laneId, boardNo, palette, memberList } = props;
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: id,
        data: {
            type: "card",
            cardNo: card.cardNo,
            laneNo: laneNo,
            laneId: laneId
        }
    });

    // const colors = ["#FFEB3B", "#FFD54F", "#AED581", "#81D4FA", "#CE93D8", "#FFF59D"];
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: card.cardColor,
    };

    const [isCheck, setIsCheck] = useState(card.cardComplete === 'Y');
    const [showPalette, setShowPalette] = useState(false);
    const [hoveredColor, setHoveredColor] = useState(null);
    const [showMembers, setShowMembers] = useState(false);

    useEffect(() => {
        const dropdown = document.getElementById(`dropdown-${card.cardNo}`);
        const handleHide = () => setShowPalette(false);

        dropdown?.addEventListener("hidden.bs.dropdown", handleHide);
        return () => {
            dropdown?.removeEventListener("hidden.bs.dropdown", handleHide);
        };
    }, [card.cardNo]);

    const { deleteCard } = useKanban();
    const handleDeleteCard = useCallback(async () => {
        await deleteCard(boardNo, card.cardNo);
    }, [boardNo, card]);

    return (<>
        <div className="kanban-card" ref={setNodeRef} style={style}
            {...listeners} {...attributes}>
            <div className="card-header">
                <div className="form-check form-check-custom">
                    <input className="form-check-input rounded-circle" type="checkbox" 
                        checked={isCheck} onChange={e=>{
                            setIsCheck(e.target.checked);
                            const newValue = e.target.checked ? 'Y' : 'N';
                        }}/>
                </div>
                <div className="dropdown" data-bs-auto-close="outside">
                    <button className="btn border-0 bg-transparent text-dark btn-more dropdown-toggle p-0" type="button" 
                        data-bs-toggle="dropdown" aria-expanded="false" id={`dropdown-${card.cardNo}`}>
                        <BsThreeDotsVertical />
                    </button>
                    <ul className="card-dropdown-menu dropdown-menu dropdown-menu-end dropdown-menu-sm-start">
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => {
                                e.preventDefault(); e.stopPropagation();}}>
                                <span>수정</span>
                            </a>
                        </li>
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => { 
                                e.preventDefault(); e.stopPropagation(); setShowPalette(!showPalette); }}>
                                <span>색상</span>
                            </a>
                            {showPalette && (
                                <div className="color-palette">
                                    <div className="colors">
                                        {palette.map(color => (
                                            <div key={color.colorCode} className="color-button"
                                                style={{ backgroundColor: color.colorCode }}
                                                onMouseEnter={() => setHoveredColor(color.colorName)}
                                                onMouseLeave={() => setHoveredColor(null)}
                                                onClick={e => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    alert(`${color.colorName} 선택됨`);}}
                                            />
                                        ))}
                                    </div>
                                    <div className="color-label">
                                        {hoveredColor ? `색상명: ${hoveredColor}` : "색상을 선택하세요"}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => {
                                e.preventDefault(); e.stopPropagation(); setShowMembers(!showMembers); }}>
                                <span>멤버</span>
                            </a>
                            {showMembers && (
                                <div className="color-palette">
                                    <div className="colors">
                                        {memberList.map(member => (<>
                                            <Avatar key={member.accountNo} 
                                                nickname={member.accountNickname}
                                                size={32}
                                                onClick={e => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    alert(`${member.accountNickname} 선택됨`);}}
                                            />
                                        </>))}
                                    </div>
                                    <div className="member-label">
                                        {hoveredColor ? `색상명: ${hoveredColor}` : "색상을 선택하세요"}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <button type="button" className="dropdown-item" onClick={e => {
                                handleDeleteCard();}}>
                                <span>삭제</span>
                            </button>
                        </li>
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