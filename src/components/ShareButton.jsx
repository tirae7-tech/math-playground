import { useMemo, useState } from "react";
import { buildShareUrl } from "../lib/shareSettings.js";

export default function ShareButton({ settings }) {
  const [message, setMessage] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const shareUrl = useMemo(() => buildShareUrl(settings), [settings]);

  async function copyShareLink() {
    setMessage("");
    setShowFallback(false);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("현재 설정 링크를 복사했어요.");
    } catch {
      setShowFallback(true);
      setMessage("복사가 안 되면 아래 링크를 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <div className="share-wrap">
      <button className="share-button" type="button" onClick={copyShareLink}>
        현재 설정 링크 복사
      </button>
      {message && <p className="share-message">{message}</p>}
      {showFallback && (
        <input
          className="share-fallback-input"
          value={shareUrl}
          readOnly
          aria-label="직접 복사할 공유 링크"
          onFocus={(event) => event.target.select()}
        />
      )}
    </div>
  );
}
