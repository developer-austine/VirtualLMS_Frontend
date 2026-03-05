import { useState, useCallback, useRef } from "react";
import React from "react";

// ── No more notesStore / localStorage dependency ──────────────────────────────
// Content lives in the contentEditable div (editorRef).
// Saving is now just an in-memory draft save — actual persistence happens via
// Redux createNote thunk in NotesEditor.tsx when the user clicks "Publish".

export const useNotesEditor = (noteId: string, initialTitle = "Untitled Note") => {
  const [title,     setTitle]     = useState(initialTitle);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);

  const initContent = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [noteId]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value ?? undefined);
    editorRef.current?.focus();
  }, []);

  const countWords = useCallback(() => {
    const text = editorRef.current?.innerText ?? "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toLocaleString("en-GB");
    setLastSaved(now);
    setSaving(false);
  }, []);

  return {
  
    title,        setTitle,
    lastSaved,    saving,
    wordCount,

    editorRef,
    initContent,
    countWords,

    save,

    // Formatting commands
    bold:          () => exec("bold"),
    italic:        () => exec("italic"),
    underline:     () => exec("underline"),
    strikethrough: () => exec("strikeThrough"),
    alignLeft:     () => exec("justifyLeft"),
    alignCenter:   () => exec("justifyCenter"),
    alignRight:    () => exec("justifyRight"),
    alignJustify:  () => exec("justifyFull"),
    bulletList:    () => exec("insertUnorderedList"),
    numberedList:  () => exec("insertOrderedList"),
    indent:        () => exec("indent"),
    outdent:       () => exec("outdent"),
    undo:          () => exec("undo"),
    redo:          () => exec("redo"),
    heading1:      () => exec("formatBlock", "h1"),
    heading2:      () => exec("formatBlock", "h2"),
    heading3:      () => exec("formatBlock", "h3"),
    paragraph:     () => exec("formatBlock", "p"),
    insertHR:      () => exec("insertHorizontalRule"),
    removeFormat:  () => exec("removeFormat"),
    setFontSize:   (v: string) => exec("fontSize", v),
    setColor:      (v: string) => exec("foreColor", v),
    setHighlight:  (v: string) => exec("hiliteColor", v),
    insertLink:    (url: string, text: string) =>
      exec(
        "insertHTML",
        `<a href="${url}" target="_blank" style="color:#1a2a5e;text-decoration:underline">${text || url}</a>`
      ),
  };
};