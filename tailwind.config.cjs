const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["monospace", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        btc: "#FF9900",
      },
    },
  },
  plugins: [],
};
