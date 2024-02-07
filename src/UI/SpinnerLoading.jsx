import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useStyleApp } from "../utils/hooks/useStyleApp";

export const SpinnerLoading = ({ style, className }) => {
  const {
    styleApp: { FILL_COLOR_ICON },
  } = useStyleApp();

  return (
    <WrapSpinnerLoading
      style={{
        ...style,
        position: "relative",
        height: "60px",
      }}
      className={`transition-02 ${className}`}
      fillIcon={FILL_COLOR_ICON}
    >
      <LoadingOutlined
        className="icon-loading"
        style={{ position: "absolute" }}
      />
    </WrapSpinnerLoading>
  );
};

export const WrapSpinnerLoading = styled.div`
  display: flex;
  justify-content: center;

  .icon-loading {
    width: fit-content;
    scale: 2;
    svg {
      fill: ${(props) => props.fillIcon} !important;
    }
  }
`;
