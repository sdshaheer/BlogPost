import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function MyModal(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>Oops !...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-3">something went wrong.</h5>
          {props.message}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default MyModal;
