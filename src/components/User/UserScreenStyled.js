import styled from "styled-components";

export const WrapUserScreen = styled.div`
  overflow-x: hidden;
  height: 100dvh;
  padding-top: 70px !important;
  width: 100%;
  display: grid;
  gap: 16px;
  padding: ${(props) =>
    props.isMobile ? "0" : props.isTablet ? "0 15%" : "0 28%"};

  .btn-create-new-post {
    height: 30px;
    border-radius: 8px;
    border: 0.5px solid #64646473;
    width: fit-content;
    margin: auto;
    padding: 0 16px !important;
  }

  .wrap-detail-user {
    .btn-edit-profile {
      height: 34px;
      border-radius: 8px;
      border: 0.5px solid #64646473;
    }
  }
`;

export const WrapEditProfile = styled.div`
  .label-input-avatar {
    border-radius: 50%;
    width: 70px;
  }

  .btn-done-edit {
    width: 100%;
    background-color: ${(p) => (p.isDark ? "#fff" : "#000000")};
    color: ${(p) => (p.isDark ? "#000000" : "#fff")};
    border-radius: 8px;
    height: 50px;
    overflow: hidden;

    &.loading {
      opacity: 0.5;
      cursor: no-drop;
    }

    .spinner-update-info {
      position: absolute;
      scale: 0.7;
      width: 40px;
      margin-left: 70px;
    }
  }

  .input-about-of-user {
    outline: none;
    border: none;
    background-color: transparent;
    color: ${(p) => (p.isDark ? "#fff" : "#000000")};
  }
`;
