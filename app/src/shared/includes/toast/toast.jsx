import { useEffect, useRef } from "react";
import * as styled from "./toastStyles.js";

const Toast = ({ toastContent, setToastContent }) => {
  const errorTimerRef = useRef(null);

  useEffect(() => {
    if (toastContent.title && toastContent.message) {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      errorTimerRef.current = setTimeout(() => {
        setToastContent({
          title: "",
          message: "",
          danger: false,
        });
      }, 2000);

      return () => {
        clearTimeout(errorTimerRef.current);
      };
    }
  }, [toastContent]);

  const handleCloseMessage = () => {
    setToastContent({
      title: "",
      message: "",
      danger: false,
    });
  };

  if (toastContent.message === "") return null;

  return (
    <styled.ToastContainer $danger={toastContent.danger}>
      <styled.toastBackground $danger={toastContent.danger}>
        <styled.CloseButton onClick={() => handleCloseMessage()}>
          x
        </styled.CloseButton>
        <h1>{toastContent.title}</h1>
        <p>{toastContent.message}</p>
      </styled.toastBackground>
    </styled.ToastContainer>
  );
};

export default Toast;
