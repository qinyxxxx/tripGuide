import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

const DeleteModal = ({ show, onHide, onDelete, content }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
        <Modal.Title>{"Confirm Delete"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;