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
import { removeAtIndex, insertAtIndex } from "../utils/array";

export default function Board() {
    const { boardNo } = useParams();

    const [title, setTitle] = useState("");

    const [laneWithCardsList, setLaneWithCardsList] = useState([]);
    const [laneMap, setLaneMap] = useState({});
    const [cardMap, setCardMap] = useState({});
    const [laneIds, setLaneIds] = useState([]);
    const [activeDragInfo, setActiveDragInfo] = useState(null);

    useEffect(() => {
        loadLaneWithCardsList();
    }, []);

    useEffect(() => {
        normalizeBoardData();
    }, [laneWithCardsList]);

    const cardsInLane = useCallback((laneId) => {
        const map = {};
        laneMap[laneId].cardIds.forEach(cardId => {
            map[cardId] = cardMap[cardId];
        });
        return map;
    }, [laneMap, cardMap]);

    const createLane = useCallback(async () => {
        await axios.post(`/lane/${boardNo}`, { laneTitle: title });
        loadLaneWithCardsList();
    }, [title]);

    // const loadLaneList = useCallback(async () => {
    //     const { data } = await axios.get(`/lane/${boardNo}`);
    //     setLaneList(data);
    // }, []);

    const loadLaneWithCardsList = useCallback(async () => {
        const { data } = await axios.get(`/lane/lanewithcards/${boardNo}`);
        setLaneWithCardsList(data);
    }, []);

    const handleDragEnd = useCallback(event => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setTimeout(() => setActiveDragInfo(null), 0);
            return;
        }

        const activeType = active.data.current.type;
        const overType = over.data.current.type;

        console.log(active, over);

        //레인 이동
        if (activeType === "lane") {
            const oldIndex = laneIds.findIndex(item => item === active.id);
            const newIndex = laneIds.findIndex(item => item === over.id);

            if (oldIndex === -1 || newIndex === -1) return;

            const prevLaneIds = [...laneIds];
            const movedArray = arrayMove(laneIds, oldIndex, newIndex);
            setLaneIds(movedArray);
            const orderDataList = movedArray.map((item, index) => ({
                laneNo: laneMap[item].laneNo,
                laneOrder: index + 1
            }));

            laneOrderUpdate(orderDataList, prevLaneIds);
            return;
        }

        //카드 이동, activeType === "card"
        const activeLane = active.data.current.laneId;
        const overLane = over.data.current.laneId || over.id;
        console.log("끝났을때 activeLane: ", activeLane, ", overLane: ", overLane);

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current.sortable.index;
        console.log("끝났을때 activeIndex: ", activeIndex, ", overIndex: ", overIndex);

        //같은 레인 내
        if (activeLane === overLane) {
            const movedArray = arrayMove(laneMap[activeLane].cardIds, activeIndex, overIndex);
            setLaneMap(prev => ({
                ...prev,
                [activeLane]: {
                    ...prev[activeLane],
                    cardIds: movedArray
                }
            }));
        }
        else {

        }

        setTimeout(() => setActiveDragInfo(null), 0);

    }, [laneIds, laneMap]);

    const laneOrderUpdate = useCallback(async (orderDataList, prevLaneIds) => {
        try {
            await axios.put(`/lane/order`, orderDataList);
        }
        catch (e) {
            setLaneIds(prevLaneIds);
        }
    }, []);

    //정규화
    const normalizeBoardData = useCallback(() => {
        const lanes = {};
        const cards = {};

        laneWithCardsList.forEach(item => {
            const laneDto = item.laneDto;
            const cardList = item.cardList;

            const { laneOrder, ...restData } = laneDto;
            lanes[`lane${laneDto.laneNo}`] = {
                ...restData,
                cardIds: cardList.map(card => `card${card.cardNo}`)
            };

            cardList.forEach(card => {
                const { cardOrder, ...restData } = card;
                cards[`card${card.cardNo}`] = {
                    ...restData
                };
            });
        });

        setLaneMap(lanes);
        setCardMap(cards);
        setLaneIds(Object.keys(lanes));
    }, [laneWithCardsList]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        const type = active.data.current.type;

        if (type === "card") {
            setActiveDragInfo({
                type: "card",
                cardNo: active.data.current.cardNo,
                cardId: active.id,
                laneId: active.data.current.laneId,
                data: cardMap[active.id],
            });
        } else if (type === "lane") {
            setActiveDragInfo({
                type: "lane",
                laneId: active.id,
                data: laneMap[active.id],
                cardsInLane: cardsInLane(active.id)
            });
        }
    }, [cardMap, laneMap]);


    const handleDragCancel = useCallback(() => {
        setActiveDragInfo(null);
    }, []);

    const handleDragOver = useCallback(throttle(event => {
        const { active, over } = event;
        if (!over) return;

        const activeType = active.data.current.type;
        if (activeType !== "card") return;

        const activeLane = active.data.current.laneId;
        const overLane = over.data.current.laneId || over.id;
        if (activeLane === overLane) return;


    }, 250), []);


    const moveBetweenLanes = useCallback((items, activeLane, activeIndex, overLane, overIndex, item) => {

    }, []);
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
                <SortableContext items={laneIds} strategy={horizontalListSortingStrategy}>
                    {laneIds.map(laneId => (
                        <Lane key={laneId} id={laneId} lane={laneMap[laneId]}
                            loadLaneWithCardsList={loadLaneWithCardsList}
                            cardsInLaneMap={cardsInLane(laneId)}></Lane>
                    ))}
                </SortableContext>

                <DragOverlay>
                    {activeDragInfo?.type === "card" ? (
                        <Card
                            id={activeDragInfo.cardId}
                            card={activeDragInfo.data}
                            laneId={activeDragInfo.laneId}
                            dragOverlay
                        />
                    ) : activeDragInfo?.type === "lane" ? (
                        <Lane
                            id={activeDragInfo.laneId}
                            lane={activeDragInfo.data}
                            cardsInLaneMap={activeDragInfo.cardsInLane}
                            dragOverlay
                        />
                    ) : null}
                </DragOverlay>

            </DndContext>

        </div>
    </>)
}