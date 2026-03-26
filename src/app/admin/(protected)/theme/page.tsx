import { getTheme } from "@/lib/actions";
import ThemeEditor from "./ThemeEditor";

export default async function ThemePage() {
  const theme = await getTheme();

  return <ThemeEditor initial={theme} />;
}
