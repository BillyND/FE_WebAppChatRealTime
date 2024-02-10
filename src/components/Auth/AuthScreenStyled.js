import styled from "styled-components";

export const WrapAuthScreen = styled.div`
  min-height: 100vh;
  background-image: url("https://cdn.shopify.com/s/files/1/0673/7366/2426/files/mountainspinkskytwilightsunsetdusksnowcovered2560x1440826321699778651102-min.jpg?v=1707402349");
  background-repeat: no-repeat;
  background-size: cover;
  color: #fff;

  .login-container {
    padding-top: 20vh;
    display: grid;

    .login-content {
      display: grid;
      gap: 20px;
      max-width: 600px;
      padding-bottom: 100px;

      .header-login {
        font-size: 34px;
        margin-bottom: 8px;
      }

      .description-login {
        color: #fff;
        font-weight: 300;
      }

      .form-control {
        height: calc(1.6em + 1.875rem + 2px);
        color: #fff;
      }

      .input-login {
        color: #000000 !important;
        border-radius: 30px;
        height: 50px;
        border: none;
        padding: 0 20px !important;

        &::placeholder {
          color: #a8a8a8;
        }
      }

      .password {
        padding: 0 !important;
      }

      .ant-input-affix-wrapper {
        input {
          color: #000000 !important;
          border-radius: 30px;
          height: 50px;
          border: none;
          padding: 0 !important;
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 0 50px 0 20px !important;

          &::placeholder {
            color: #a8a8a8;
          }
        }
        svg {
          position: absolute;
          right: 20px;
          scale: 1.2;
        }
      }

      .button-auth {
        display: flex;
        gap: 20px;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: #e8ba9e;
        height: 50px;
        outline: none;
        border: none;
        border-radius: 30px;
        transition: box-shadow 0.3s, transform 0.3s;

        .icon-loading {
          position: absolute;
          margin-left: 100px;

          svg {
            scale: 1.2;
          }
        }

        &:hover {
          background-color: #f3cfb8;
        }

        &.disable-btn {
          opacity: 0.9;
          background-color: #b9a293;
          cursor: no-drop;

          &:hover {
            background-color: #b9a293;
          }
        }
      }
    }
  }
`;
