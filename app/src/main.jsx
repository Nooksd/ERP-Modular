import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import { lightTheme, darkTheme } from "./styles/theme";
import store from "./store";
import Router from "./router/router";

import "./styles/global.css";

const ThemedApp = () => {
  const selectedTheme = useSelector((state) => state.theme);
  const theme = selectedTheme.theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemedApp />
  </Provider>
);
