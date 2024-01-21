import { Button, Flex, Modal } from "antd";
import React from "react";
import "./UI.scss";

function BaseModal(props) {
  const {
    onOk,
    onCancel,
    children,
    loadingFooter,
    footer,
    content,
    style,
    scrollId,
  } = props;

  return (
    <Modal
      {...props}
      footer={
        footer || (
          <Flex justify="end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" loading={loadingFooter} onClick={onOk}>
              Ok
            </Button>
          </Flex>
        )
      }
      style={style}
    >
      <hr className="gray" />
      <div
        id={scrollId}
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        {content || children}
      </div>
    </Modal>
  );
}

export default BaseModal;
