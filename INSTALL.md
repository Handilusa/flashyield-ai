# 🛠 Guía de Instalación para Windows

Para ejecutar **FlashYield AI**, necesitas instalar dos herramientas principales: **Node.js** (para el frontend) y **Foundry** (para los contratos inteligentes).

## 1. Instalar Node.js
Node.js es necesario para ejecutar el dashboard (Next.js).

1.  Ve a la página oficial: [https://nodejs.org/](https://nodejs.org/)
2.  Descarga la versión **LTS** (Recommended for Most Users).
3.  Ejecuta el instalador `.msi`.
4.  Sigue los pasos y asegúrate de marcar la opción "Add to PATH".
5.  **Verificación**: Abre una nueva terminal (PowerShell o CMD) y escribe:
    ```powershell
    node -v
    npm -v
    ```
    Deberías ver números de versión (ej. `v20.11.0`).

## 2. Instalar Git bash (Requisito para Foundry)
Foundry se instala más fácilmente usando una terminal estilo Linux.

1.  Descarga Git for Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  Instálalo con las opciones por defecto.
3.  Esto instalará **Git Bash**, que usaremos para instalar Foundry.

## 3. Instalar Foundry
Foundry es el kit de herramientas para desarrollar en Ethereum/Monad.

1.  Abre la aplicación **Git Bash** (búscala en tu menú de inicio).
2.  Copia y pega este comando y presiona Enter:
    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    ```
    > **Nota importante**: Asegúrate de incluir la barra vertical `|` (pipe) antes de `bash`. Si no la pones, el comando fallará.

    Si el comando anterior te da problemas, prueba este alternativo que es más explícito:
    ```bash
    curl -sSf -L https://foundry.paradigm.xyz | bash
    ```
3.  Una vez termine, cierra Git Bash y abre una nueva ventana de **Git Bash** (o actualiza el path como te indique la terminal).
4.  Ejecuta:
    ```bash
    foundryup
    ```
    Esto descargará las herramientas (forge, cast, anvil).
5.  **Verificación**:
    ```bash
    forge --version
    ```

## 🚀 ¡Todo listo!
Ahora puedes volver a tu terminal (PowerShell o Git Bash) y ejecutar los comandos del proyecto:

- **Frontend**: `npm install` y luego `npm run dev`
- **Contratos**: `forge build`
