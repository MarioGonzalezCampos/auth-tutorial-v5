// Importamos la librería NextAuth desde "next-auth"
import NextAuth from "next-auth"

// Importamos la configuración de autenticación que hemos definido en "auth.config"
import authConfig from "./auth.config"

// Importamos constantes y rutas que usaremos para gestionar las redirecciones y accesos
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
 
// Inicializamos NextAuth con la configuración, y destructuramos la propiedad 'auth' para exportarla.
// 'NextAuth(authConfig)' se encarga de configurar y manejar la lógica interna de autenticación.
export const { auth } = NextAuth(authConfig)

// Exportamos por defecto la función 'auth', que actúa como un middleware para NextAuth.
// Dentro, definimos cómo manejar las solicitudes entrantes (req) en términos de rutas y autenticación.
export default auth((req) => {
    // Obtenemos el objeto 'nextUrl' del request (req), que contiene información sobre la URL a la que se accede.
    const { nextUrl } = req;

    // Determinamos si el usuario está logueado verificando 'req.auth'. 
    // La doble negación ( !! ) fuerza el valor a un booleano: true si req.auth existe, false en caso contrario.
    const isLoggedIn = !!req.auth;

    // Verificamos si la ruta actual empieza con el prefijo reservado para API de autenticación.
    // Esto sirve para no aplicar redirecciones en esas rutas.
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    // Verificamos si la ruta actual se encuentra en nuestro array de rutas públicas,
    // que no requieren autenticación.
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    // Verificamos si la ruta actual se encuentra en nuestro array de rutas de autenticación
    // (login, register, etc.).
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    // Este console.log es meramente para debug, imprimiendo los valores anteriores.
    console.log({ nextUrl, isLoggedIn, isApiAuthRoute, isPublicRoute, isAuthRoute })

    // Si la ruta es de la API de autenticación, no forzamos ninguna redirección (dejamos pasar).
    if (isApiAuthRoute) {
        return null;
    }

    // Si la ruta actual es una ruta de autenticación (login, register, etc.)...
    if (isAuthRoute) {
        // ...y el usuario ya está logueado, lo redirigimos a la ruta definida por defecto en 'DEFAULT_LOGIN_REDIRECT'.
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        };
        // De lo contrario, si no está logueado, simplemente no hacemos nada y dejamos que el usuario 
        // acceda a la página de login o register.
        return null;
    }

    // Si no está logueado y además no es una ruta pública, lo redirigimos a la página de login.
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    // Si ninguna de las condiciones anteriores aplica, no hacemos nada y dejamos pasar.
    return null;
})

// Exportamos la configuración de NextAuth Middleware.
// 'matcher' define qué rutas deben ser controladas por el middleware.
export const config = {
    matcher: [
        // Este patrón coincide con cualquier ruta que no sea interna de Next.js
        // (no comience con "_next" ni sea un archivo estático tipo .css, .js, .png, etc.)
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Y también se aplica a rutas que tengan el prefijo /api o /trpc
        '/(api|trpc)(.*)',
    ],
}
