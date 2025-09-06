import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rewrite /favicon.ico to existing SVG to avoid 404s
  if (pathname === '/favicon.ico') {
    const url = request.nextUrl.clone();
    url.pathname = '/favicon.svg';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/favicon.ico'],
};
