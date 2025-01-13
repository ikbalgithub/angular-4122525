/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flyonui/dist/js/*.js"
  ],
  plugins: [
    require("flyonui"),
    require("flyonui/plugin")
  ],
  theme: {
    extend: {},
  },
}
