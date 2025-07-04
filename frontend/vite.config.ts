import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');

  return{

    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(env.API_URL),
      
    },
    plugins: [react()]
  }
})