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

  .btn-create-new-post {
    height: 34px;
    border-radius: 8px;
    border: 0.5px solid #64646473;
    width: fit-content;
    margin: auto;
  }

  .wrap-detail-user {
    padding: ${(p) => (p.isMobile ? "12px" : "0px")};

    .btn-edit-profile {
      height: 34px;
      border-radius: 8px;
      border: 0.5px solid #64646473;
    }
  }
`;
