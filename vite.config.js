// vite setup
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: resolve(
                process.cwd(),
                'Project/CampusHub/html/index.html'
            )
        }
    }
})