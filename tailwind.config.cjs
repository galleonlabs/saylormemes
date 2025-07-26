const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["IBM Plex Serif", "Georgia", "Times New Roman", "serif"],
        mono: ["IBM Plex Mono", "Courier New", "monospace"],
      },
      colors: {
        btc: {
          DEFAULT: "#f7931a",
          light: "#f9a842",
          dark: "#e8820a",
          muted: "#fef6e7",
        },
        paper: {
          DEFAULT: "#ffffff",
          light: "#fafafa",
          cream: "#fffff8",
        },
        ink: {
          DEFAULT: "#000000",
          light: "#333333",
          lighter: "#666666",
          lightest: "#999999",
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "120": "30rem",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "footnote": ["0.8125rem", { lineHeight: "1.25rem" }],
        "citation": ["0.875rem", { lineHeight: "1.5rem" }],
        "body": ["1rem", { lineHeight: "1.75rem" }],
        "heading": ["1.125rem", { lineHeight: "1.5rem" }],
        "title": ["1.5rem", { lineHeight: "2rem" }],
        "display": ["2rem", { lineHeight: "2.5rem" }],
      },
      lineHeight: {
        "document": "1.8",
        "heading": "1.2",
        "tight": "1.1",
      },
      letterSpacing: {
        "document": "0.01em",
        "heading": "-0.02em",
        "wide": "0.05em",
      },
      borderWidth: {
        "thin": "0.5px",
      },
      maxWidth: {
        "document": "42rem",
        "wide": "56rem",
        "footnote": "28rem",
      },
      boxShadow: {
        "subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "paper": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "lifted": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};