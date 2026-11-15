import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Relative paths let the built app run from a GitHub Pages project site.
export default defineConfig({ base: './', plugins: [react()] });
