// Animates a small emoji flying from wherever the user clicked "Add to Cart"
// toward the cart icon in the navbar, then makes the cart icon bump.
// Gracefully does nothing if the cart icon isn't on screen (e.g. mobile drawer closed).
export function flyToCart(sourceEl, emoji = "🛒") {
  const cartEl = document.getElementById("navbar-cart-icon");
  if (!sourceEl || !cartEl) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const cartRect = cartEl.getBoundingClientRect();

  const flyer = document.createElement("div");
  flyer.textContent = emoji;
  flyer.style.position = "fixed";
  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 12}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 12}px`;
  flyer.style.fontSize = "22px";
  flyer.style.zIndex = "9999";
  flyer.style.pointerEvents = "none";
  flyer.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in";
  flyer.style.willChange = "transform, opacity";
  document.body.appendChild(flyer);

  // Force a reflow so the browser registers the starting position
  // before we change the transform — otherwise it just jumps, no animation.
  void flyer.offsetWidth;

  const dx = cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const dy = cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.35) rotate(20deg)`;
  flyer.style.opacity = "0.25";

  setTimeout(() => {
    flyer.remove();
    cartEl.classList.add("cart-bump");
    setTimeout(() => cartEl.classList.remove("cart-bump"), 350);
  }, 700);
}