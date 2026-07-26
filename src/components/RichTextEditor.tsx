import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Yazınızı buraya girin..." }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[400px] focus:outline-none px-4 py-3 text-foreground/90 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return <div className="border border-border/40 rounded-md min-h-[440px] bg-background/40" />;

  return (
    <div className="border border-border/40 rounded-md overflow-hidden bg-background/40">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = "p-2 rounded hover:bg-primary/10 hover:text-primary transition text-foreground/70";
  const active = "bg-primary/15 text-primary";

  const addLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Görsel URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-border/40 p-2 bg-background/60">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btn} ${editor.isActive("heading", { level: 1 }) ? active : ""}`} title="Başlık 1"><Heading1 className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`} title="Başlık 2"><Heading2 className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive("bold") ? active : ""}`} title="Kalın"><Bold className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive("italic") ? active : ""}`} title="İtalik"><Italic className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive("bulletList") ? active : ""}`} title="Liste"><List className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} title="Sıralı Liste"><ListOrdered className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive("blockquote") ? active : ""}`} title="Alıntı"><Quote className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn} title="Ayraç"><Minus className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={addLink} className={`${btn} ${editor.isActive("link") ? active : ""}`} title="Bağlantı"><LinkIcon className="w-4 h-4" /></button>
      <button type="button" onClick={addImage} className={btn} title="Görsel"><ImageIcon className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn} title="Geri Al"><Undo className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn} title="İleri Al"><Redo className="w-4 h-4" /></button>
    </div>
  );
}
