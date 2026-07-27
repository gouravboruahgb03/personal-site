import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance } from "tippy.js";
import type { Editor, Range } from "@tiptap/core";
import CommandList, { type CommandItem } from "./CommandList";

// The commands you can insert with "/"
function getItems(query: string): CommandItem[] {
  const all: CommandItem[] = [
    {
      title: "Heading 2",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run(),
    },
    {
      title: "Image",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const url = window.prompt("Image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
    },
    {
      title: "Quote",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      title: "Code block",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Bullet list",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: "Numbered list",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: "Divider",
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
  ];
  return all.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuggestionProps = any;

export const slashSuggestion = {
  items: ({ query }: { query: string }) => getItems(query),

  command: ({
    editor,
    range,
    props,
  }: {
    editor: Editor;
    range: Range;
    props: CommandItem;
  }) => {
    props.command({ editor, range });
  },

  render: () => {
    let component: ReactRenderer;
    let popup: Instance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });
        if (!props.clientRect) return;
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },
      onUpdate(props: SuggestionProps) {
        component.updateProps(props);
        if (!props.clientRect) return;
        popup[0].setProps({ getReferenceClientRect: props.clientRect });
      },
      onKeyDown(props: SuggestionProps) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (component.ref as any)?.onKeyDown(props);
      },
      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
