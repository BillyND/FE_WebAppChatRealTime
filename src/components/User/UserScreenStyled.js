import styled from "styled-components";

export const WrapUserScreen = styled.div`
  overflow-x: hidden;
  height: 100vh;
  padding-top: 70px !important;
  width: 100%;
  display: grid;
  gap: 16px;
  padding: ${(props) =>
    props.isMobile ? "0" : props.isTablet ? "0 15%" : "0 28%"};
`;
