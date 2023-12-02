module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primaryPurple: "#3219AF",
        primaryBlue: "#197DFA",
        primaryOrange: "#FA9632",
        primaryGreen: "#4BAF7D",
        primaryPink: "#FF4BC8",
        primaryPurplePink: "#AF19C8",
        primaryYellow: "#FFAF4B",
        bodyBlack: "#141618",
        ligthGray: "#F1F6FB",
        grayColor: "#78828C",
        darkBody: "#050F19",
        darkLightGray: "#E1E6EB",
        backgroundGray: "#f1f6fb",
        lightGrayVaraint: "#F1F6FA",
        lightBlue: "#E2F3FD",
      },
      boxShadow: {
        custom: "0px 4px 4px rgba(8, 0, 24, 0.05)",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      mdlg: "1000px",
      // => @media (min-width: 768px) { ... }

      lg: "1580px"
    },
    fontSize: {
      xs: ".73rem",
      sm: ".85rem",
      base: ".90rem",
      lg: "1.0rem",
      xl: "1.11rem",
      "2xl": "1.2rem",
      "3xl": "1.5rem",
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
