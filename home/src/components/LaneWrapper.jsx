import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, arrayMove } from "@dnd-kit/sortable";
import Lane from "./Lane";
import axios from "axios";
import "../css/Lane.css";

export default function LaneWrapper(props) {
    const boardNo = props.boardNo;

    return (<>

        <div className="lane-wrapper mt-4">
            
        </div>
    </>)
}