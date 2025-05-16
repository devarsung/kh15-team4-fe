import React, { useCallback, useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosColorPalette } from "react-icons/io";
import { FaEdit, FaTrashAlt, FaUser } from "react-icons/fa";
import "../css/Card.css";
import { useKanban } from "../hooks/useKanban";
import Avatar from "./Avatar";
import axios from "axios";


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
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: card.cardColor,
    };

    const [showPalette, setShowPalette] = useState(false);
    const [hoveredColor, setHoveredColor] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [hoveredMember, setHoveredMember] = useState(null);

    useEffect(() => {
        const dropdown = document.getElementById(`dropdown-${card.cardNo}`);
        const handleHide = () => {
            setShowPalette(false);
            setShowMembers(false);
        }

        dropdown?.addEventListener("hidden.bs.dropdown", handleHide);
        return () => {
            dropdown?.removeEventListener("hidden.bs.dropdown", handleHide);
        };
    }, [card.cardNo]);

    const { deleteCard } = useKanban();
    const handleDeleteCard = useCallback(async () => {
        await deleteCard(boardNo, card.cardNo);
    }, [boardNo, card]);

    const changeCardInfo = useCallback(async (column, value) => {
        await axios.patch(`/card/${boardNo}/${card.cardNo}`, { column: column, value: value });
    }, [boardNo, card]);

    return (<>
        <div className="kanban-card" ref={setNodeRef} style={style}
            {...listeners} {...attributes}>
            <div className="card-header">
                <div className="form-check form-check-custom">
                    <input className="form-check-input rounded-circle" type="checkbox"
                        checked={card.cardComplete === 'Y'} onChange={e => {
                            const newValue = e.target.checked ? 'Y' : 'N';
                            changeCardInfo("complete", newValue);
                        }} />
                </div>
                <div className="dropdown" data-bs-auto-close="outside">
                    <button className="btn border-0 bg-transparent text-dark btn-more dropdown-toggle p-0" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false" id={`dropdown-${card.cardNo}`}>
                        <BsThreeDotsVertical />
                    </button>
                    <ul className="card-dropdown-menu dropdown-menu dropdown-menu-end dropdown-menu-sm-start">
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => {
                                e.preventDefault(); e.stopPropagation();
                            }}>
                                <FaEdit className="me-2"/>
                                <span>수정</span>
                            </a>
                        </li>
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => {
                                e.preventDefault(); e.stopPropagation(); setShowPalette(!showPalette);
                            }}>
                                <IoIosColorPalette className="me-2"/>
                                <span>색상</span>
                            </a>
                            {showPalette && (
                                <div className="color-palette">
                                    <div className="colors">
                                        {palette.map(color => (
                                            <div key={color.colorCode} className={`color-button ${color.colorCode === card.cardColor ? 'selected' : ''}`}
                                                style={{ backgroundColor: color.colorCode }}
                                                onMouseEnter={() => setHoveredColor(color.colorName)}
                                                onMouseLeave={() => setHoveredColor(null)}
                                                onClick={e => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    changeCardInfo("color", color.colorCode);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="color-label">
                                        {hoveredColor ? hoveredColor : "색상을 선택하세요"}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <a type="button" className="dropdown-item" onClick={e => {
                                e.preventDefault(); e.stopPropagation(); setShowMembers(!showMembers);
                            }}>
                                <FaUser className="me-2"/>
                                <span>멤버</span>
                            </a>
                            {showMembers && (
                                <div className="color-palette">
                                    <div className="colors">
                                        {memberList.map(member => (
                                            <div key={member.accountNo} className={`member-button ${member.accountNo === card.cardPic ? 'selected' : ''}`}
                                                onMouseEnter={() => setHoveredMember(`${member.accountNickname}\n${member.accountEmail}`)}
                                                onMouseLeave={() => setHoveredMember(null)}
                                                onClick={e => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    changeCardInfo("pic", member.accountNo);
                                                }}>
                                                <Avatar nickname={member.accountNickname} size={32} />
                                            </div>
                                        ))}
                                        <div 
                                            className={`color-button member-x-button ${!card.cardPic ? 'selected' : ''}`}
                                            onClick={e => {
                                                    e.preventDefault(); e.stopPropagation();
                                                    changeCardInfo("pic", null);
                                                }}
                                        >
                                            <HiMiniXMark/>
                                        </div>
                                    </div>
                                    <div className="color-label" style={{ whiteSpace: 'pre-line' }}>
                                        {hoveredMember ? `${hoveredMember}` : ""}
                                    </div>
                                </div>
                            )}
                        </li>
                        <li>
                            <button type="button" className="dropdown-item" onClick={e => {
                                handleDeleteCard();
                            }}>
                                <FaTrashAlt className="me-2"/>
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
                {card.cardPic ? (
                    <Avatar nickname={card.accountNickname} size={32} classes={`avatar`}/>
                ) : (
                    <div style={{ width: 32, height: 32 }}></div>
                )}
            </div>
        </div>

    </>)
});