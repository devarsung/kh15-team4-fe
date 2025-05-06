import axios from "axios";
import { removeAtIndex, insertAtIndex } from "../utils/array";

export const useKanban = () => {

    const createLane = async (boardNo, laneTitle) => {
        await axios.post(`/lane/${boardNo}`, { laneTitle: laneTitle });
        //loadLaneFullList();
    };

    const loadLaneFullList = async (boardNo) => {
        const { data } = await axios.get(`/lane/lanefull/${boardNo}`);
        return data;
    };

    const updateLaneOrder = async (orderDataList) => {
        await axios.put(`/lane/order`, orderDataList);
    };

    const updateCardOrder = async (orderDataList) => {
        await axios.put(`/card/order/`, orderDataList);
    };

    const moveBetweenLanes = (activeCardList, activeIndex, overCardList, overIndex, item) => {
        const before = removeAtIndex(activeCardList, activeIndex);
        const after = insertAtIndex(overCardList, overIndex, item);
        const result = {before, after};
        return result;
    };

    return { createLane, loadLaneFullList, updateLaneOrder, updateCardOrder, moveBetweenLanes };
};