import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import store from "./store";
import Router from "./router";

import "./styles/global.css";

const ThemedApp = () => {
  const selectedTheme = useSelector((state) => state.theme);
  const theme = selectedTheme.theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </StrictMode>
);
