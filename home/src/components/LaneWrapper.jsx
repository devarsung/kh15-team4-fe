import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import Lane from "./Lane";
import axios from "axios";
import "../css/Lane.css";

export default function LaneWrapper(props) {
    const boardNo = props.boardNo;
    const [laneList, setLaneList] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        loadLaneList();
    }, []);
    
    const sortableItems = useMemo(() => {
        return laneList.map(lane => lane.laneNo);
    }, [laneList]);

    const createLane = useCallback(async () => {
        await axios.post(`/lane/${boardNo}`, { laneTitle: title });
        loadLaneList();
    }, [title]);

    const loadLaneList = useCallback(async () => {
        const { data } = await axios.get(`/lane/${boardNo}`);
        setLaneList(data);
    }, []);

    const handleDragEnd = useCallback(event => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = laneList.findIndex(item => item.laneNo === active.id);
        const newIndex = laneList.findIndex(item => item.laneNo === over.id);

        const prevLaneList = [...laneList];
        const movedArray = arrayMove(laneList, oldIndex, newIndex).map((item, index) => ({
            ...item,
            laneOrder: index + 1
        }));
        setLaneList(movedArray);
        const orderDataList = movedArray.map(item => ({
            laneNo: item.laneNo,
            laneOrder: item.laneOrder
        }));

        laneOrderUpdate(orderDataList, prevLaneList);
    }, [laneList]);

    const laneOrderUpdate = useCallback(async (orderDataList, prevLaneList)=>{
        try {
            await axios.put(`/lane/order`, orderDataList);
        }
        catch(e) {
            setLaneList(prevLaneList);
        }
    },[]);

    return (<>
        <div className="row">
            <div className="col">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <button onClick={createLane}>+lane</button>
            </div>
        </div>

        <div className="lane-wrapper mt-4">
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableContext items={sortableItems} strategy={horizontalListSortingStrategy}>
                    {laneList.map(lane => (
                        <Lane key={lane.laneNo} lane={lane} loadLaneList={loadLaneList}></Lane>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    </>)
}