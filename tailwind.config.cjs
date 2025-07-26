const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Display", "-apple-system", "Inter", "system-ui", "sans-serif"],
        display: ["SF Pro Display", "Inter Variable", "system-ui", "sans-serif"],
        mono: ["SF Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Dark theme foundation
        dark: {
          DEFAULT: "#0a0a0a",
          50: "#1a1a1a", 
          100: "#1f1f1f",
          200: "#262626",
          300: "#2d2d2d",
          400: "#333333",
          500: "#404040",
          600: "#525252",
          surface: "#111111",
          elevated: "#181818",
          overlay: "rgba(0, 0, 0, 0.8)",
        },
        // Bitcoin orange with variations
        btc: {
          DEFAULT: "#ff9500",
          bright: "#ffaa00",
          muted: "#cc7700",
          glow: "rgba(255, 149, 0, 0.4)",
          gradient: {
            from: "#ff9500",
            to: "#ffcc00",
          },
        },
        // Modern accent colors
        accent: {
          neon: "#00ff88",
          electric: "#00d9ff",
          plasma: "#ff0099",
          cyber: "#ffff00",
          violet: "#8b5cf6",
        },
        // Semantic colors
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          hover: "rgba(255, 255, 255, 0.08)",
          active: "rgba(255, 255, 255, 0.12)",
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "120": "30rem",
        "128": "32rem",
        "140": "35rem",
      },
      boxShadow: {
        // Glowing effects
        "glow-sm": "0 0 10px rgba(255, 149, 0, 0.3)",
        "glow": "0 0 20px rgba(255, 149, 0, 0.4)",
        "glow-lg": "0 0 40px rgba(255, 149, 0, 0.5)",
        "glow-xl": "0 0 60px rgba(255, 149, 0, 0.6)",
        // Neon effects
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.4)",
        "neon-blue": "0 0 20px rgba(0, 217, 255, 0.4)",
        "neon-pink": "0 0 20px rgba(255, 0, 153, 0.4)",
        // Modern shadows
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "brutal": "5px 5px 0px rgba(255, 149, 0, 0.3)",
        "float": "0 20px 70px -15px rgba(0, 0, 0, 0.5)",
        "depth": "0 50px 100px -20px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
      },
      backgroundImage: {
        // Gradients
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "radial-gradient(at 40% 20%, hsla(28,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.3) 0px, transparent 50%)",
        // Patterns
        "grid-pattern": "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        "dot-pattern": "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-16": "16px 16px",
        "grid-32": "32px 32px",
        "dot-16": "16px 16px",
      },
      keyframes: {
        // Smooth animations
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
        },
        glow: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.2)" },
        },
        // Entrance animations
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Creative animations
        morphing: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Hover animations
        tiltRight: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(1deg) scale(1.02)" },
        },
        tiltLeft: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "100%": { transform: "rotate(-1deg) scale(1.02)" },
        },
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-up": "slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "morphing": "morphing 8s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "tilt-right": "tiltRight 0.3s ease-out forwards",
        "tilt-left": "tiltLeft 0.3s ease-out forwards",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
        "98": "0.98",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      blur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};