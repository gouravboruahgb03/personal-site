"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { Editor, Range } from "@tiptap/core";

export type CommandItem = {
  title: string;
  command: (props: { editor: Editor; range: Range }) => void;
};

type Props = {
  items: CommandItem[];
  command: (item: CommandItem) => void;
};

const CommandList = forwardRef(function CommandList(props: Props, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (i) => (i + props.items.length - 1) % props.items.length,
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) return null;

  return (
    <div className="slash-menu">
      {props.items.map((item, index) => (
        <button
          key={item.title}
          type="button"
          className={`slash-item ${index === selectedIndex ? "is-selected" : ""}`}
          onClick={() => selectItem(index)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
});

export default CommandList;
