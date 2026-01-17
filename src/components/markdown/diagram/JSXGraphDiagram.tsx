import { useEffect, useRef, useState, useId } from "react";
import JXG from "jsxgraph";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type JSXGraphDiagramProps = {
  jesseScript: string;
};

export default function JSXGraphDiagram({ jesseScript }: JSXGraphDiagramProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<JXG.Board | null>(null);

  const [error, setError] = useState<string | null>(null);

  const uniqueId = useId();
  // Sanitize ID for JSXGraph compatibility (remove colons)
  const boardId = `jxgbox-${uniqueId.replace(/:/g, "")}`;

  useEffect(() => {
    // 1. Initial cleanup logic
    const destroyBoard = (): void => {
      if (boardInstance.current) {
        JXG.JSXGraph.freeBoard(boardInstance.current);
        boardInstance.current = null;
      }
    };

    destroyBoard();

    // 2. Logic to update error state safely
    const reportError = (message: string | null): void => {
      setTimeout(() => {
        setError(message);
      }, 0);
    };

    reportError(null);

    let handleKeyDown: (e: KeyboardEvent) => void;

    if (boardRef.current) {
      try {
        const board = JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [-1, 10, 11, -10],
          axis: true,
          showCopyright: false,
          keepaspectratio: false,
          pan: {
            enabled: true,
            needShift: false,
          },
          zoom: {
            factorX: 1.25,
            factorY: 1.25,
            wheel: true,
          },
        });

        boardInstance.current = board;

        handleKeyDown = (e: KeyboardEvent) => {
          const currentBoard = boardInstance.current;
          if (!currentBoard) return;

          const bbox = currentBoard.getBoundingBox();
          const dx = (bbox[2] - bbox[0]) * 0.05;
          const dy = (bbox[1] - bbox[3]) * 0.05;

          let newBbox: [number, number, number, number] | null = null;

          switch (e.key) {
            case "ArrowUp":
            case "k":
              newBbox = [bbox[0], bbox[1] + dy, bbox[2], bbox[3] + dy];
              break;
            case "ArrowDown":
            case "j":
              newBbox = [bbox[0], bbox[1] - dy, bbox[2], bbox[3] - dy];
              break;
            case "ArrowLeft":
            case "h":
              newBbox = [bbox[0] - dx, bbox[1], bbox[2] - dx, bbox[3]];
              break;
            case "ArrowRight":
            case "l":
              newBbox = [bbox[0] + dx, bbox[1], bbox[2] + dx, bbox[3]];
              break;
            default:
              return;
          }

          e.preventDefault();
          if (newBbox) {
            currentBoard.setBoundingBox(newBbox, false);
          }
        };

        const currentBoardRef = boardRef.current;
        currentBoardRef.setAttribute("tabindex", "0");
        currentBoardRef.addEventListener("keydown", handleKeyDown);

        try {
          board.jc.parse(jesseScript);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          reportError(`JesseCode Error: ${msg}`);
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Failed to initialize board";
        reportError(`Initialization Error: ${msg}`);
      }
    }

    return () => {
      if (boardRef.current && handleKeyDown) {
        boardRef.current.removeEventListener("keydown", handleKeyDown);
        boardRef.current = null;
      }
      destroyBoard();
    };
  }, [jesseScript, boardId]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to parse JesseCode: Syntax Error</AlertTitle>
          <AlertDescription className="font-mono text-xs text-wrap">
            {error}
          </AlertDescription>
        </Alert>
      ) : (
        <div
          id={boardId}
          ref={boardRef}
          className="w-full aspect-3/2 rounded-lg bg-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      )}
    </div>
  );
}
