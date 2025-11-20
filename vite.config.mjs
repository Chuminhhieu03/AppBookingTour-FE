import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

import path from 'path';
const resolvePath = (str) => path.resolve(__dirname, str);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const API_URL = `${env.VITE_APP_BASE_NAME}`;
    const PORT = 3000;

    return {
        server: {
            // this ensures that the browser opens upon server start
            open: true,
            // this sets a default port to 3000
            port: PORT,
            host: true
        },
        preview: {
            open: true,
            host: true
        },
        define: {
            global: 'window'
        },
        resolve: {
            alias: [
                { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
                { find: 'api', replacement: path.resolve(__dirname, 'src/api') },
                { find: 'views', replacement: path.resolve(__dirname, 'src/views') },
                { find: 'routes', replacement: path.resolve(__dirname, 'src/routes') },
                { find: 'utils', replacement: path.resolve(__dirname, 'src/utils') },
                { find: 'features', replacement: path.resolve(__dirname, 'src/features') },
                { find: 'store', replacement: path.resolve(__dirname, 'src/store') },
                { find: 'layout', replacement: path.resolve(__dirname, 'src/layout') },
                { find: 'assets', replacement: path.resolve(__dirname, 'src/assets') },
                { find: 'sections', replacement: path.resolve(__dirname, 'src/sections') },
                { find: 'constant', replacement: path.resolve(__dirname, 'src/constant') },
                { find: 'Constants', replacement: path.resolve(__dirname, 'src/Constants') },
                { find: 'DTO', replacement: path.resolve(__dirname, 'src/DTO') },
                { find: 'entities', replacement: path.resolve(__dirname, 'src/entities') }
            ]
        },
        css: {
            preprocessorOptions: {
                scss: {
                    charset: false
                },
                less: {
                    charset: false
                }
            },
            charset: false,
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            }
                        }
                    }
                ]
            }
        },
        build: {
            chunkSizeWarningLimit: 1600,
            rollupOptions: {
                input: {
                    main: resolvePath('index.html'),
                    legacy: resolvePath('index.html')
                }
            }
        },
        base: API_URL,
        plugins: [react(), jsconfigPaths()]
    };
});
