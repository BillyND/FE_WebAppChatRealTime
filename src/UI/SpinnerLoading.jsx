import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useStyleApp } from "@utils/hooks/useStyleApp";

export const SpinnerLoading = ({ style, className }) => {
  const {
    styleApp: { FILL_COLOR_ICON },
  } = useStyleApp();

  return (
    <WrapSpinnerLoading
      style={{
        ...style,
      }}
      className={`transition-02 ${className}`}
      fill-icon={FILL_COLOR_ICON}
    >
      <LoadingOutlined className="icon-loading" />
    </WrapSpinnerLoading>
  );
};

export const WrapSpinnerLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;

  .icon-loading {
    scale: 2;
    height: fit-content !important;
    border-radius: 50%;

    svg {
      fill: ${(props) => props?.["fill-icon"]} !important;
    }
  }
`;
