import { forwardRef, useImperativeHandle } from "react"

const CardModal = forwardRef((props, ref) => {
    useImperativeHandle(ref, ()=>({
        openModal: () => {},
        closeModal: () => {}
    }));
    return (<>

        <div className="modal fade" tabIndex="-1" ref={ref}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        ...
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
});

export default CardModal;