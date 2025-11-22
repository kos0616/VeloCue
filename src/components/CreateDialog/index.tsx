import { useRef } from "react";

export default function Index() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const HandleDialog = (status: "open" | "close") => {
    if (!dialogRef.current) return;
    switch (status) {
      case "open":
        dialogRef.current.showModal();
        break;

      case "close":
        dialogRef.current.close();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <dialog
        closedby="any"
        ref={dialogRef}
        className="m-auto rounded-xl backdrop:bg-gray-700/70 backdrop:backdrop-blur-xs"
      >
        <div className="flex justify-between border-b border-slate-300 bg-gray-200 px-4 py-2">
          <h4>編輯筆記</h4>
          <button autoFocus onClick={() => HandleDialog("close")} title="關閉">
            X
          </button>
        </div>
        <div className="px-4 py-4">
          <form method="dialog" className="grid gap-4">
            <div className="flex gap-4">
              <div className="flex items-end">
                <input
                  type="number"
                  placeholder="距離"
                  min="0"
                  step="0.1"
                  className="w-18 rounded border px-2 py-0.5 text-end"
                />
                <div className="px-1">km</div>
              </div>
              <div className="flex items-end">
                <input
                  type="number"
                  placeholder="坡度"
                  min="0"
                  className="w-18 rounded border px-2 py-0.5 text-end"
                />
                <div className="px-1">%</div>
              </div>
            </div>
            <div>
              <input
                placeholder="筆記內容"
                className="w-full rounded border px-2 py-1"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              送出
            </button>
          </form>
        </div>
      </dialog>
      <button onClick={() => HandleDialog("open")}>Show the dialog</button>
    </>
  );
}
