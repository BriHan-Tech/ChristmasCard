/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        christmas: {
          primary: '#0f5132', // A Christmas green
          secondary: '#bb2528', // A Christmas red
          accent: '#facc15', // A warm yellow for accents
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#2563eb',
          success: '#059669',
          warning: '#facc15',
          error: '#dc2626'
        }
      }
    ]
  }
}
