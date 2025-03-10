import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    
    // Si el usuario está autenticado y trata de acceder a la página principal
    if (token && req.nextUrl.pathname === '/') {
      const isHR = token.is_hr as boolean;
      return NextResponse.redirect(new URL(isHR ? '/empleados' : '/mi-perfil', req.url));
    }

    const isHR = token?.is_hr as boolean;
    const path = req.nextUrl.pathname;

    // Restricción de acceso basada en el rol
    if (isHR && path.startsWith('/mi-perfil')) {
      return NextResponse.redirect(new URL('/empleados', req.url));
    }

    if (!isHR && path.startsWith('/empleados')) {
      return NextResponse.redirect(new URL('/mi-perfil', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/empleados/:path*',
    '/mi-perfil/:path*',
  ],
}; 