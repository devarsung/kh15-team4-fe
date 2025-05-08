import axios from "axios";
import { useCallback, useState } from "react";

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cardData, setCardData] = useState(null);

    const openModal = useCallback(async (cardNo)=>{
        setIsOpen(true);
        await loadCardData(cardNo);
    }, []);

    const closeModal = useCallback(()=>{
        setCardData(null);
        setIsOpen(false);
    }, []);

    const loadCardData = useCallback(async(cardNo)=>{
        const {data} = await axios.get(`/card/detail/${cardNo}`);
        setCardData(data);
    }, []);

    return {
        isOpen, cardData, openModal, closeModal
    };
}