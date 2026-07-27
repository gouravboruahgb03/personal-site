"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import type { JSONContent } from "@tiptap/core";
import SlashCommand from "./slash/SlashCommand";
import { uploadImage } from "@/lib/uploadImage";

// Count words in a chunk of plain text (ignores extra spaces/blank lines).
function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function WritingEditor({
  initialContent,
  onChange,
  onWordCount,
}: {
  initialContent?: JSONContent | null;
  onChange?: (json: JSONContent) => void;
  onWordCount?: (words: number) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false, // avoid SSR hydration mismatch in Next.js
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Tell your story..." }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noreferrer nofollow", target: "_blank" },
      }),
      Image,
      SlashCommand,
    ],
    content: initialContent ?? "",
    onCreate: ({ editor }) => onWordCount?.(countWords(editor.getText())),
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
      onWordCount?.(countWords(editor.getText()));
    },
    editorProps: {
      attributes: { class: "prose-post prose-editor focus:outline-none" },

      // Drag an image file into the editor -> upload -> insert at drop point
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const file = event.dataTransfer?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        const pos = coords?.pos ?? view.state.selection.from;
        void uploadImage(file)
          .then((url) => {
            const node = view.state.schema.nodes.image.create({ src: url });
            view.dispatch(view.state.tr.insert(pos, node));
          })
          .catch((err) => window.alert("Image upload failed: " + err.message));
        return true;
      },

      // Paste an image (e.g. a screenshot) -> upload -> insert
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            event.preventDefault();
            const pos = view.state.selection.from;
            void uploadImage(file)
              .then((url) => {
                const node = view.state.schema.nodes.image.create({ src: url });
                view.dispatch(view.state.tr.insert(pos, node));
              })
              .catch((err) => window.alert("Image upload failed: " + err.message));
            return true;
          }
        }
        return false;
      },
    },
  });

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "");
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bubble-menu"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <em>i</em>
          </button>
          <button
            type="button"
            onClick={setLink}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            Link
          </button>
          <span className="bubble-sep" />
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
          >
            H3
          </button>
          <span className="bubble-sep" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
            aria-label="Bullet list"
          >
            &bull;
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            &ldquo;
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            aria-label="Divider"
          >
            &mdash;
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  );
}
