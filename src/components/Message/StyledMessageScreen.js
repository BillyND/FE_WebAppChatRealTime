import styled from "styled-components";

export const WrapMessageScreen = styled.div`
  height: 100vh;
  padding-top: 80px !important;
  font-weight: 400 !important;
  display: grid;
  grid-template-columns: 350px auto;

  .wrap-all-conversations {
    height: calc(100vh - 80px);
    border-inline-end: 1.5px solid #80808033;
  }

  .wrap-detail-conversation {
    height: calc(100vh - 80px);
  }
`;
