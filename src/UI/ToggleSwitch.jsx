import React from "react";
import styled from "styled-components";

const ToggleSwitch = ({ active, onToggle }) => {
  const handleToggle = () => {
    const newState = !active;
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <SwitchContainer onClick={handleToggle} isActive={active}>
      <SwitchHandle isActive={active} />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  width: 40px;
  height: 20px;
  background-color: ${({ isActive }) => (isActive ? "#4CAF50" : "#ccc")};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
`;

const SwitchHandle = styled.div`
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${({ isActive }) => (isActive ? "21px" : "2px")};
  transition: 0.2s;
`;

export default ToggleSwitch;
