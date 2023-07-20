import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function EmailModal(props) {
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOtp = (e) => {
    e.preventDefault()
    console.log('in email modal')
    props.createUser(otp)
  };

  return (
    <>
      <Modal show={props.show} onHide={props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="mb-3">Enter OTP sent to you Email</span>
          <input
            type="text"
            className="w-100 p-2 border mt-2"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP here"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleOtp}>
            submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmailModal;
