import { useRouteStore } from "@/store/routeStore";
import { useEffect, useRef, useState } from "react";

interface EditDialogProps {
  noteId: string;
  onClose: () => void;
}

export default function EditDialog({ noteId, onClose }: EditDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const userNotes = useRouteStore((state) => state.userNotes);
  const updateUserNote = useRouteStore((state) => state.updateUserNote);
  const removeUserNote = useRouteStore((state) => state.removeUserNote);

  const note = userNotes.find((n) => n.id === noteId);

  const [distance, setDistance] = useState<number>(
    note ? parseFloat((note.distance / 1000).toFixed(1)) : 0,
  );
  const [text, setText] = useState<string>(note ? note.text : "");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteId) return;

    const note = userNotes.find((n) => n.id === noteId);
    if (note) {
      updateUserNote({
        ...note,
        distance: distance * 1000, // Convert back to meters
        text: text,
      });
      handleClose();
    }
  };

  const handleDelete = () => {
    if (!noteId) return;
    if (confirm("確定要刪除這則筆記嗎？")) {
      removeUserNote(noteId);
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto rounded-xl backdrop:bg-gray-700/70 backdrop:backdrop-blur-xs"
      onClose={onClose}
      closedby="any"
    >
      <div className="flex justify-between border-b border-slate-300 bg-gray-200 px-4 py-2">
        <h4>編輯筆記</h4>
        <button autoFocus onClick={handleClose} title="關閉">
          X
        </button>
      </div>
      <div className="px-4 py-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex gap-4">
            <div className="flex items-end">
              <input
                type="number"
                placeholder="距離"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                className="w-24 rounded border px-2 py-0.5 text-end"
              />
              <div className="px-1">km</div>
            </div>
          </div>
          <div>
            <input
              placeholder="筆記內容"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded border px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            送出
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer rounded border-red-600 bg-red-200 px-4 py-2 text-red-900 hover:bg-red-300 hover:text-white"
          >
            刪除
          </button>
        </form>
      </div>
    </dialog>
  );
}
