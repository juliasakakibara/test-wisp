import { ThemeConfig } from "./redis";

export function generateThemeCssVariables(theme: ThemeConfig) {
  return `
    :root {
      --primary: ${theme.primary};
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --radius: ${theme.radius};
      
      /* Derivados baseados no background e foreground */
      /* --muted-foreground: mistura a luminosidade (60% fg, 40% bg) */
      --muted-foreground: color-mix(in srgb, var(--foreground) 60%, var(--background));
      
      /* --muted: O fundo misturado com apenas ~6% do texto */
      --muted: color-mix(in srgb, var(--foreground) 6%, var(--background));
      
      /* --border: O fundo com ~15% do texto */
      --border: color-mix(in srgb, var(--foreground) 15%, var(--background));
      
      --input: var(--border);
      --card: var(--background);
      --card-foreground: var(--foreground);
      --popover: var(--background);
      --popover-foreground: var(--foreground);
    }
  `;
}
