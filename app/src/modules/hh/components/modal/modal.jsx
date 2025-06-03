import SVGAlert from "../../assets/icons/modal/Alert_icon.jsx";
import * as styled from "./modalStyles.js";

const Modal = ({ modalMessage, setModalMessage }) => {
  if (!modalMessage.message) return null;

  const handleSendResponse = (response) => {
    setModalMessage({
      title: "",
      event: modalMessage.event,
      message: "",
      response: response,
    });
  };
  return (
    <styled.modalBackgroundDiv onClick={() => handleSendResponse(false)}>
      <styled.modalContainerDiv onClick={(e) => e.stopPropagation()}>
        <styled.modalAlertSvgDiv>
          <SVGAlert width="100%" height="100%" />
        </styled.modalAlertSvgDiv>
        <styled.modalTitleDiv>{modalMessage.title}</styled.modalTitleDiv>
        <styled.modalContentDiv>{modalMessage.message}</styled.modalContentDiv>
        <styled.responseButtonDiv>
          <styled.responseButton onClick={() => handleSendResponse(false)}>
            Cancelar
          </styled.responseButton>
          <styled.responseButton onClick={() => handleSendResponse(true)}>
            Confirmar
          </styled.responseButton>
        </styled.responseButtonDiv>
      </styled.modalContainerDiv>
    </styled.modalBackgroundDiv>
  );
};

export default Modal;
