import mermaid from "mermaid";
import { useEffect, useRef } from "react";

export type MermaidDiagramProps = {
  code: string;
};

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && code) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });
      mermaid.run({
        nodes: [ref.current],
      });
    }
  }, [code]);

  if (!code) {
    return null;
  }

  return (
    <div ref={ref} className="mermaid">
      {code}
    </div>
  );
}
