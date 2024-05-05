import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Modal } from "antd";
import React from "react";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import PerfectScrollbar from "react-perfect-scrollbar";

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
    hiddenClose,
  } = props;
  const {
    styleApp: { type },
  } = useStyleApp();

  return (
    <Modal
      {...props}
      className={`${type} ${className} ${hiddenClose ? "hidden-lose" : ""}`}
      zIndex={2000}
      footer={
        footer || (
          <Flex justify="end" gap={8} className="none-copy">
            <div
              className="btn-cancel press-active"
              type="primary"
              onClick={onCancel}
            >
              Cancel
            </div>
            <div
              className="btn-ok press-active"
              onClick={onOk}
              style={{
                opacity: loadingFooter ? "0.7" : "1",
              }}
            >
              {loadingFooter && <LoadingOutlined className="spinner-ok" />}
              Ok
            </div>
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
          maxHeight: "calc(100dvh - 250px)",
        }}
      >
        {content || children}
      </div>
    </Modal>
  );
}

export default BaseModal;
