/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3333FF",
        hash: "#808080",
        info: "##6161ff",
        playground: "#6161ff",
        "light-gray": "#E7F8FF",
        "green-playground": "#00C38A",
        "light-gray": "#FAFAFA",
        
      },
    },
  },
  plugins: [],
};
