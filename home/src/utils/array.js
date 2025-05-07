export const removeAtIndex = (array, index) => {
    return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array, index, item) => {
    if(array.length === 0) {
        return [item];
    }

    return [...array.slice(0, index), item, ...array.slice(index)];
};