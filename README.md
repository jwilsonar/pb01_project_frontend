# 📋 Cliente Next.js con Material UI y Autenticación

Este proyecto es una aplicación web moderna construida con Next.js 15, Material UI y sistema de autenticación integrado. Proporciona una base sólida para construir aplicaciones web escalables y seguras.

## 🚀 Características

- ⚡ **Next.js 15** con Turbopack para desarrollo ultrarrápido
- 🎨 **Material UI v6** para una interfaz de usuario moderna y responsive
- 🔐 **Autenticación** integrada con NextAuth.js
- 📄 **Soporte PDF** con react-pdf
- 🎯 **TypeScript** para un desarrollo más seguro y productivo
- 🎨 **TailwindCSS** para estilos personalizados
- ☁️ **Integración con AWS S3** para almacenamiento de archivos
- 🔥 **Hot Toast** para notificaciones elegantes

## 📦 Prerrequisitos

- Node.js 18.x o superior
- npm o yarn
- Una cuenta de AWS (para funcionalidades de S3)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/jwilsonar/pb01_project_frontend.git
cd client
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables:
```env
# Autenticación
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-aqui

# AWS S3
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=tu-region
```

## 🚀 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 📚 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 🏗️ Estructura del Proyecto

```
client/
├── src/
│   ├── app/           # Rutas y páginas de la aplicación
│   ├── components/    # Componentes reutilizables
│   ├── lib/          # Utilidades y configuraciones
│   └── types/        # Definiciones de tipos TypeScript
├── public/           # Archivos estáticos
└── ...
```

## 🔧 Configuración

### Material UI

El proyecto utiliza Material UI con el tema personalizado configurado en `src/app/theme.ts`.

### Autenticación

La autenticación está implementada usando NextAuth.js. Configura los proveedores en `src/app/api/auth/[...nextauth]/route.ts`.

### AWS S3

La integración con S3 está configurada para manejar archivos. Asegúrate de tener las credenciales correctas en las variables de entorno.

## 📝 Mejores Prácticas

1. **Tipado Estricto**: Utiliza TypeScript para todos los archivos nuevos
2. **Componentes**: Mantén los componentes pequeños y reutilizables
3. **Estado**: Utiliza React hooks y Context API para el manejo de estado
4. **Seguridad**: No expongas información sensible en el código cliente
5. **Performance**: Utiliza Image y otros componentes optimizados de Next.js

## 🚀 Despliegue

La forma más sencilla de desplegar es usando [Vercel](https://vercel.com):

1. Sube tu repositorio a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. ¡Listo!

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.
