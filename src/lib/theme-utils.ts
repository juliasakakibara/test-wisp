import { ThemeConfig } from "./redis";

export function generateThemeCssVariables(theme: ThemeConfig) {
  // Tenta extrair L C H da string "oklch(L C H)"
  const parseOklch = (val: string) => {
    const m = val.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!m) return null;
    return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
  };

  const bg = parseOklch(theme.background);
  const fg = parseOklch(theme.foreground);

  let mutedFg = theme.foreground;
  let muted = theme.background;
  let border = theme.foreground;

  if (bg && fg) {
    // --muted-foreground: mistura a luminosidade (60% fg, 40% bg) e mantém um pouco de cor do bg
    const mutedFgL = (fg.l * 0.6 + bg.l * 0.4).toFixed(3);
    mutedFg = `oklch(${mutedFgL} ${fg.c} ${fg.h})`;

    // --muted: O fundo misturado com apenas ~6% do texto
    const mutedL = (bg.l * 0.94 + fg.l * 0.06).toFixed(3);
    muted = `oklch(${mutedL} ${bg.c} ${bg.h})`;

    // --border: O fundo com ~15% do texto
    const borderL = (bg.l * 0.85 + fg.l * 0.15).toFixed(3);
    border = `oklch(${borderL} ${bg.c} ${bg.h})`;
  }

  return `
    :root {
      --primary: ${theme.primary};
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --radius: ${theme.radius};
      
      /* Derivados baseados no background e foreground */
      --muted-foreground: ${mutedFg};
      --muted: ${muted};
      --border: ${border};
      --input: ${border};
      --card: ${theme.background};
      --card-foreground: ${theme.foreground};
      --popover: ${theme.background};
      --popover-foreground: ${theme.foreground};
    }
  `;
}
