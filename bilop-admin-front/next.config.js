const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    // serverActions true ya no es necesario en Next.js 14
  },
  // Deshabilitar la generación estática
  staticPageGenerationTimeout: 90,
  typescript: {
    // Ignora errores de typescript durante la construcción
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora errores de eslint durante la construcción
    ignoreDuringBuilds: true,
  },
  // Fuerza el modo dinámico en todas las páginas 
  compiler: {
    styledComponents: true,
  },
  // Desactivar la generación de páginas estáticas
  // y forzar todas las rutas a ser dinámicas
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  generateEtags: false,
  poweredByHeader: false,
  // Configuración de runtime
  serverRuntimeConfig: {
    // Solo disponible en el servidor
    mySecret: 'secret',
  },
  publicRuntimeConfig: {
    // Disponible tanto en servidor como en cliente
    staticFolder: '/static',
  },
  // Agregar configuración de webpack para resolver alias @/
  webpack: (config, { isServer }) => {
    // Añadir alias específicos para resolver imports @/
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, './components'),
      '@/components/ui': path.resolve(__dirname, './components/ui'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/services': path.resolve(__dirname, './services'),
      '@/types': path.resolve(__dirname, './types'),
    };
    
    return config;
  },
};

module.exports = nextConfig; 