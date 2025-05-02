import { useMemo, useState } from "react";
import "../css/Card.css";
import Card from "./Card";
import { rectSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";

export default function CardWrapper(props){
    const {cardList} = props;

    const sortableItems = useMemo(()=>{
        return cardList.map(card=>"card"+card.cardNo);
    },[cardList]);

    return(<>
        <div className="card-wrapper">
            <SortableContext items={sortableItems} strategy={rectSortingStrategy}>
                {cardList.map((card, index)=>(
                    <Card key={card.cardNo} id={sortableItems[index]} card={card}></Card>
                ))}
            </SortableContext>
        </div>
    </>)
}