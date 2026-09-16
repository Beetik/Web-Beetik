# Web Beetik

Sitio estático de Beetik MX. El código de aplicación se escribe en TypeScript y se
compila como módulos ES para conservar el despliegue estático existente.

## Estructura

```text
src/
  components/   Componentes y comportamientos reutilizables
  pages/        Puntos de entrada específicos de cada página
  types/        Tipos compartidos
  utils/        Datos y utilidades
  vendor/       Fuentes de terceros conservadas como referencia
public/         Sitio estático que se publica en EC2
  js/           JavaScript generado por TypeScript
  css/          Estilos del sitio
  img/          Imágenes y recursos gráficos
  privacy/      Página de privacidad
  terms/        Términos del servicio
```

No edites manualmente los archivos de `public/js`; se regeneran desde `src`.

## Desarrollo

```bash
npm install
npm run check
npm run build
```

Durante el desarrollo puedes usar `npm run watch`. Como los scripts generados son
módulos ES, sirve el repositorio mediante HTTP en lugar de abrir los HTML con
`file://`.

Si utilizas la extensión **Live Server** de VS Code, la configuración incluida en
`.vscode/settings.json` usa `public/` como raíz. Al seleccionar **Go Live**, el
servidor abre directamente `public/index.html` como `/` en el puerto 5501.

## Despliegue

Cada `push` a `PaginaWebIndex` ejecuta el workflow de GitHub Actions. El workflow
compila TypeScript y sincroniza el contenido de `public/` con `/var/www/beetikmx`
en EC2. De esta forma `public/index.html` se publica como el documento raíz del
dominio, sin exponer `src`, `.git` ni archivos de configuración.
