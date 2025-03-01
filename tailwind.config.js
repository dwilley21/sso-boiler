/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'taupe': '#B8A695',
        'taupe-light': '#C9BDB0',
        'taupe-dark': '#A79585',
        'offwhite': '#FBF8F5',
        'offwhite-dark': '#F0EDE9',
        'brown': '#544235',
        'brown-light': '#6A5445',
        'brown-dark': '#3E3025',
        'cream': '#F5F0E8',
        'sand': '#E5D9C9',
        'mint': '#D1E8E2',
        'teal': '#19747E',
        'sky': '#A9D6E5',
        'lightgray': '#E2E2E2',
        'teal-dark': '#156570',
        'sky-dark': '#8ec7d9',
      }
    },
  },
  plugins: [],
}

