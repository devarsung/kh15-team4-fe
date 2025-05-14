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
    };

    const deleteLane = async (laneNo) => {
        try {
            await axios.delete(`/lane/${laneNo}`);
        }
        catch(e){}
    };

    const selectLaneFullList = async (boardNo) => {
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

    const createCard = async (laneNo, cardTitle) => {
        await axios.post(`/card/${laneNo}`, {cardTitle: cardTitle});
    };

    return { convertToMap, createLane, deleteLane, updateLaneOrder, 
            updateCardOrder, updateCardOrderBetween, moveBetweenLanes, createCard };
};