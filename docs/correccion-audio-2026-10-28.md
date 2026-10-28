# Silencio general y barra simplificada · 28/10/2026

El botón anterior solo cambiaba `sound` (efectos); `voice` seguía activo. Por eso podía verse el icono de silencio y seguir escuchándose a Adri.

Ahora hay un ajuste `muted` independiente de las preferencias de voz y efectos. Al silenciar se detienen la locución actual, los efectos activos y los arranques de voz pendientes; las nuevas reproducciones quedan bloqueadas. Al reactivar se mantienen los ajustes anteriores. Si ambos estaban apagados, pulsar Activar audio los habilita explícitamente. El estado se conserva al recargar y viaja en la copia de progreso. Las copias antiguas siguen siendo compatibles.

Los reproductores de grabaciones propias respetan también el silencio. Familia → Sonido incluye Silenciar todo; Probar voz se desactiva mientras está silenciado. Se conservan la voz aprobada y todos los audios originales.

Se retiran de la barra los contadores de estrellas y piezas. No se borran premios ni progreso; la pantalla Mis logros continúa disponible. La barra solo conserva Inicio y el control de audio, cuyo icono, texto accesible y estado pulsado reflejan el silencio.

Validación: 106 pruebas automatizadas superadas y compilación de producción correcta. Pruebas de voz detenida, efectos detenidos, reproducción bloqueada al estar silenciado, cancelación de arranques pendientes y conservación de preferencias/premios en copias. Comprobación de interfaz: activar, silenciar, recargar, reactivar y cambiar ajustes independientes; controles accesibles en móvil 320×568 y horizontal 667×375.
