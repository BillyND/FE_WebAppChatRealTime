import styled from "styled-components";

export const WrapHomeScreen = styled.div`
  overflow-x: hidden;
  height: 100dvh;
  padding-top: 70px !important;
  width: 100%;
  display: grid;
  gap: 16px;
  padding: ${(props) =>
    props?.["is-mobile"] ? "0" : props?.["is-tablet"] ? "0 15%" : "0 28%"};
`;

export const WrapNavMenu = styled.div`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  backdrop-filter: blur(28.5px);
  background-color: ${(props) => props?.["background-color"]};
  color: ${(props) => props.color};
  width: 100%;
  height: 70px;
  position: fixed;
  top: 0;
  z-index: 1;

  .group-nav-menu {
    display: ${(props) => (props?.["is-mobile"] ? "flex" : "grid")};
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
    z-index: 2;
    position: ${(p) => (p?.["is-mobile"] ? "" : "fixed")};
    left: 8%;
    svg {
      width: 32px;
      height: 32px;
    }

    ${(props) =>
      props?.["is-tablet"]
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
`;

export const WrapControlNav = styled.div`
  box-shadow: ${(p) =>
    p?.["is-mobile"] && "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"};
  position: fixed;
  bottom: 0;
  height: 66px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(${(p) => (p?.["is-tablet"] ? "28.5px" : "0")});
  z-index: 1;

  .icon-nav {
    position: relative;
    padding: ${(props) => (props?.["is-tablet"] ? "20px 20px" : "20px 35px")};
    border-radius: 8px;

    &:hover {
      background-color: ${(p) => (p?.["is-dark"] ? "#9a9a9a14" : "#9a9a9a2b")};
    }
  }
`;

export const WrapButtonSettings = styled.div`
  position: absolute;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: ${(p) => (p?.["is-mobile"] ? "10px" : "8%")};
  top: 10px;
  z-index: 2;
`;

export const WrapContentPopoverSettings = styled.div`
  min-width: 170px;
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

export const WrapInputProblem = styled.div`
  .input-problem {
    width: 100%;
    border-radius: 12px;
    padding: 8px;
    height: 200px;
    resize: none;
    background-color: #ffffff0f;
    outline: none;
  }
`;
