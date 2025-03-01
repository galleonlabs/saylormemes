const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["monospace", ...defaultTheme.fontFamily.sans],
        mono: ["monospace", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        btc: {
          DEFAULT: "#FF9900",
          50: "#FFF5E6",
          100: "#FFEACC",
          200: "#FFD699",
          300: "#FFC266",
          400: "#FFAD33",
          500: "#FF9900",
          600: "#CC7A00",
          700: "#995C00",
          800: "#663D00",
          900: "#331F00",
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-btc': 'pulse 2s infinite',
      },
      boxShadow: {
        'btc-sm': '0 1px 2px 0 rgba(255, 153, 0, 0.05)',
        'btc': '0 1px 3px 0 rgba(255, 153, 0, 0.1), 0 1px 2px 0 rgba(255, 153, 0, 0.06)',
        'btc-md': '0 4px 6px -1px rgba(255, 153, 0, 0.1), 0 2px 4px -1px rgba(255, 153, 0, 0.06)',
        'btc-lg': '0 10px 15px -3px rgba(255, 153, 0, 0.1), 0 4px 6px -2px rgba(255, 153, 0, 0.05)',
        'btc-xl': '0 20px 25px -5px rgba(255, 153, 0, 0.1), 0 10px 10px -5px rgba(255, 153, 0, 0.04)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
