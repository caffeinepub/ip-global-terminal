# Specification

## Summary
**Goal:** Fix the animated world map continent colors and sharpen the hero background.

**Planned changes:**
- Change continent fill/outline color in `AnimatedWorldMap.tsx` from blue to near-black (e.g., `#0a0a0a` or `#111111`) to match the Black, Gold & White theme
- Reduce pixelation and blurriness on the hero background in `Home.tsx` by improving canvas/image rendering quality and setting appropriate `image-rendering` CSS properties

**User-visible outcome:** Continents on the animated world map appear dark/black instead of blue, and the hero section background looks sharp and crisp without noticeable blur or pixelation.
