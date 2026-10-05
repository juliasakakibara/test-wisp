import { getTheme, getConfig } from "@/lib/site-data";
import ThemeEditor from "./ThemeEditor";

export default async function ThemePage() {
  const theme = await getTheme();
  const config = await getConfig();

  return <ThemeEditor initialTheme={theme} initialConfig={config} />;
}
