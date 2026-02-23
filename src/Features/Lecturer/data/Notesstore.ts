export interface SavedNote {
  materialId: string;
  title: string;
  content: string; // HTML string from contentEditable
  savedAt: string;
  published: boolean;
}

const key = (materialId: string) => `kcau_note_${materialId}`;

export const notesStore = {
  save: (note: SavedNote): void => {
    localStorage.setItem(key(note.materialId), JSON.stringify(note));
  },

  load: (materialId: string): SavedNote | null => {
    const raw = localStorage.getItem(key(materialId));
    return raw ? (JSON.parse(raw) as SavedNote) : null;
  },

  publish: (materialId: string): void => {
    const note = notesStore.load(materialId);
    if (note) notesStore.save({ ...note, published: true });
  },

  isPublished: (materialId: string): boolean => {
    return notesStore.load(materialId)?.published ?? false;
  },

  clear: (materialId: string): void => {
    localStorage.removeItem(key(materialId));
  },
};