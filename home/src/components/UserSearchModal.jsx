import Modal from 'react-modal';
import { useEffect, useState } from 'react';

export default function UserSearchModal(props) {
    const { isOpen, cardData, closeModal } = props;

    useEffect(()=>{

    },[]);
    
    return (<>
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="modal d-block"
            overlayClassName="card-modal-overlay"
            bodyOpenClassName="modal-open"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{cardData?.cardTitle}</h5>
                        <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
            
        </Modal>
    </>)
}