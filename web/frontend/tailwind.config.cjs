module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./index.html", 
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'primary': '#194456',
      'primary-light': '#3b8f85',
      'secondary': '#f28606',
      'secondary-light': '#ffb11d',
      'background': '#dde3e5',
    },
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
  ],
};
