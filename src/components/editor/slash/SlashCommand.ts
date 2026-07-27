import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { slashSuggestion } from "./suggestion";

// Adds a "/" command menu to the editor.
const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        ...slashSuggestion,
      }),
    ];
  },
});

export default SlashCommand;
