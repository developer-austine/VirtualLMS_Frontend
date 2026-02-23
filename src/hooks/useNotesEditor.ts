import { useState, useCallback, useRef } from "react";
import { notesStore } from "@/Features/Lecturer/data/Notesstore";

export const useNotesEditor = (materialId: string, initialTitle = "Untitled Note") => {
  const [title, setTitle]         = useState(() => notesStore.load(materialId)?.title ?? initialTitle);
  const [published, setPublished] = useState(() => notesStore.load(materialId)?.published ?? false);
  const [lastSaved, setLastSaved] = useState<string | null>(() => notesStore.load(materialId)?.savedAt ?? null);
  const [saving, setSaving]       = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Pre-fill editor with saved content on mount
  const initContent = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const saved = notesStore.load(materialId);
      if (saved?.content) node.innerHTML = saved.content;
      (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [materialId]);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value ?? undefined);
    editorRef.current?.focus();
  }, []);

  const countWords = useCallback(() => {
    const text = editorRef.current?.innerText ?? "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }, []);

  const save = useCallback(async (andPublish = false) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const now = new Date().toLocaleString("en-GB");
    const content = editorRef.current?.innerHTML ?? "";
    notesStore.save({
      materialId,
      title,
      content,
      savedAt: now,
      published: andPublish ? true : (notesStore.load(materialId)?.published ?? false),
    });
    setLastSaved(now);
    setSaving(false);
    if (andPublish) setPublished(true);
    return { title, content, savedAt: now };
  }, [materialId, title]);

  const publish = useCallback(async () => {
    return save(true);
  }, [save]);

  return {
    title, setTitle,
    published, lastSaved, saving, wordCount,
    editorRef, initContent, countWords,
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
      exec("insertHTML", `<a href="${url}" target="_blank" style="color:#1a2a5e;text-decoration:underline">${text || url}</a>`),
    save, publish,
  };
};