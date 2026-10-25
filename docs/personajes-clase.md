# Adri, Juan y Cayetana

Ilustraciones creadas con el generador integrado de imágenes (modo built-in), usando las fotos aportadas y `public/assets/adri-clean.png` como referencia de estilo. Juan es el niño de la izquierda con camiseta celeste en el estadio, confirmado por el usuario. Cayetana es la niña de la izquierda en la playa. Las fotografías originales no se incluyen en los recursos públicos de la app.

Recursos finales con transparencia:

- `public/assets/characters/juan-comic-v1.png` (948 × 1659).
- `public/assets/characters/cayetana-comic-v2.png` (1024 × 1536), actualizada con la segunda foto; [prompt de la mejora](cayetana-v2.md). La versión v1 se conserva.
- Se conserva `public/assets/adri-clean.png` para Adri.

Los tres se muestran en Crear cuento, en el acceso Jugar con amigos y como acompañantes que alternan por reto en las misiones y talleres. Matemáticas utiliza sus avatares. Los retratos son decorativos junto a nombres visibles; las imágenes de acompañante tienen texto alternativo. No se modifican los audios ni el formato de progreso.

## Prompts finales

### Juan

Use case: identity-preserve / illustration-story. Create a single full-body comic character sprite for a Spanish first-grade educational app. Image 1 is the identity reference: JUAN IS ONLY THE BOY ON THE LEFT WEARING THE PALE BLUE SHIRT. Preserve that boy's recognizable facial proportions, gentle smile, brown hair and fringe, childlike face and apparent age about six. Do NOT use or include the boy on the right, stadium, crowd or other people. Image 2 is STYLE REFERENCE ONLY: the existing Adri app character. Match its polished hand-drawn adventure-comic illustration with confident dark ink outlines, soft painterly cel shading, warm natural face colors, expressive but recognizable eyes and realistic child proportions. Do not copy Adri's face or spiky hairstyle. Juan wears a plain pale-blue short-sleeve top recalling his reference shirt, subtle navy/white sleeve detail without brands, navy trousers, simple blue-and-white sneakers and a small school backpack. Friendly relaxed upright pose with one thumbs-up and the other arm relaxed. Only one boy, standing centered, entire head, hands and both shoes fully visible with safe margins. Age-appropriate fully clothed schoolchild. Genuinely transparent alpha background; no ground, backdrop, cast shadow outside the character, border, text, logos, watermark, labels or scenery. Make a clean production-ready cutout sprite that belongs alongside the supplied Adri comic.

### Cayetana

Use case: identity-preserve / illustration-story. Create a single full-body comic character sprite for a Spanish first-grade educational app. Image 1 is the identity reference: CAYETANA IS ONLY THE GIRL ON THE LEFT. Preserve her recognizable childlike face, gentle smile, light brown/dark blonde hair pulled back with a few loose strands, and facial proportions; keep her apparent age about six. Do NOT include the boy, beach, furniture or any other people. Image 2 is STYLE REFERENCE ONLY: the existing Adri app character. Match the polished hand-drawn adventure-comic aesthetic: confident dark ink outlines, warm natural skin tones, soft painterly cel shading, expressive recognizable eyes and realistic young-child proportions. Do not copy Adri's face or hairstyle. Cayetana wears a modest knee-length loose pastel dress with softly stylized lilac, mint and pink leaf motifs recalling her photo, simple pink flat closed-toe school shoes, and a small lilac school backpack. Friendly upright relaxed pose, one hand gently waving, the other resting naturally. Entire head, hair, hands, dress hem and both shoes fully visible, centered with safe margins. One fully clothed age-appropriate schoolgirl only. Genuinely transparent alpha background; no scenery, floor, ground shadow outside the character, border, text, logos, watermark or name label. A clean production-ready character cutout belonging beside the supplied Adri comic.

Edición final del fondo, con el mismo generador integrado:

Use case: background-extraction. Edit only the background of this supplied comic girl cutout. Remove ALL the brown, grey and black gradient glow, fuzzy halo, shadow and backdrop outside the girl, including the glow around her hair, arms, dress, legs and shoes. Make every background pixel outside the actual character silhouette fully transparent alpha, with clean natural antialiased edges. Keep the girl herself exactly the same: identical face, hairstyle, expression, waving hand, fingers, dress pattern, backpack, colors, pose, proportions, shoes, full body and ink outlines. Do not redraw her identity or change clothing. No glow, cast shadow, replacement backdrop, text or border. Deliver an isolated production sprite with genuine transparency like a clean sticker.

## Comprobación

- Compilación Vite y 67 pruebas existentes correctas.
- Cuentos de Juan y Cayetana completados en navegador.
- Rotación Adri → Juan → Cayetana comprobada en Juegos de Lengua.
- Menú, cuentos, Juegos de mates y misión de Lengua revisados a 320 × 568, 667 × 375 y 1280 × 720: imágenes cargadas y sin controles fuera de pantalla ni desplazamiento de página.
- Transparencia y recortes revisados visualmente; sin errores ni advertencias de consola en el recorrido probado.
