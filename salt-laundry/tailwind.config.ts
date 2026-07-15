import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        salt: {
          navy:         '#103050',
          'navy-hover': '#1c4570',
          green:        '#70a030',
          'green-hover':'#628f29',
          'green-light':'#e8f0d8',
          cream:        '#f5f4f1',
          border:       '#e2e0da',
          text:         '#1c1c1a',
          'text-sec':   '#6b6b68',
          'text-muted': '#9e9e9b',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}

export default config
