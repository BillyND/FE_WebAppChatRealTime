import { Button, Flex, Modal } from "antd";
import React from "react";
import "./Modal.scss";

function BaseModal(props) {
  const { onOk, onCancel, children, loading, footer, content, style } = props;

  return (
    <Modal
      {...props}
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
      style={style}
    >
      <hr className="gray" />
      {content || children}
    </Modal>
  );
}

export default BaseModal;
