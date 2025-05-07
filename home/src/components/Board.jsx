import { useCallback, useEffect, useState, useMemo, act } from "react";
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
    const {convertToMap, createLane, loadLaneFullList, updateLaneOrder,
            updateCardOrder, updateCardOrderBetween, moveBetweenLanes} = useKanban();
    const { boardNo } = useParams();
    const [title, setTitle] = useState("");

    //const [laneFullList, setLaneFullList] = useState([]);
    const [laneMap, setLaneMap] = useState({});
    const [cardMap, setCardMap] = useState({});
    const [laneIdList, setLaneIdList] = useState([]);
    const [activeDragInfo, setActiveDragInfo] = useState(null);

    useEffect(() => {
        const loadData = async()=>{
            const data = await loadLaneFullList(boardNo);
            const convertData = convertToMap(data);
            setLaneMap(convertData.lanes);
            setCardMap(convertData.cards);
            setLaneIdList(convertData.laneIds);
        };
        loadData();
    }, []);

    const getCardMapInLane = useCallback((laneId) => {
        const map = {};
        laneMap[laneId].cardIdList.forEach(cardId=>{
            map[cardId] = cardMap[cardId];
        });
        return map;
    }, [laneMap, cardMap]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        const type = active.data.current.type;

        if (type === "card") {
            setActiveDragInfo({
                type: "card",
                id: active.id,
                card: cardMap[active.id],
                laneNo: active.data.current.laneNo,
                laneId: active.data.current.laneId,
            });
        } else if (type === "lane") {
            setActiveDragInfo({
                type: "lane",
                id: active.id,
                lane: laneMap[active.id],
                cardMapInLane: getCardMapInLane(active.id)
            });
        }
    }, [laneMap, cardMap]);

    const handleDragCancel = useCallback(() => {
        setActiveDragInfo(null);
    }, []);

    const handleDragOver = useCallback(throttle(event => {
        const { active, over } = event;
        console.log("over시 active:",active, ", over:", over);
        if (!over || active.id === over.id) return;

        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        if (activeType !== "card") return;

        const activeLaneId = active.data.current.laneId;
        const overLaneId = over.data.current.laneId || over.id;
        if (activeLaneId === overLaneId) return;

        const prevActiveLane = [...laneMap[activeLaneId].cardIdList];//미리 백업
        const prevOverLane = [...laneMap[overLaneId].cardIdList];//미리 백업
        const activeCardId = active.id;//움직인 카드

        const activeIndex = active.data.current.sortable.index;
        const overIndex = (activeType === overType) ? over.data.current.sortable.index : laneMap[overLaneId].cardIdList.length;
        const result = moveBetweenLanes(laneMap[activeLaneId].cardIdList, activeIndex, laneMap[overLaneId].cardIdList, overIndex, activeCardId);
        setLaneMap(prev=>({
            ...prev,
            [activeLaneId]: {...prev[activeLaneId], cardIdList: result.before},
            [overLaneId]: {...prev[overLaneId], cardIdList: result.after}
        }));
        
        const orderDataMap = {
            starting: result.before.map((item, index)=>({cardNo: cardMap[item].cardNo, cardOrder: index + 1})),
            arrival: result.after.map((item, index)=>({cardNo: cardMap[item].cardNo, cardOrder: index + 1})),
            card: {cardNo: cardMap[activeCardId].cardNo, laneNo: laneMap[overLaneId].laneNo}
        };
        
        try {
            updateCardOrderBetween(orderDataMap);
        }
        catch(e) {
            setLaneMap(prev=>({
                ...prev,
                [activeLaneId]: {...prev[activeLaneId], cardIdList: prevActiveLane},
                [overLaneId]: {...prev[overLaneId], cardIdList: prevOverLane}
            }));  
        }
    }, 350), [laneMap, cardMap]);

    const handleDragEnd = useCallback(event => {
        const { active, over } = event;
        console.log("end시 active:",active, ", over:", over);
        if (!over || active.id === over.id) {
            setActiveDragInfo(null);
            return;
        }

        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        const prevLaneIdList = [...laneIdList];

        //레인 이동
        if (activeType === "lane") {
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current.sortable.index;
            if (activeIndex === -1 || overIndex === -1) return;

            const movedArray = arrayMove(laneIdList, activeIndex, overIndex);
            setLaneIdList(movedArray);
            const orderDataList = movedArray.map((item, index)=>({
                laneNo: laneMap[item].laneNo,
                laneOrder: index + 1
            }));

            try {
                updateLaneOrder(orderDataList);
            }
            catch(e) {
                setLaneIdList(prevLaneIdList);
            }
            return;
        }

        //카드 이동, activeType === "card"
        const activeLane = active.data.current.laneId;
        const overLane = over.data.current.laneId;
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current.sortable.index;

        console.log(activeLane);
        console.log(overLane);

        //같은 레인 내 카드 이동
        if (activeLane === overLane) {
            const cardIdList = laneMap[activeLane].cardIdList;
            const prevCardIdList = [...cardIdList];
            const movedArray = arrayMove(cardIdList, activeIndex, overIndex);
            setLaneMap(prev => ({
                ...prev,
                [activeLane]: {...prev[activeLane], cardIdList: movedArray}
            }));
            
            const orderDataList = movedArray.map((item, index) => ({
                cardNo: cardMap[item].cardNo,
                cardOrder: index + 1
            }));

            try {
                updateCardOrder(orderDataList);
            }
            catch(e) {
                setLaneMap(prev => ({
                    ...prev,
                    [activeLane]: {...prev[activeLane], cardIdList: prevCardIdList}
                }));
            }
        }

        setActiveDragInfo(null);

    }, [laneIdList, laneMap, cardMap]);
    
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
                <SortableContext items={laneIdList} strategy={horizontalListSortingStrategy}>
                    {laneIdList.map(laneId => (
                        <Lane key={laneId} id={laneId} lane={laneMap[laneId]} cardMapInLane={getCardMapInLane(laneId)}></Lane>
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
                            cardMapInLane={activeDragInfo.cardMapInLane}
                            dragOverlay
                        />
                    ) : null}
                </DragOverlay>

            </DndContext>

        </div>
    </>)
}