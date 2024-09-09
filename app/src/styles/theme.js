// theme.js

const generalColors = {
  primary_dark: "#172242",
  primary_light: "#8ea1d7",
  primary_1: "#2E4483",
  primary_2: "#2257A8",
  secundary_1: "#95C11F",
  secundary_2: "#B0D159",
  secundary_3: "#F3F9E6",
  grey: "#E6E6E6",

  danger: "#cc3333",
  dangerText: "#87141f",
  dangerBackColor: "#f8d0c8",
  alert: "#ffab00",
  success: "#36b37e",
  information: "#0065ff",
  help: "#6554c0",
  neutral: "#ebecf0",
};
const fonts = {
  main: "Arial, sans-serif",
  color: "#fff",
};

export const lightTheme = {
  colors: {
    ...generalColors,
    background: "#fff",
    text: "#172242",
  },
  fonts: fonts,
};
export const darkTheme = {
  colors: {
    ...generalColors,
    background: "#2F2E41",
    text: "#fff",
  },
  fonts: fonts,
};
