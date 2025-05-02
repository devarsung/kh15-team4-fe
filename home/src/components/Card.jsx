import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"

export default function Card(props) {
    const { id, card } = props;
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
        id: id,
        data: {
            type: "card",
            no: card.cardNo
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (<>
        <div className="card" ref={setNodeRef} style={style}>
            <button className="btn btn-info btn-sm mt-2"
                ref={setActivatorNodeRef} {...listeners} {...attributes}>
                핸들</button>
            <h5 className="my-2">[{card.cardNo}]{card.cardTitle}</h5>
        </div>
    </>)
}