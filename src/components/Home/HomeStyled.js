import styled from "styled-components";

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
  z-index: 100;
  backdrop-filter: blur(28.5px) !important;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  width: 100%;
  height: 70px;
  position: fixed !important;
  top: 0 !important;

  .group-nav-menu {
    display: ${(props) => (props.isMobile ? "flex" : "grid")};
    grid-template-columns: 20% auto 20%;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .group-nav {
    height: 100%;
    width: 100%;
    text-align: center;
  }

  .icon-logo {
    position: ${(p) => (p.isMobile ? "" : "fixed")};
    left: 20px;
    svg {
      width: 32px;
      height: 32px;
    }

    ${(props) =>
      props.isTablet
        ? `
     &:active {
        transform: scale(0.9);
      }`
        : ` 
      &:hover {
        transform: scale(1.07); 
      }
      
      &:active {
        transform: scale(0.9);
      }
  `}
  }

  .icon-nav {
    padding: ${(props) => (props.isTablet ? "20px 20px" : "20px 40px")};
    border-radius: 8px;

    ${(props) =>
      props.isMobile
        ? `
   &:active {
      transform: scale(0.9);
    }`
        : ` 
       &:hover {
         background-color: #31313187;
      }
      
      &:active {
        transform: scale(0.9);
      }
       
       `}
  }

  .wrap-control-nav {
    position: ${(p) => (p.isMobile ? "fixed" : "static")};
    top: calc(100vh - 66px);
    width: 100%;

    ${(props) =>
      props.isMobile &&
      `
        background-color: ${props.backgroundColor};
        color: ${props.color};
        .group-nav {
        backdrop-filter: blur(28.5px);
          }
      `}
  }
`;

export const WrapButtonSettings = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 10px;
  top: 10px;
`;

export const WrapContentPopoverSettings = styled.div`
  min-width: 170px;
  position: absolute;
  z-index: 100;
  top: -10px;
  right: -10px;
  background: #181818;
  border-radius: 16px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  font-size: 15px;
  font-weight: 500;

  .item-nav-menu {
    padding: 13px;
  }

  .boundary-line-item {
    background-color: #7777774a;
    margin: 0;
  }

  .spinner-logout {
    scale: 1.5;
  }
  .disabled {
    opacity: 0.4;
  }

  .icon-style {
    width: 20px;
    height: 20px;
  }
`;
