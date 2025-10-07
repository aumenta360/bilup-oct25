import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que no requieren autenticación
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/signup',
  '/terms',
  '/privacy'
]

// Función para verificar si una ruta es pública
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // No aplicar middleware a rutas de API, assets estáticos, imágenes o favicon
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('/static/') ||
    pathname.includes('/images/')
  ) {
    return NextResponse.next()
  }

  // Obtener el token de autenticación (primero de cookie, luego de header)
  const tokenFromCookie = request.cookies.get('token')?.value
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const token = tokenFromCookie || tokenFromHeader

  // Si el usuario está en la ruta raíz /, redirigir al dashboard si hay token, al login si no
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si es una ruta protegida y el usuario no está autenticado, redirigir al login
  if (!isPublicPath(pathname) && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Si es una ruta pública y el usuario está autenticado, redirigir al dashboard
  if (isPublicPath(pathname) && token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Para todas las demás rutas, continuar
  const response = NextResponse.next()
  
  // Si hay token en el header pero no en cookie, establecerlo
  if (tokenFromHeader && !tokenFromCookie) {
    response.cookies.set('token', tokenFromHeader, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
  }

  return response
}

// Mantener el matcher para rutas estáticas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. Rutas de API (/api/*)
     * 2. Archivos estáticos (_next/static/*, _next/image/*, favicon.ico, etc.)
     */
    '/((?!api|_next/static|_next/image).*)',
  ],
} 