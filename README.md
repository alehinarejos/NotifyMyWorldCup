# 🏆 Notify My World Cup 2026

**Notify My World Cup 2026** es una aplicación web interactiva de alto rendimiento diseñada para seguir el calendario oficial de la Copa Mundial de la FIFA 2026, simular resultados, calcular clasificaciones en tiempo real y programar recordatorios personalizados directamente en calendarios externos (Google Calendar, Apple, Outlook) o notificaciones de escritorio nativas.

El diseño y la interfaz de usuario están completamente inspirados en la estética oficial del portal **FIFA Play Zone** (`play.fifa.com`), utilizando bloques sólidos azul obsidian, acentos de color neón (cyan y verde volt), tipografía moderna y banderas estilizadas con corte oficial de hoja y bordes blancos.

---

## 🚀 Características Principales

1. **Datos Oficiales del Mundial 2026**:
   * **48 Selecciones**: Incluye a todos los clasificados oficiales de los 12 grupos reales (Grupo A al Grupo L), determinados tras los play-offs de marzo de 2026 (como Turquía, R.D. Congo, Irak y República Checa).
   * **16 Estadios**: Las sedes oficiales en Canadá, México y Estados Unidos, mapeadas con sus respectivas capacidades.
   * **Calendario de Jornada 1**: Los 24 partidos inaugurales de la fase de grupos con sus fechas, horarios oficiales UTC y asignación real de estadios.

2. **📡 Sincronización en Vivo (Internet)**:
   * Conecta por medio de polling directo (cada 30 segundos) con la API REST abierta y dedicada de la Copa del Mundo (`https://worldcup26.ir/get/games`).
   * Actualiza marcadores, minutos transcurridos y goleadores reales automáticamente desde internet.
   * Deshabilita los controles locales de simulación cuando está activo para evitar conflictos de datos.

3. **🎮 Simulador Manual en Tiempo Real (Local/Offline)**:
   * Permite arrancar la jornada, pausarla o avanzar todo rápidamente al final de manera local.
   * Mapea incidencias del partido con goleadores realistas (ej. *Son Heung-min* anotando para Corea del Sur o *Lamine Yamal* para España).
   * Cuenta con un **ticker de sucesos en directo** para monitorizar goles segundo a segundo.

4. **⚡ Clasificación Dinámica**:
   * La tabla del grupo seleccionado recalcula instantáneamente los puntos (Pts), partidos jugados (PJ), victorias (G), empates (E), derrotas (P) y diferencia de goles (DG) al ritmo en que cambian los marcadores de los partidos (tanto en simulación local como en vivo).

5. **⏰ Sistema de Alertas y Calendario**:
   * **Recordatorios de Calendario**: Ventana modal interactiva que permite elegir el tiempo de antelación del aviso (en el pitido inicial, 15 minutos, 1 hora, o 1 día antes).
   * **Exportación .ics**: Descarga archivos de calendario estándar compatibles con Microsoft Outlook, Apple Calendar y dispositivos móviles.
   * **Añadir a Google Calendar**: Enlaces directos preconfigurados que abren la interfaz web de Google Calendar listos para guardar el evento.
   * **Notificaciones de Escritorio**: Notificaciones emergentes locales en vivo para avisar del comienzo de los partidos o al anotarse un gol.

6. **🎨 Estética y Animaciones Premium**:
   * **Efecto destello de Gol**: Las tarjetas de partido parpadean con luz neón verde y azul (`.goal-flash`) durante 1.5 segundos en el momento exacto en que se marca un gol.
   * **Animación de Alerta**: Un icono de campana vibrante (`.bell-pulse`) indica visualmente si tienes un recordatorio activo para un partido.
   * **Diseño Responsivo**: Rejilla optimizada que previene desbordamientos y cortes laterales en pantallas medianas y móviles, con truncado elástico inteligente para nombres largos de selecciones.

---

## 🛠️ Stack Tecnológico

* **Core**: React 19 + TypeScript + Vite.
* **Estilos**: Vanilla CSS con variables CSS personalizadas y HSL adaptados.
* **Iconos**: Lucide React.
* **Compilación**: Configuración con TypeScript estricto y Vite optimizado para producción.

---

## 📦 Instalación y Uso

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y tu gestor de paquetes favorito (`pnpm` o `npm`).

1. **Clonar o abrir el directorio del proyecto**:
   ```bash
   cd /Users/alehinarejos/Dev/notifyMyWorldCup
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   # o bien: npm install
   ```

3. **Iniciar el Servidor de Desarrollo**:
   ```bash
   pnpm dev
   # o bien: npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173/`.

4. **Compilar para Producción**:
   ```bash
   pnpm build
   # o bien: npm run build
   ```
