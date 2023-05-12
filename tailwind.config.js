module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primaryPurple: "#3219AF",
        primaryBlue: "#197DFA",
        primaryOrange: "#FA9632",
        primaryGreen: "#4BAF7D",
        primaryRed: "#E1324B",
        primaryPurplePink: "#AF19C8",
        primaryPink: "#FF4BC8",
        bodyBlack: "#413C46",
        ligthGray: "#F1F6FB",
        grayColor: "#78828C",
        backgroundGray: "#f1f6fb",
        fadedPurple: "#EFF4F9",
        deepGray: "#141618",
        lightBorderColor: "#E1E6EB",
        skyBlue: "#E6F5FF",
        lightGrayVaraint: "#F1F6FA",
      },
      boxShadow: {
        custom: "0px 4px 4px rgba(8, 0, 24, 0.05)",
        itemBox: "0px 16px 12px rgba(130, 130, 140, 0.1)",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      mdlg: "1000px",
      // => @media (min-width: 768px) { ... }

      lg: "1580px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    fontSize: {
      xs: ".73rem",
      sm: ".85rem",
      tiny: ".83rem",
      base: ".90rem",
      lg: "1.0rem",
      xl: "1.11rem",
      "2xl": "1.2rem",
      "3xl": "1.5rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
};
