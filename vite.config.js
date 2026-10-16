// vite setup
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                login: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/index.html'
                ),

                home: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/CampusHub.html'
                ),

                createProfile: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/createProfile.html'
                ),

                signup: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/signup.html'
                ),

                verified: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/verified.html'
                ),

                profile: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/profile.html'
                ),

                feed: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/feed.html'
                ),

                comments: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/comments.html'
                ),

                marketplace: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/marketplace.html'
                ),

                messages: resolve(
                    process.cwd(),
                    'Project/CampusHub/html/messages.html'
                )
            }
        }
    }
})