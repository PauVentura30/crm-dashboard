export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        claude: {
          bg: '#1a1a1a',
          surface: '#2e2e2e',
          'surface-hover': '#3a3a3a',
          border: '#404040',
          text: '#e8e8e8',
          'text-muted': '#999999',
          primary: '#c17f3e',
          'primary-hover': '#d49454',
        }
      }
    },
  },
  plugins: [],
}
