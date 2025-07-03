const frenchToEnglishColors: Record<string, string> = {
    noir: 'black',
    blanc: 'white',
    rouge: 'red',
    bleu: 'blue',
    vert: 'green',
    jaune: 'yellow',
    gris: 'gray',
    violet: 'purple',
    rose: 'pink',
    orange: 'orange',
    marron: 'brown',
    turquoise: 'turquoise',
  };
  
  export function parseColor(input?: string): string | undefined {
    if (!input) return undefined;
    let color = input.trim().toLowerCase();
  
    if (frenchToEnglishColors[color]) return frenchToEnglishColors[color];
  
    if (
      [
        'black', 'white', 'red', 'blue', 'green', 'yellow', 'gray', 'purple', 'pink', 'orange', 'brown', 'turquoise'
      ].includes(color)
    ) return color;
  
    if (/^[0-9a-f]{6}$/i.test(color)) return `#${color}`;
    if (/^[0-9a-f]{3}$/i.test(color)) return `#${color}`;
  
    if (/^#[0-9a-f]{6}$/i.test(color) || /^#[0-9a-f]{3}$/i.test(color)) return color;
  
    if (color.startsWith('rgb')) return color;
  
    return undefined;
  }