import { getConfig } from "@/lib/actions";
import ContentEditor from "./ContentEditor";

export default async function AdminContentPage() {
  const initial = await getConfig();
  
  return <ContentEditor initial={initial} />;
}
