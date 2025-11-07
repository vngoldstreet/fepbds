/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pbds: {
          blue:"#2563EB",
          black:"#1E293B",
          gray:"#E2E8F0",
        },
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInTop: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        colorBgChange: {
          "0%": {
            backgroundColor: "#FFE443",
          },
          "50%": {
            backgroundColor: "#FFFFFF",
          },
          "100%": {
            backgroundColor: "#FFE443",
          },
        },
      },
      animation: {
        "slide-in-right": "slideInRight 0.7s ease-out",
        "slide-in-left": "slideInLeft 0.7s ease-out",
        "slide-in-top": "slideInTop 0.7s ease-out",
        "slide-in-bottom": "slideInBottom 0.7s ease-out",
        "fade-in": "fadeIn 0.7s ease-out",
        "fade-in-300": "fadeIn 0.3s ease-in",
        spin: "spin 1s linear infinite",
        colorBgChange: "colorBgChange 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}