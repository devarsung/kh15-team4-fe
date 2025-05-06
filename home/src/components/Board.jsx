import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { closestCorners, pointerWithin, DndContext, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import { throttle } from "lodash";
import BoardInfo from "./BoardInfo";
import "../css/Board.css";
import Lane from "./Lane";
import axios from "axios";
import Card from "./Card";
import { useKanban } from "../hooks/useKanban";
import { removeAtIndex, insertAtIndex } from "../utils/array";

export default function Board() {
    const {createLane, loadLaneFullList, updateLaneOrder, moveBetweenLanes} = useKanban();
    const { boardNo } = useParams();
    const [title, setTitle] = useState("");

    const [laneFullList, setLaneFullList] = useState([]);
    const [activeDragInfo, setActiveDragInfo] = useState(null);

    useEffect(() => {
        const loadData = async()=>{
            const data = await loadLaneFullList(boardNo);
            setLaneFullList(data);
        };
        loadData();
    }, []);

    const handleDragEnd = useCallback(event => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setTimeout(() => setActiveDragInfo(null), 0);
            return;
        }

        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        const prevLaneFullList = [...laneFullList];

        //레인 이동
        if (activeType === "lane") {
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current.sortable.index;

            if (activeIndex === -1 || overIndex === -1) return;

            const movedArray = arrayMove(laneFullList, activeIndex, overIndex);
            setLaneFullList(movedArray);
            const orderDataList = movedArray.map((item, index) => ({
                laneNo: item.laneNo,
                laneOrder: index + 1
            }));

            try {
                updateLaneOrder(orderDataList);
            }
            catch(e) {
                setLaneFullList(prevLaneFullList);
            }
            
            return;
        }

        //카드 이동, activeType === "card"
        const activeLane = active.data.current.laneNo;
        const overLane = over.data.current.laneNo;
        console.log("끝났을때 activeLane: ", activeLane, ", overLane: ", overLane);

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current.sortable.index;
        console.log("끝났을때 activeIndex: ", activeIndex, ", overIndex: ", overIndex);

        //같은 레인 내
        if (activeLane === overLane) {
            const cardList = laneFullList.find(item=>item.laneNo === activeLane).cardList;
            const movedArray = arrayMove(cardList, activeIndex, overIndex);
            setLaneFullList(
                laneFullList.map(lane=>{
                    if(lane.laneNo === activeLane) {
                        return {
                            ...lane,
                            cardList: movedArray
                        }
                    }
                    return lane;
                })
            );
            const orderDataList = movedArray.map((item, index) => ({
                cardNo: item.laneNo,
                cardOrder: index + 1
            }));

            try {

            }
            catch(e) {
                setLaneFullList(prevLaneFullList);
            }
        }
        else {//다른 레인 간
            
        }

        setTimeout(() => setActiveDragInfo(null), 0);

    }, [laneFullList]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        const type = active.data.current.type;
        //console.log(active);

        if (type === "card") {
            const laneNo = active.data.current.laneNo;
            const cardNo = active.data.current.cardNo;
            const card = laneFullList.find(lane=>lane.laneNo === laneNo).cardList.find(card=>card.cardNo === cardNo);
            setActiveDragInfo({
                type: "card",
                id: active.id,
                card: card,
                laneNo: laneNo,
                laneId: active.data.current.laneId,
            });
        } else if (type === "lane") {
            const laneNo = active.data.current.laneNo;
            const lane = laneFullList.find(lane=>lane.laneNo === laneNo);
            setActiveDragInfo({
                type: "lane",
                id: active.id,
                lane: lane
            });
        }

    }, [laneFullList]);

    const handleDragCancel = useCallback(() => {
        setActiveDragInfo(null);
    }, []);

    const handleDragOver = useCallback(throttle(event => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        if (activeType !== "card") return;

        const activeLaneNo = active.data.current.laneNo;
        const overLaneNo = over.data.current.laneNo;
        if (activeLaneNo === overLaneNo) return;
        console.log(activeLaneNo, overLaneNo);

        const prevLaneFullList = [...laneFullList];
        const activeCardNo = active.data.current.cardNo;

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current.sortable.index;

        //다른 레인의 카드들 사이에 끼어들어감
        if(activeType === overType) {
            
            setLaneFullList(prev=>{
                const activeCardList = prev.find(lane=>lane.laneNo === activeLaneNo).cardList;
                const overCardList = prev.find(lane=>lane.laneNo === overLaneNo).cardList;
                const targetCard = activeCardList.find(card=>card.cardNo === activeCardNo);
                const result = moveBetweenLanes(activeCardList, activeIndex, overCardList, overIndex, targetCard);
                return prev.map(lane=>{
                    if(lane.laneNo === activeLaneNo) {
                        return {
                            ...lane,
                            cardList: result.before
                        }
                    }
                    else if(lane.laneNo === overLaneNo) {
                        return {
                            ...lane,
                            cardList: result.after
                        }
                    }
                    return lane;
                });
            });
            try {

            }
            catch(e) {
                console.log("에러");
                setLaneFullList(prevLaneFullList);
            }
        }
        else {//다른 빈 레인에 들어감

            setLaneFullList(prev=>{
                const activeCardList = prev.find(lane=>lane.laneNo === activeLaneNo).cardList;
                const overCardList = prev.find(lane=>lane.laneNo === overLaneNo).cardList;
                const targetCard = activeCardList.find(card=>card.cardNo === activeCardNo);
                const result = moveBetweenLanes(activeCardList, activeIndex, overCardList, 0, targetCard);
                return prev.map(lane=>{
                    if(lane.laneNo === activeLaneNo) {
                        return {
                            ...lane,
                            cardList: result.before
                        }
                    }
                    else if(lane.laneNo === overLaneNo) {
                        return {
                            ...lane,
                            cardList: result.after
                        }
                    }
                    return lane;
                });
            });

            try {

            }
            catch(e) {
                console.log("에러");
                setLaneFullList(prevLaneFullList);
            }
        }

    }, 350), [laneFullList]);

    
    return (<>
        <BoardInfo boardNo={boardNo} />

        <div className="row">
            <div className="col">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <button onClick={createLane}>+lane</button>
            </div>
        </div>

        <div className="mt-4 lane-area">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                onDragOver={handleDragOver}
                collisionDetection={pointerWithin}>
                <SortableContext items={laneFullList.map(lane =>`lane${lane.laneNo}`)} strategy={horizontalListSortingStrategy}>
                    {laneFullList.map(lane => (
                        <Lane key={`lane${lane.laneNo}`} id={`lane${lane.laneNo}`} lane={lane}></Lane>
                    ))}
                </SortableContext>

                <DragOverlay>
                    {activeDragInfo?.type === "card" ? (
                        <Card
                            id={activeDragInfo.id}
                            card={activeDragInfo.card}
                            laneNo={activeDragInfo.laneNo}
                            laneId={activeDragInfo.laneId}
                            dragOverlay
                        />
                    ) : activeDragInfo?.type === "lane" ? (
                        <Lane
                            id={activeDragInfo.id}
                            lane={activeDragInfo.lane}
                            dragOverlay
                        />
                    ) : null}
                </DragOverlay>

            </DndContext>

        </div>
    </>)
}