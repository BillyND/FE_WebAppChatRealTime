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
      <div className="switch-handle" />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  width: 32px;
  height: 18px;
  background-color: ${({ isActive }) => (isActive ? "#4CAF50" : "#ccc")};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: 0.2s !important;

  .switch-handle {
    width: 14px;
    height: 14px;
    background-color: #fff;
    border-radius: 14px;
    position: absolute;
    top: 2px;
    left: ${({ isActive }) => (isActive ? "16px" : "2px !important")};
    transition: 0.2s !important;
  }
`;

export default ToggleSwitch;
