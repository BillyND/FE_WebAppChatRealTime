import styled from "styled-components";
import { BACKGROUND_STYLE_APP, TYPE_STYLE_APP } from "../../utils/constant";

export const WrapHomeScreen = styled.div`
  .home-container {
    overflow-x: hidden;
    height: 100vh;
    width: 100%;
    display: grid;
    padding-top: 70px;
    padding-bottom: 70px;

    .home-content {
      gap: 24px;
      padding: ${(props) =>
        props.isMobile ? "0" : props.isTablet ? "0 15%" : "0 28%"};
      background-color: #18191a;
    }
  }
`;

export const WrapNavMenu = styled.div`
  backdrop-filter: blur(28.5px);
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  width: 100%;
  height: 70px;
  position: fixed !important;
  top: 0 !important;

  .group-nav-menu {
    display: grid;
    grid-template-columns: 20% auto 20%;
    height: 100%;
  }

  .group-nav {
    height: 100%;
    width: 100%;
    text-align: center;
  }

  .icon-logo {
    svg {
      width: 32px;
      height: 32px;
    }

    ${(props) =>
      props.isMobile
        ? `
   &:active {
      transform: scale(0.9);
    }`
        : `  &:hover {
       transform: scale(1.07); 
    }`}
  }

  .icon-nav {
    padding: 20px 40px;
    border-radius: 8px;

    ${(props) =>
      props.isMobile
        ? `
   &:active {
      transform: scale(0.9);
    }`
        : `  &:hover {
          background-color: #31313187;
    }`}
  }
`;

export const WrapButtonSettings = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
