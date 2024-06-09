import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile as singleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['preval'],
      },
    }),
    singleFile(),
  ],
})
