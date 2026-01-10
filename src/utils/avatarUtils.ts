/**
 * Genera un avatar SVG con iniciales y color de fondo
 * @param name - Nombre completo del usuario
 * @param color - Color de fondo en formato hex
 * @returns Data URL del SVG en base64
 */
export function generateAvatarDataUrl(name: string, color: string): string {
    // Extraer iniciales (máximo 2 caracteres)
    const initials = name
        .split(' ')
        .map(n => n.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);

    // Crear SVG
    const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="80"
        font-weight="bold"
        fill="white"
      >${initials}</text>
    </svg>
  `.trim();

    // Convertir a base64
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Verifica si un avatar es una URL generada (SVG) o una imagen real
 * @param avatar - URL del avatar
 * @returns true si es un avatar generado, false si es una imagen real
 */
export function isGeneratedAvatar(avatar: string): boolean {
    return avatar.startsWith('data:image/svg+xml');
}
