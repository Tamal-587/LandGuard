/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#061710',
          900: '#0A2218',
          850: '#0D2B1F',
          800: '#0F3325',
          700: '#174734',
          600: '#205E46',
          500: '#2B7A5C',
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        surface: {
          50: '#F9FAF7',
          100: '#F3F5F0',
          200: '#E5E9E1',
          300: '#D1D8CA',
        },
        navy: {
          900: '#0A2218',
          800: '#0F3325',
          700: '#174734',
          600: '#205E46',
        },
        teal: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          mismatch: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
