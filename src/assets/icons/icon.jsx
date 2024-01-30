import { FILL_COLOR_ICON, STROKE_COLOR_ICON } from "../../utils/constant";
import { useStyleApp } from "../../utils/hooks/useStyleApp";

export const IconMoreDetail = (props) => (
  <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
    <g transform="translate(-446 -350)">
      <path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path>
    </g>
  </svg>
);

export const IconLogo = () => {
  const { styleApp } = useStyleApp();
  const { FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="50"
      viewBox="0 0 44 50"
      fill={FILL_COLOR_ICON.ACTIVE}
    >
      <path
        d="M33.8586 23.174C33.6432 23.0708 33.4245 22.9715 33.2029 22.8763C32.8169 15.7652 28.9312 11.694 22.4067 11.6523C22.3772 11.6522 22.3478 11.6522 22.3182 11.6522C18.4157 11.6522 15.1701 13.3179 13.1724 16.3491L16.7607 18.8106C18.253 16.5464 20.5951 16.0637 22.3199 16.0637C22.3399 16.0637 22.3599 16.0637 22.3796 16.0639C24.5279 16.0776 26.149 16.7022 27.1982 17.9203C27.9617 18.8071 28.4724 20.0326 28.7253 21.5791C26.8206 21.2554 24.7607 21.1559 22.5586 21.2821C16.3554 21.6394 12.3675 25.2573 12.6353 30.2844C12.7712 32.8344 14.0416 35.0281 16.2122 36.4612C18.0475 37.6727 20.4112 38.2651 22.8678 38.131C26.112 37.9531 28.657 36.7154 30.4326 34.4521C31.781 32.7333 32.6339 30.506 33.0104 27.6995C34.5565 28.6326 35.7023 29.8604 36.3352 31.3365C37.4112 33.8456 37.474 37.9687 34.1096 41.3302C31.162 44.275 27.6187 45.549 22.2639 45.5883C16.324 45.5443 11.8317 43.6393 8.91096 39.9263C6.17591 36.4495 4.76242 31.4276 4.70969 25C4.76242 18.5723 6.17591 13.5504 8.91096 10.0736C11.8317 6.36065 16.3239 4.45573 22.2639 4.41159C28.2469 4.45607 32.8174 6.37016 35.85 10.101C37.337 11.9306 38.4581 14.2315 39.1971 16.9141L43.4021 15.7922C42.5063 12.4902 41.0966 9.64471 39.1784 7.2849C35.2906 2.50174 29.6047 0.0508198 22.2785 0H22.2492C14.9379 0.0506432 9.31565 2.51089 5.53862 7.31232C2.17758 11.585 0.443855 17.5301 0.3856 24.9824L0.385418 25L0.3856 25.0176C0.443855 32.4698 2.17758 38.4151 5.53862 42.6878C9.31565 47.4891 14.9379 49.9495 22.2492 50H22.2785C28.7786 49.9549 33.3604 48.2531 37.1349 44.482C42.0732 39.5484 41.9245 33.3643 40.2969 29.568C39.1292 26.8456 36.9029 24.6344 33.8586 23.174ZM22.6355 33.7258C19.9168 33.8789 17.0923 32.6586 16.953 30.0448C16.8498 28.1068 18.3322 25.9443 22.8024 25.6867C23.3143 25.6571 23.8167 25.6427 24.3102 25.6427C25.9339 25.6427 27.4529 25.8004 28.8339 26.1023C28.3187 32.5352 25.2974 33.5797 22.6355 33.7258Z"
        fill={FILL_COLOR_ICON.ACTIVE}
      />
    </svg>
  );
};

export const IconHomeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill={FILL_COLOR_ICON.ACTIVE}
    >
      <path
        d="M2 11.6534V19.5176C2 20.6222 2.89543 21.5176 4 21.5176H8C8.27614 21.5176 8.5 21.2938 8.5 21.0176V16.4501V16.2676C8.5 13.9204 10.4028 12.0176 12.75 12.0176C15.0972 12.0176 17 13.9204 17 16.2676V16.4501V21.0176C17 21.2938 17.2239 21.5176 17.5 21.5176H21.5C22.6046 21.5176 23.5 20.6222 23.5 19.5176V11.6534C23.5 10.1444 22.8185 8.71609 21.6454 7.76677L15.8954 3.11334C14.0612 1.62889 11.4388 1.62889 9.60455 3.11334L3.85455 7.76677C2.68153 8.71609 2 10.1444 2 11.6534Z"
        fill={FILL_COLOR_ICON.ACTIVE}
        stroke={STROKE_COLOR_ICON.ACTIVE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const IconHomeDeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill={FILL_COLOR_ICON.DE_ACTIVE}
    >
      <path
        d="M2.25 12.8855V20.7497C2.25 21.8543 3.14543 22.7497 4.25 22.7497H9.25C9.52614 22.7497 9.75 22.5258 9.75 22.2497V17.6822V16.4997C9.75 14.7048 11.2051 13.2497 13 13.2497C14.7949 13.2497 16.25 14.7048 16.25 16.4997V17.6822V22.2497C16.25 22.5258 16.4739 22.7497 16.75 22.7497H21.75C22.8546 22.7497 23.75 21.8543 23.75 20.7497V12.8855C23.75 11.3765 23.0685 9.94814 21.8954 8.99882L16.1454 4.34539C14.3112 2.86094 11.6888 2.86094 9.85455 4.34539L4.10455 8.99882C2.93153 9.94814 2.25 11.3765 2.25 12.8855Z"
        fill={FILL_COLOR_ICON.DE_ACTIVE}
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const IconSearchActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill={FILL_COLOR_ICON.ACTIVE}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 11.5C3.5 7.08172 7.08172 3.5 11.5 3.5C15.9183 3.5 19.5 7.08172 19.5 11.5C19.5 15.9183 15.9183 19.5 11.5 19.5C7.08172 19.5 3.5 15.9183 3.5 11.5ZM11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22C13.949 22 16.2023 21.1615 17.9883 19.756L22.3661 24.1339C22.8543 24.622 23.6457 24.622 24.1339 24.1339C24.622 23.6457 24.622 22.8543 24.1339 22.3661L19.756 17.9883C21.1615 16.2023 22 13.949 22 11.5C22 5.70101 17.299 1 11.5 1Z"
        fill={FILL_COLOR_ICON.ACTIVE}
      />
    </svg>
  );
};

export const IconSearchDeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 11.5C3.5 7.08172 7.08172 3.5 11.5 3.5C15.9183 3.5 19.5 7.08172 19.5 11.5C19.5 15.9183 15.9183 19.5 11.5 19.5C7.08172 19.5 3.5 15.9183 3.5 11.5ZM11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22C13.949 22 16.2023 21.1615 17.9883 19.756L22.3661 24.1339C22.8543 24.622 23.6457 24.622 24.1339 24.1339C24.622 23.6457 24.622 22.8543 24.1339 22.3661L19.756 17.9883C21.1615 16.2023 22 13.949 22 11.5C22 5.70101 17.299 1 11.5 1Z"
        fill={STROKE_COLOR_ICON.DE_ACTIVE}
      />
    </svg>
  );
};

export const IconPostDeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M22.75 13V13.15C22.75 16.5103 22.75 18.1905 22.096 19.4739C21.5208 20.6029 20.6029 21.5208 19.4739 22.096C18.1905 22.75 16.5103 22.75 13.15 22.75H12.85C9.48969 22.75 7.80953 22.75 6.52606 22.096C5.39708 21.5208 4.4792 20.6029 3.90396 19.4739C3.25 18.1905 3.25 16.5103 3.25 13.15V12.85C3.25 9.48968 3.25 7.80953 3.90396 6.52606C4.4792 5.39708 5.39708 4.4792 6.52606 3.90396C7.80953 3.25 9.48968 3.25 12.85 3.25H13"
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M21.75 4.25L13.75 12.25Z" fill="black" />
      <path
        d="M21.75 4.25L13.75 12.25"
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const IconMessageActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M19.5738 16.3824L19.314 16.8317L19.449 17.333L20.2225 20.2062L17.402 19.419L16.8907 19.2763L16.4329 19.5452C14.6013 20.621 12.4407 20.9933 10.3547 20.5925C8.26875 20.1916 6.40003 19.045 5.09769 17.367C3.79535 15.6889 3.14847 13.594 3.2779 11.4738C3.40733 9.35361 4.30421 7.35303 5.80101 5.84582C7.2978 4.3386 9.29211 3.42786 11.4114 3.28372C13.5306 3.13957 15.6299 3.7719 17.317 5.06256C19.0041 6.35323 20.1636 8.21395 20.5789 10.2971C20.9942 12.3803 20.637 14.5434 19.5738 16.3824Z"
        stroke={STROKE_COLOR_ICON.ACTIVE}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const IconMessageDeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M19.5738 16.3824L19.314 16.8317L19.449 17.333L20.2225 20.2062L17.402 19.419L16.8907 19.2763L16.4329 19.5452C14.6013 20.621 12.4407 20.9933 10.3547 20.5925C8.26875 20.1916 6.40003 19.045 5.09769 17.367C3.79535 15.6889 3.14847 13.594 3.2779 11.4738C3.40733 9.35361 4.30421 7.35303 5.80101 5.84582C7.2978 4.3386 9.29211 3.42786 11.4114 3.28372C13.5306 3.13957 15.6299 3.7719 17.317 5.06256C19.0041 6.35323 20.1636 8.21395 20.5789 10.2971C20.9942 12.3803 20.637 14.5434 19.5738 16.3824Z"
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const IconUserActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M13 11.25C15.2091 11.25 17 9.45914 17 7.25C17 5.04086 15.2091 3.25 13 3.25C10.7909 3.25 9 5.04086 9 7.25C9 9.45914 10.7909 11.25 13 11.25Z"
        fill={FILL_COLOR_ICON.ACTIVE}
        stroke={STROKE_COLOR_ICON.ACTIVE}
        strokeWidth="2.5"
      />
      <path
        d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z"
        fill={FILL_COLOR_ICON.ACTIVE}
        stroke={STROKE_COLOR_ICON.ACTIVE}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const IconUserDeActive = () => {
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M13 11.25C15.2091 11.25 17 9.45914 17 7.25C17 5.04086 15.2091 3.25 13 3.25C10.7909 3.25 9 5.04086 9 7.25C9 9.45914 10.7909 11.25 13 11.25Z"
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
      />
      <path
        d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z"
        stroke={STROKE_COLOR_ICON.DE_ACTIVE}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const IconSettings = (props) => {
  const { isActive } = props;
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="20"
      viewBox="0 0 30 20"
      fill="none"
    >
      <path d="M6.66665 5.95254L23.3333 5.88235Z" fill="black" />
      <path
        d="M6.66665 5.95254L23.3333 5.88235"
        stroke={
          isActive ? STROKE_COLOR_ICON.ACTIVE : STROKE_COLOR_ICON.DE_ACTIVE
        }
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M13.3333 14.1176L23.3333 14.1176Z" fill="black" />
      <path
        d="M13.3333 14.1176L23.3333 14.1176"
        stroke={
          isActive ? STROKE_COLOR_ICON.ACTIVE : STROKE_COLOR_ICON.DE_ACTIVE
        }
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const IconSunlight = (props) => {
  const { isActive } = props;
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
    >
      <g clipPath="url(#clip0_74_2)">
        <path
          d="M9.30383 0.873047V2.41113C9.30383 2.75537 9.01086 3.04834 8.6593 3.04834C8.31506 3.04834 8.02209 2.75537 8.02209 2.41113V0.873047C8.02209 0.528809 8.31506 0.23584 8.6593 0.23584C9.01086 0.23584 9.30383 0.528809 9.30383 0.873047ZM12.2775 3.66357L13.3834 2.56494C13.6251 2.32324 14.0353 2.32324 14.277 2.56494C14.526 2.81396 14.526 3.22412 14.277 3.47314L13.1857 4.56445C12.9366 4.8208 12.5265 4.81348 12.2775 4.56445C12.0358 4.32275 12.0358 3.9126 12.2775 3.66357ZM4.13293 4.56445L3.04163 3.46582C2.80725 3.22412 2.80725 2.80664 3.04895 2.56494C3.29797 2.32324 3.71545 2.33057 3.94983 2.56494L5.04114 3.66357C5.28284 3.90527 5.28284 4.33008 5.03381 4.56445C4.79211 4.81348 4.38196 4.81348 4.13293 4.56445ZM8.6593 4.44727C10.6954 4.44727 12.3873 6.13916 12.3873 8.18262C12.3873 10.2261 10.6954 11.9253 8.6593 11.9253C6.61584 11.9253 4.92395 10.2261 4.92395 8.18262C4.92395 6.13916 6.61584 4.44727 8.6593 4.44727ZM8.6593 5.56787C7.22375 5.56787 6.03723 6.75439 6.03723 8.18262C6.03723 9.61084 7.22375 10.8047 8.6593 10.8047C10.0875 10.8047 11.274 9.61084 11.274 8.18262C11.274 6.75439 10.0875 5.56787 8.6593 5.56787ZM15.9469 8.81982H14.4161C14.0719 8.81982 13.7789 8.52686 13.7789 8.18262C13.7789 7.83838 14.0719 7.54541 14.4161 7.54541H15.9469C16.2985 7.54541 16.5914 7.83838 16.5914 8.18262C16.5914 8.52686 16.2985 8.81982 15.9469 8.81982ZM1.3717 7.54541H2.90247C3.25403 7.54541 3.547 7.83838 3.547 8.18262C3.547 8.52686 3.25403 8.81982 2.90247 8.81982H1.3717C1.02747 8.81982 0.734497 8.52686 0.734497 8.18262C0.734497 7.83838 1.02747 7.54541 1.3717 7.54541ZM13.1783 11.8081L14.277 12.8994C14.526 13.1484 14.526 13.5586 14.277 13.8003C14.0353 14.042 13.6251 14.0493 13.3834 13.8076L12.2775 12.709C12.0358 12.46 12.0358 12.0498 12.2775 11.8081C12.5265 11.5664 12.9366 11.5664 13.1783 11.8081ZM3.04163 12.8921L4.13293 11.8081C4.38196 11.5664 4.79944 11.5664 5.04114 11.8081C5.28284 12.0571 5.28284 12.4673 5.03381 12.709L3.9425 13.8003C3.69348 14.042 3.276 14.0347 3.0343 13.793C2.79993 13.5513 2.79993 13.1338 3.04163 12.8921ZM9.30383 13.9541V15.4922C9.30383 15.8364 9.01086 16.1294 8.6593 16.1294C8.31506 16.1294 8.02209 15.8364 8.02209 15.4922V13.9541C8.02209 13.6099 8.31506 13.3169 8.6593 13.3169C9.01086 13.3169 9.30383 13.6099 9.30383 13.9541Z"
          fill={FILL_COLOR_ICON.ACTIVE}
        />
      </g>
      <defs>
        <clipPath id="clip0_74_2">
          <rect width="17" height="17" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const IconMoon = (props) => {
  const { isActive } = props;
  const { styleApp } = useStyleApp();
  const { STROKE_COLOR_ICON, FILL_COLOR_ICON } = styleApp || {};

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath="url(#clip0_74_4)">
        <path
          d="M12.1382 10.7388C13.0171 10.7388 13.9106 10.5776 14.5039 10.3359C14.6797 10.27 14.7676 10.2627 14.8848 10.2627C15.1118 10.2627 15.3682 10.4678 15.3682 10.7681C15.3682 10.8486 15.3535 11.0098 15.2656 11.2002C14.0791 13.9395 11.4937 15.6094 8.30762 15.6094C3.86182 15.6094 0.631836 12.3721 0.631836 7.92627C0.631836 4.8501 2.53613 1.99365 5.24609 0.89502C5.45117 0.814453 5.59033 0.79248 5.64893 0.79248C5.95654 0.79248 6.18359 1.07812 6.18359 1.31982C6.18359 1.46631 6.16162 1.56885 6.05176 1.78125C5.78076 2.30859 5.59766 3.29004 5.59766 4.40332C5.59766 8.30713 8.10254 10.7388 12.1382 10.7388ZM1.78174 7.875C1.78174 11.6982 4.55029 14.4668 8.35156 14.4668C10.71 14.4668 12.856 13.3462 13.9692 11.5078C13.3613 11.7202 12.7241 11.8081 11.9697 11.8081C7.29688 11.8081 4.50635 9.0835 4.50635 4.50586C4.50635 3.6709 4.63086 2.9165 4.86523 2.23535C2.96826 3.4292 1.78174 5.59717 1.78174 7.875Z"
          fill={FILL_COLOR_ICON.ACTIVE}
        />
      </g>
      <defs>
        <clipPath id="clip0_74_4">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
