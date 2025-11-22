import { useRouteStore } from "@/store/routeStore";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

interface CreateDialogProps {
  distance: number;
  onClose: () => void;
}

export default function CreateDialog({ distance, onClose }: CreateDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addUserNote = useRouteStore((state) => state.addUserNote);
  const [text, setText] = useState("");
  const [displayDist, setDisplayDist] = useState<number>(
    parseFloat((distance / 1000).toFixed(1)),
  );

  useEffect(() => {
    dialogRef.current?.showModal();
    // Focus the input after the dialog opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addUserNote({
      id: nanoid(),
      distance: displayDist * 1000, // Use the edited distance
      text: text,
      type: "other",
    });
    handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto rounded-xl backdrop:bg-gray-700/70 backdrop:backdrop-blur-xs"
      onClose={onClose}
      closedby="any"
    >
      <div className="flex justify-between border-b border-slate-300 bg-gray-200 px-4 py-2">
        <h4>新增筆記</h4>
        <button onClick={handleClose} title="關閉">
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
                value={displayDist}
                onChange={(e) => setDisplayDist(parseFloat(e.target.value))}
                className="w-24 rounded border px-2 py-0.5 text-end"
              />
              <div className="px-1">km</div>
            </div>
          </div>
          <div>
            <input
              ref={inputRef}
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
            新增
          </button>
        </form>
      </div>
    </dialog>
  );
}
