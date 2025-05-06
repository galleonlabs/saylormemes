const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["monospace", ...defaultTheme.fontFamily.sans],
        mono: ["Courier New", "monospace"],
      },
      colors: {
        btc: "#FF9900",
        btcDark: "#e68a00",
        btcLight: "#ffad33",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      scale: {
        '102': '1.02',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      minHeight: {
        'card': '200px',
        'content': '300px',
      },
      aspectRatio: {
        'video': '16 / 9',
        'portrait': '9 / 16',
        'square': '1 / 1',
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [],
};