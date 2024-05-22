import { Switch } from "antd";
import styled from "styled-components";

const ToggleSwitch = ({ active, onToggle }) => {
  const handleToggle = () => {
    const newState = !active;
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <SwitchContainer>
      <Switch size="small" checked={active} onClick={handleToggle} />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  .ant-switch {
    background-color: #ccc !important;
    outline: none !important;
  }

  .ant-switch-checked {
    background-color: #4caf50 !important;
  }
`;

export default ToggleSwitch;
