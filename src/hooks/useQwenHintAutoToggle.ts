import { useEffect, useRef } from "react";
import type { AiSource } from "@/store/ai-store";
import { SHOULD_SHOW_QWEN_HINT_DEFAULT } from "@/store/settings-store";
import { QWEN_BASE_URL } from "@/lib/qwen";

export function useQwenHintAutoToggle(
  sources: AiSource[],
  showQwenHint: boolean,
  setShowQwenHint: (show: boolean) => void,
) {
  const managedRef = useRef(false);

  useEffect(() => {
    const hasQwenSource = sources.some(
      (source) =>
        typeof source.baseUrl === "string" &&
        source.baseUrl.startsWith(QWEN_BASE_URL),
    );

    if (hasQwenSource) {
      managedRef.current = true;
      if (showQwenHint) {
        setShowQwenHint(false);
      }
      return;
    }

    if (managedRef.current) {
      setShowQwenHint(SHOULD_SHOW_QWEN_HINT_DEFAULT);
      managedRef.current = false;
    }
  }, [sources, setShowQwenHint, showQwenHint]);
}
