"use client";

import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';
import {
  EditorProvider,
  EditorBubbleMenu,
  EditorFloatingMenu,
  EditorFormatBold,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatCode,
  EditorCharacterCount,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeBulletList,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorClearFormatting
} from "@/components/kibo-ui/editor";

const mdParser = new MarkdownIt();
const turndownService = new TurndownService({ headingStyle: "atx" });

interface TipTapEditorProps {
  initialContent: string;
  onChange: (markdown: string) => void;
}

export default function TipTapEditor({ initialContent, onChange }: TipTapEditorProps) {
  const htmlContent = mdParser.render(initialContent || "");

  function handleUpdate({ editor }: { editor: any }) {
    const html = editor.getHTML();
    const markdown = turndownService.turndown(html);
    onChange(markdown);
  }

  return (
    <div className="w-full editor-wrapper">
      <EditorProvider
        content={htmlContent}
        onUpdate={handleUpdate}
        className="prose prose-sm prose-primary sm:prose-base focus:outline-none min-h-[400px] pb-24 text-[#111]"
        placeholder="Escreva sua história a partir daqui..."
      >
        {/* Menu Flutuante que aparece com texto selecionado */}
        <EditorBubbleMenu>
          <EditorFormatBold />
          <EditorFormatItalic />
          <EditorFormatStrike />
          <EditorFormatCode />
          <EditorClearFormatting />
        </EditorBubbleMenu>

        {/* Menu Flutuante lado-esquerdo para linhas em branco */}
        <EditorFloatingMenu>
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeQuote />
        </EditorFloatingMenu>

        {/* Contador de caracteres no canto inferior direito da tela inteira */}
        <EditorCharacterCount.Words className="fixed bottom-6 right-56 border-none shadow-none text-xs text-gray-400 bg-transparent font-mono">
           <span>Palavras: </span>
        </EditorCharacterCount.Words>
      </EditorProvider>
    </div>
  );
}
