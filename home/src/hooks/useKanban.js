import axios from "axios";
import { removeAtIndex, insertAtIndex } from "../utils/array";

export const useKanban = () => {

    const convertToMap = (laneFullList) => {
        const lanes = {};
        const cards = {};

        laneFullList.forEach(item => {
            const laneDto = item.laneDto;
            const cardList = item.cardList;

            const { laneOrder, ...restData } = laneDto;
            lanes[`lane${laneDto.laneNo}`] = {
                ...restData,
                cardIdList: cardList.map(card => `card${card.cardNo}`)
            };

            cardList.forEach(card => {
                const { cardOrder, laneNo, ...restData } = card;
                cards[`card${card.cardNo}`] = {
                    ...restData
                };
            });
        });

        const laneIds = Object.keys(lanes);
        return {lanes, cards, laneIds};
    };

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
        await axios.put(`/card/order`, orderDataList);
    };

    const updateCardOrderBetween = async (orderDataMap) => {
        await axios.put(`/card/orderBetween`, orderDataMap);
    };

    const moveBetweenLanes = (activeList, activeIndex, overList, overIndex, item) => {
        const before = removeAtIndex(activeList, activeIndex);
        const after = insertAtIndex(overList, overIndex, item);
        const result = {before, after};
        return result;
    };

    return { convertToMap, createLane, loadLaneFullList, updateLaneOrder, 
            updateCardOrder, updateCardOrderBetween, moveBetweenLanes };
};