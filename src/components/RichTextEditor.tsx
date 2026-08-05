import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus } from "lucide-react";
import { useT } from "@/i18n/context";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Verilirse, görsel butonu dosya seçtirip bu fonksiyonla yükler ve dönen URL'yi ekler. */
  onUploadImage?: (file: File) => Promise<string>;
}

export function RichTextEditor({ value, onChange, placeholder, onUploadImage }: Props) {
  const { t } = useT();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? t.editor.placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[400px] focus:outline-none px-4 py-3 text-foreground/90 leading-relaxed",
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
      <Toolbar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onUploadImage }: { editor: Editor; onUploadImage?: (file: File) => Promise<string> }) {
  const { t } = useT();
  const e = t.editor;
  const fileRef = useRef<HTMLInputElement>(null);
  const btn = "p-2 rounded hover:bg-primary/10 hover:text-primary transition text-foreground/70";
  const active = "bg-primary/15 text-primary";

  const addLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt(e.urlPrompt, previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    if (onUploadImage) {
      fileRef.current?.click();
      return;
    }
    const url = window.prompt(e.imagePrompt);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const onFilePicked = async (file: File | undefined) => {
    if (!file || !onUploadImage) return;
    try {
      const url = await onUploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      /* hata bildirimi yükleyen tarafta */
    }
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-border/40 p-2 bg-background/60">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btn} ${editor.isActive("heading", { level: 1 }) ? active : ""}`} title={e.h1}><Heading1 className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`} title={e.h2}><Heading2 className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive("bold") ? active : ""}`} title={e.bold}><Bold className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive("italic") ? active : ""}`} title={e.italic}><Italic className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive("bulletList") ? active : ""}`} title={e.bulletList}><List className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} title={e.orderedList}><ListOrdered className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive("blockquote") ? active : ""}`} title={e.quote}><Quote className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn} title={e.hr}><Minus className="w-4 h-4" /></button>
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={addLink} className={`${btn} ${editor.isActive("link") ? active : ""}`} title={e.link}><LinkIcon className="w-4 h-4" /></button>
      <button type="button" onClick={addImage} className={btn} title={e.image}><ImageIcon className="w-4 h-4" /></button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(ev) => { void onFilePicked(ev.target.files?.[0]); ev.target.value = ""; }}
      />
      <span className="w-px bg-border/40 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn} title={e.undo}><Undo className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn} title={e.redo}><Redo className="w-4 h-4" /></button>
    </div>
  );
}
