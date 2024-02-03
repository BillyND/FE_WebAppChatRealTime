import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";

export const SpinnerLoading = ({ style, className }) => (
  <Flex
    style={{
      ...style,
      position: "relative",
      height: "60px",
    }}
    className={`transition-02 ${className}`}
    justify="center"
  >
    <LoadingOutlined
      className="icon-loading"
      style={{ position: "absolute" }}
    />
  </Flex>
);
