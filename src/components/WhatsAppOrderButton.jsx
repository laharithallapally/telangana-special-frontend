import { useState, useRef } from "react";

/**
 * WhatsAppOrderButton (with confetti + bounce micro-interaction)
 *
 * Requires: npm install canvas-confetti
 *
 * USAGE:
 * <WhatsAppOrderButton
 *   productName="Ghee Bobbatlu"
 *   phoneNumber="919876543210"
 *   price="₹150"
 * />
 */

export default function WhatsAppOrderButton({ productName, phoneNumber, price }) {
  const [qty, setQty] = useState(1);
  const [isBouncing, setIsBouncing] = useState(false);
  const btnRef = useRef(null);

  async function fireConfetti() {
    // Lazy-load so it doesn't bloat initial bundle
    const confetti = (await import("canvas-confetti")).default;

    const rect = btnRef.current.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 55,
      startVelocity: 35,
      origin: { x: originX, y: originY },
      colors: ["#E3A008", "#F0C45A", "#4A161A", "#F5EBD6"],
      scalar: 0.9,
      ticks: 120,
    });
  }

  function handleClick() {
    setIsBouncing(true);
    fireConfetti();
    setTimeout(() => setIsBouncing(false), 500);

    const message = `Hi! I'd like to order:\n${qty} x ${productName}${
      price ? ` (${price} each)` : ""
    }\n\nPlease confirm availability and total.`;
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Small delay so the confetti/bounce is visible before the tab switch
    setTimeout(() => window.open(waLink, "_blank", "noopener,noreferrer"), 250);
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <style>{`
        @keyframes wa-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.92); }
          55%  { transform: scale(1.08); }
          80%  { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .wa-bounce {
          animation: wa-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Quantity stepper */}
      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-600 active:bg-gray-100"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-medium select-none">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="w-8 h-8 flex items-center justify-center text-gray-600 active:bg-gray-100"
        >
          +
        </button>
      </div>

      {/* Order button */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        className={`flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-semibold py-2 px-4 rounded-full transition-colors ${
          isBouncing ? "wa-bounce" : ""
        }`}
      >
        <WhatsAppIcon />
        Order on WhatsApp
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.486 2 2.01 6.477 2.01 12c0 1.936.542 3.828 1.567 5.462L2 22l4.65-1.542A9.955 9.955 0 0 0 12.004 22C17.522 22 22 17.523 22 12S17.522 2 12.004 2zm0 18.062a8.03 8.03 0 0 1-4.108-1.124l-.294-.175-3.29 1.09.998-3.386-.19-.31A8.007 8.007 0 0 1 3.94 12c0-4.446 3.618-8.062 8.064-8.062S20.07 7.554 20.07 12s-3.618 8.062-8.066 8.062z" />
    </svg>
  );
}