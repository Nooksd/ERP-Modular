// theme.js

const generalColors = {
  primary_dark: "#172242",
  primary_1: "#2E4483",
  primary_2: "#2257A8",
  secundary_1: "#95C11F",
  secundary_2: "#B0D159",
  secundary_3: "#F3F9E6",
};
const fonts = {
  main: "Arial, sans-serif",
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
