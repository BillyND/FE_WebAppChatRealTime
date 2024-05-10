import React, { useState } from "react";
import BaseModal from "@UI/BaseModal";
import { useModal } from "@utils/hooks/useModal";
import { WrapInputProblem } from "./HomeStyled";
import { reportProblem } from "../../services/api";
import { message } from "antd";
import { showPopupError } from "../../utils/utilities";

let cachedTimeReport = 0;
function ModalReportProblem(props) {
  const { state: modalState, closeModal } = useModal(["REPORT_PROBLEM"]);
  const [inputProblem, setInputProblem] = useState("");

  const handleClose = () => {
    setInputProblem("");
    closeModal("REPORT_PROBLEM");
  };

  const handleOk = async () => {
    try {
      const trimmedProblem = inputProblem?.trim();
      if (!trimmedProblem) throw "Detail problem cannot be left blank!";

      if (Date.now() - cachedTimeReport < 35000)
        throw "Please wait 30 seconds to report back!";

      cachedTimeReport = Date.now();
      handleClose();
      message.success("Thanks for your information!");

      await reportProblem({
        detailProblem: trimmedProblem,
        timeReport: cachedTimeReport,
      });
    } catch (error) {
      showPopupError(error);
    }
  };

  return (
    <BaseModal
      className="modal-delete-post"
      open={modalState["REPORT_PROBLEM"]}
      onCancel={handleClose}
      onOk={handleOk}
      title="What's your problem?"
      disable
    >
      <WrapInputProblem>
        <textarea
          autoComplete="off"
          value={inputProblem}
          onChange={(e) => setInputProblem(e.target.value)}
          className="mt-3 input-problem"
          placeholder="Please tell me your problem here"
          spellCheck="false"
        />
      </WrapInputProblem>
    </BaseModal>
  );
}

export default ModalReportProblem;
