/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // Asegúrate de que Tailwind procese los archivos en src
    "./public/**/*.html",           // Opcional, si tienes archivos HTML en public
  ],
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      'light',
      'dark', 

    ],
  },
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
   
  
    },
  },

}
