import React, { useEffect, useRef } from "react";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { io } from "socket.io-client";

function TriggerSocket(props) {
  const socketRef = useRef();
  const { infoUser } = useAuthUser();

  return <></>;
}

export default TriggerSocket;
