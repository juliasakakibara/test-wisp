import { ThemeConfig } from "./redis";

export function generateThemeCssVariables(theme: ThemeConfig) {
  return `
    :root {
      --primary: ${theme.primary};
      --theme-bg: ${theme.background};
      --theme-fg: ${theme.foreground};
      --radius: ${theme.radius};
      
      --theme-font: var(--${theme.fontFamily});
      
      /* Derivados baseados nos tokens do tema */
      --muted-foreground: color-mix(in srgb, var(--foreground) 60%, var(--background));
      --muted: color-mix(in srgb, var(--foreground) 6%, var(--background));
      --border: color-mix(in srgb, var(--foreground) 15%, var(--background));
      
      --input: var(--border);
      --card: var(--background);
      --card-foreground: var(--foreground);
      --popover: var(--background);
      --popover-foreground: var(--foreground);
    }

    /* Se o tema for Custom, podemos forçar ou deixar fluir. 
       Para o Raster respeitar o sistema, vamos garantir que o light mode 
       tenha a palavra final se estivermos em um tema neutro. */
  `;
}
