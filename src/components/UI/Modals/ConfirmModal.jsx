import { Button, Flex, Modal } from "antd";
import React from "react";
import "./ConfirmModal.scss";

function ConfirmModal(props) {
  const { open, onOk, onCancel, title, children, loading, footer } = props;

  return (
    <Modal
      className="modal-confirm"
      title={title}
      open={open}
      onCancel={onCancel}
      footer={
        footer || (
          <Flex justify="end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" loading={loading} onClick={onOk}>
              Ok
            </Button>
          </Flex>
        )
      }
    >
      <hr />
      <p className="children-confirm-modal">{children}</p>
    </Modal>
  );
}

export default ConfirmModal;
