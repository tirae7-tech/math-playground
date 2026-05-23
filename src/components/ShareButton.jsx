import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { buildShareUrl } from "../lib/shareSettings.js";

export default function ShareButton({ settings }) {
  const [message, setMessage] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [qrError, setQrError] = useState("");
  const shareUrl = useMemo(() => buildShareUrl(settings), [settings]);

  useEffect(() => {
    let isMounted = true;

    if (!showQr) {
      return undefined;
    }

    setQrError("");

    QRCode.toDataURL(shareUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: "#17324b",
        light: "#ffffff",
      },
    })
      .then((nextQrImage) => {
        if (isMounted) {
          setQrImage(nextQrImage);
        }
      })
      .catch(() => {
        if (isMounted) {
          setQrError("QR코드를 만드는 중 문제가 생겼어요. 링크 복사를 사용해 주세요.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [shareUrl, showQr]);

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
      <div className="share-button-grid">
        <button className="share-button" type="button" onClick={copyShareLink}>
          현재 설정 링크 복사
        </button>
        <button className="share-button" type="button" onClick={() => setShowQr(!showQr)}>
          {showQr ? "QR코드 숨기기" : "QR코드 보기"}
        </button>
      </div>
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
      {showQr && (
        <div className="qr-panel" aria-live="polite">
          <p className="qr-title">학생에게 보여줄 QR코드</p>
          {qrImage && !qrError && (
            <img className="qr-image" src={qrImage} alt="현재 설정으로 열리는 QR코드" />
          )}
          {qrError && <p className="qr-error">{qrError}</p>}
          <p className="qr-helper">
            이 QR은 지금 고른 학년, 수준, 연습으로 바로 열려요. 배포 주소에서 열면 학생들도 접속할 수 있어요.
          </p>
          <input
            className="share-fallback-input"
            value={shareUrl}
            readOnly
            aria-label="QR코드에 들어간 공유 링크"
            onFocus={(event) => event.target.select()}
          />
        </div>
      )}
    </div>
  );
}
