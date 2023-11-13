import { Modal } from "antd";
import React from "react";
import { useModal } from "../../hooks/useModal";

function ModalNewPost(props) {
  const {
    state: { MODAL_NEW_POST },
    closeModal,
  } = useModal();

  const showModal = () => {};

  const handleOk = () => {};

  const handleCancel = () => {
    closeModal("MODAL_NEW_POST");
  };

  console.log(">>>MODAL_NEW_POST:,", MODAL_NEW_POST);

  return (
    <Modal
      title="Basic Modal"
      open={MODAL_NEW_POST}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default ModalNewPost;
