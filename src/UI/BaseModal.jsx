import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal } from "antd";
import React from "react";
import { useStyleApp } from "@utils/hooks/useStyleApp";

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
    className,
  } = props;
  const {
    styleApp: { type },
  } = useStyleApp();

  return (
    <Modal
      {...props}
      className={`${type} ${className}`}
      zIndex={2000}
      footer={
        footer || (
          <Flex justify="end" gap={8}>
            <button2 className="btn-cancel" type="primary" onClick={onCancel}>
              Cancel
            </button2>
            <button2
              className="btn-ok"
              onClick={onOk}
              style={{
                opacity: loadingFooter ? "0.7" : "1",
              }}
            >
              {loadingFooter && <LoadingOutlined className="spinner-ok" />}
              Ok
            </button2>
          </Flex>
        )
      }
      style={style}
    >
      <hr
        className="gray"
        style={{ marginLeft: "-16px", marginRight: "-16px" }}
      />
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
