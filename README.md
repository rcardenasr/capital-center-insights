# Capital Center Intelligence

Piloto funcional de una web app para inteligencia comercial e inmobiliaria. Permite cargar una base de clientes, filtrar registros, ver detalles, asociar noticias/alertas demo por relevancia y simular notificaciones internas o del navegador.

## Stack usado

- HTML, CSS y JavaScript vanilla para un MVP liviano y portable.
- SheetJS para leer archivos Excel `.xlsx`.
- `localStorage` como base de datos local del piloto.
- Web Notifications API para notificaciones del navegador.

## Como ejecutarlo

Opcion rapida:

1. Abre `index.html` directamente en el navegador.
2. Inicia sesion con las credenciales demo precargadas.

Opcion con servidor local:

```powershell
cd "C:\Users\rcard\Documents\New project\capital-center-insights"
py -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Estructura del proyecto

```text
capital-center-insights/
  index.html
  styles.css
  app.js
  demo-clientes.csv
```

## Funcionalidades incluidas

- Login demo simple.
- Dashboard con KPIs de clientes, alertas, noticias del dia y oportunidades.
- Tabla de clientes con busqueda global y filtros por ubicacion, rubro, activo y estado.
- Detalle individual de cliente con informacion general, palabras clave, noticias relacionadas y timeline.
- Centro de alertas con prioridad alta, media y baja.
- Importacion de `.csv` y `.xlsx` con vista previa y mapeo de columnas.
- Nuevo cliente manual.
- Configuracion basica de marca, fuentes demo y notificaciones.
- Mapa referencial simple con puntos de clientes.
- Datos demo realistas para mercado peruano.

## Como importar Excel o CSV

1. Entra al modulo Clientes o Dashboard.
2. Haz clic en `Importar archivo`.
3. Selecciona un `.xlsx` o `.csv`.
4. Revisa la preview.
5. Ajusta el mapeo de columnas si el sistema no lo detecta automaticamente.
6. Haz clic en `Importar registros`.

El archivo debe contener, idealmente, estas columnas:

- `nombre_cliente`
- `empresa`
- `rubro`
- `tipo_activo`
- `ubicacion`
- `distrito`
- `provincia`
- `departamento`
- `area`
- `palabras_clave`
- `estado`
- `observaciones`

## Regla de relevancia del piloto

La app relaciona noticias/alertas demo con cada cliente mediante coincidencias de:

- ubicacion,
- distrito/provincia/departamento,
- rubro,
- palabras clave.

Cada coincidencia suma a un score simple. El score se transforma en prioridad alta, media o baja para el Centro de alertas.

## Proximos pasos sugeridos

- Conectar fuentes RSS reales y normalizar titulares.
- Agregar backend con base de datos persistente multiusuario.
- Incorporar autenticacion real.
- Guardar historiales por cliente y cambios de estado.
- Integrar mapa con coordenadas reales.
- Agregar exportacion de alertas y reportes ejecutivos.
