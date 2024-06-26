import { LoadingOutlined } from "@ant-design/icons";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { Flex, Modal } from "antd";

function BaseModal(props) {
  const {
    onOk,
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
      zIndex={100}
      footer={
        footer || (
          <Flex justify="end" gap={8} className="none-copy">
            <div
              className="btn-ok press-active"
              onClick={onOk}
              style={{
                opacity: loadingFooter ? "0.7" : "1",
              }}
            >
              {loadingFooter ? (
                <LoadingOutlined className="spinner-ok" />
              ) : (
                "Done"
              )}
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
        className="container-base-modal"
        id={scrollId}
        style={{
          overflowY: "scroll",
          maxHeight: "calc(100dvh - 250px)",
        }}
      >
        {content || children}
      </div>
    </Modal>
  );
}

export default BaseModal;
