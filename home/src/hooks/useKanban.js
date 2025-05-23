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

    const updateLaneOrder = async (boardNo, orderDataList) => {
        await axios.put(`/lane/${boardNo}/order`, orderDataList);
    };



    /////////////////////////////////////////////////
    const createCard = async (boardNo, laneNo, cardTitle) => {
        await axios.post(`/card/${boardNo}/lane/${laneNo}`, {cardTitle: cardTitle});
    };

    const deleteCard = async (boardNo, cardNo) => {
        await axios.delete(`/card/${boardNo}/${cardNo}`);
    };

    const updateCardOrder = async (boardNo, orderDataList) => {
        await axios.put(`/card/${boardNo}/order`, orderDataList);
    };

    const updateCardOrderBetween = async (boardNo, orderDataMap) => {
        await axios.put(`/card/${boardNo}/orderBetween`, orderDataMap);
    };

    const moveBetweenLanes = (activeList, activeIndex, overList, overIndex, item) => {
        const before = removeAtIndex(activeList, activeIndex);
        const after = insertAtIndex(overList, overIndex, item);
        const result = {before, after};
        return result;
    };

    

    return { 
        convertToMap, createLane, deleteLane, updateLaneOrder, 
        createCard, deleteCard, updateCardOrder, updateCardOrderBetween, 
        moveBetweenLanes 
    };
};