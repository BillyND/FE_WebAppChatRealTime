import { Modal } from "antd";
import React from "react";

function ConfirmModal(props) {
  const { open, onOk, onCancel, title, content } = props;

  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel}>
      {content}
    </Modal>
  );
}

export default ConfirmModal;
