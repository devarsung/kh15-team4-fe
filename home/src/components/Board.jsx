import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pointerWithin, DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import { throttle } from "lodash";
import BoardHeader from "./BoardHeader";
import "../css/Board.css";
import Lane from "./Lane";
import axios from "axios";
import Card from "./Card";
import { useKanban } from "../hooks/useKanban";
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { connectWebSocket, subscribeWebSocket, unsubscribeWebSocket } from '../utils/webSocketClient.js';
import { userAccessTokenState } from "../utils/storage.js";
import { useRecoilValue } from "recoil";

export default function Board() {
    const { convertToMap, createLane, updateLaneOrder,
        updateCardOrder, updateCardOrderBetween, moveBetweenLanes } = useKanban();

    const navigate = useNavigate();
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } });
    const sensors = useSensors(mouseSensor, touchSensor);

    const { boardNo } = useParams();

    const [laneCreateMode, setLaneCreateMode] = useState(false);
    const [laneTitle, setLaneTitle] = useState("");

    const [laneMap, setLaneMap] = useState({});
    const [cardMap, setCardMap] = useState({});
    const [laneIdList, setLaneIdList] = useState([]);
    const [activeDragInfo, setActiveDragInfo] = useState(null);

    const [headerLoading, setHeaderLoading] = useState(false);
    const userAccessToken = useRecoilValue(userAccessTokenState);
    const subIdRef = useRef(null);

    useEffect(() => {
        //참여자인지 아닌지 확인
        canAccessBoard().then(resp => {
            if (resp === true) {
                const init = async () => {
                    await loadData();
                    await updateSubscribe(boardNo);
                    setHeaderLoading(true);
                };
                init();
            }
            else {
                navigate("/myWorkSpace");
            }
        });

        return () => {
            if(subIdRef.current) {
                unsubscribeWebSocket(`/private/update/${boardNo}`);
                subIdRef.current = null;
            }
        };
    }, [boardNo]);

    const canAccessBoard = useCallback(async () => {
        const { data } = await axios.get(`/board/member/${boardNo}`);
        return data;
    }, [boardNo]);

    //보드 업데이트 채널 구독
    const updateSubscribe = useCallback(async (boardNo) => {
        await connectWebSocket(userAccessToken);
        const destination = `/private/update/${boardNo}`;
        const callback = (result) => {
            console.log("업데이트는");
        };
        const subId = await subscribeWebSocket(destination, callback, userAccessToken);
        subIdRef.current = subId;
    }, [userAccessToken]);

    const loadData = useCallback(async () => {
        const data = await selectLaneFullList(boardNo);
        const convertData = convertToMap(data);
        setLaneMap(convertData.lanes);
        setCardMap(convertData.cards);
        setLaneIdList(convertData.laneIds);
    }, []);

    //레인,카드 데이터 비동기로 가져오기
    const selectLaneFullList = useCallback(async (boardNo) => {
        const { data } = await axios.get(`/lane/lanefull/${boardNo}`);
        return data;
    }, []);

    const getCardMapInLane = useCallback((laneId) => {
        const map = {};
        laneMap[laneId].cardIdList.forEach(cardId => {
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
        if (!over || active.id === over.id) return;

        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        if (activeType !== "card") return;//카드가 아니면 return

        const activeLaneId = active.data.current.laneId;
        const overLaneId = (activeType === overType) ? over.data.current.laneId : over.id;
        if (activeLaneId === overLaneId) return;//같은 집이면 return

        const prevActiveLane = [...laneMap[activeLaneId].cardIdList];//미리 백업
        const prevOverLane = [...laneMap[overLaneId].cardIdList];//미리 백업
        const activeCardId = active.id;//움직인 카드

        const activeIndex = active.data.current.sortable.index;
        const overIndex = (activeType === overType) ? over.data.current.sortable.index : laneMap[overLaneId].cardIdList.length;
        const result = moveBetweenLanes(laneMap[activeLaneId].cardIdList, activeIndex, laneMap[overLaneId].cardIdList, overIndex, activeCardId);
        setLaneMap(prev => ({
            ...prev,
            [activeLaneId]: { ...prev[activeLaneId], cardIdList: result.before },
            [overLaneId]: { ...prev[overLaneId], cardIdList: result.after }
        }));

        const orderDataMap = {
            starting: result.before.map((item, index) => ({ cardNo: cardMap[item].cardNo, cardOrder: index + 1 })),
            arrival: result.after.map((item, index) => ({ cardNo: cardMap[item].cardNo, cardOrder: index + 1 })),
            card: { cardNo: cardMap[activeCardId].cardNo, laneNo: laneMap[overLaneId].laneNo }
        };

        try {
            updateCardOrderBetween(orderDataMap);
        }
        catch (e) {
            setLaneMap(prev => ({
                ...prev,
                [activeLaneId]: { ...prev[activeLaneId], cardIdList: prevActiveLane },
                [overLaneId]: { ...prev[overLaneId], cardIdList: prevOverLane }
            }));
        }
    }, 350), [laneMap, cardMap]);

    const handleDragEnd = useCallback(event => {
        const { active, over } = event;
        setActiveDragInfo(null);
        if (!over || active.id === over.id) return;

        const prevLaneIdList = [...laneIdList];
        const activeType = active.data.current.type;
        const overType = over.data.current.type;
        //console.log("end시 active:", active, ", over:", over);

        //레인에서 레인으로 이동
        if (activeType === "lane" && overType === "lane") {
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current.sortable.index;
            if (activeIndex === -1 || overIndex === -1) return;

            const movedArray = arrayMove(laneIdList, activeIndex, overIndex);
            setLaneIdList(movedArray);
            const orderDataList = movedArray.map((item, index) => ({
                laneNo: laneMap[item].laneNo,
                laneOrder: index + 1
            }));

            try {
                updateLaneOrder(orderDataList);
            }
            catch (e) {
                setLaneIdList(prevLaneIdList);
            }
            return;
        }

        //카드의 이동, activeType === "card"
        //최종실행조건: 같은 레인 내 카드에서 카드로 이동
        //1. overType이 lane이면 return
        if (overType !== "card") return;

        //카드에서 카드로 이동되는 상황만 남았음
        const activeLane = active.data.current.laneId;
        const overLane = over.data.current.laneId;//undefined가 나오면 overType이 lane임
        //2. laneId가 다르면 return (다른 집으로의 이동은 이미 dragOver에서 처리완료)
        if (activeLane !== overLane) return;

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current.sortable.index;
        //console.log("같은 레인 내 카드에서카드로 이동");

        const cardIdList = laneMap[activeLane].cardIdList;
        const prevCardIdList = [...cardIdList];
        const movedArray = arrayMove(cardIdList, activeIndex, overIndex);
        setLaneMap(prev => ({
            ...prev,
            [activeLane]: { ...prev[activeLane], cardIdList: movedArray }
        }));

        const orderDataList = movedArray.map((item, index) => ({
            cardNo: cardMap[item].cardNo,
            cardOrder: index + 1
        }));

        try {
            updateCardOrder(orderDataList);
        }
        catch (e) {
            setLaneMap(prev => ({
                ...prev,
                [activeLane]: { ...prev[activeLane], cardIdList: prevCardIdList }
            }));
        }
    }, [laneIdList, laneMap, cardMap]);

    const handleCreateLane = useCallback(async () => {
        await createLane(boardNo, laneTitle);
        await loadData(boardNo);
        setLaneTitle("");
        setLaneCreateMode(false);
    }, [boardNo, laneTitle]);

    return (<>
        {headerLoading && (<BoardHeader boardNo={boardNo} />)}

        <div className="kanban-board">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel} onDragOver={handleDragOver}
                collisionDetection={pointerWithin} sensors={sensors}
            >
                <SortableContext items={laneIdList} strategy={horizontalListSortingStrategy}>
                    {laneIdList.map(laneId => (
                        <Lane key={laneId} id={laneId} lane={laneMap[laneId]} cardMapInLane={getCardMapInLane(laneId)}
                            loadData={loadData}></Lane>
                    ))}
                </SortableContext>

                <DragOverlay>
                    {activeDragInfo?.type === "card" ? (
                        <Card {...activeDragInfo} dragOverlay />
                    ) : activeDragInfo?.type === "lane" ? (
                        <Lane {...activeDragInfo} dragOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
            <div className="lane-create-box">
                {laneCreateMode === false ? (
                    <button className="btn btn-secondary w-100 text-nowrap" onClick={e => setLaneCreateMode(true)}>
                        <FaPlus className="me-2" />
                        <span>Add another lane</span>
                    </button>
                ) : (
                    <div>
                        <input type="text" className="form-control mb-1" placeholder="Enter Lane Title..."
                            value={laneTitle} onChange={e => setLaneTitle(e.target.value)} />
                        <button className="btn btn-primary" onClick={handleCreateLane}>Add lane</button>
                        <button className="btn btn-secondary ms-1" onClick={e => { setLaneTitle(""); setLaneCreateMode(false); }}>
                            <FaXmark />
                        </button>
                    </div>
                )}
            </div>
        </div>

    </>)
}