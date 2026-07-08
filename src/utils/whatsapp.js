// Central place to configure the business WhatsApp number.
// Use the FULL international number, digits only, no +, no spaces, no leading 0.
// Example: for +91 98765 43210, this should be "919876543210".
export const WHATSAPP_NUMBER = "919876543210"; // TODO: replace with your real WhatsApp Business number

/**
 * Builds a wa.me link that opens WhatsApp (app on mobile, web on desktop)
 * with a pre-filled message, so the customer just has to hit send.
 */
export function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/** Opens a WhatsApp chat with a pre-filled message for a single product. */
export function whatsAppOrderMessage(product, quantity = 1) {
  return (
    `Hi Telangana Special! 👋\n` +
    `I'd like to order:\n` +
    `• ${quantity}x ${product.name} - ₹${product.price * quantity}\n\n` +
    `Please confirm availability and delivery details. Thank you!`
  );
}

/** Opens a WhatsApp chat with a pre-filled message for a full cart. */
export function whatsAppCartMessage(cart) {
  const lines = cart.items
    .map(item => `• ${item.quantity}x ${item.productName} - ₹${item.totalPrice}`)
    .join("\n");

  return (
    `Hi Telangana Special! 👋\n` +
    `I'd like to place an order:\n\n` +
    `${lines}\n\n` +
    `Total: ₹${cart.grandTotal}\n\n` +
    `Please confirm availability and delivery details. Thank you!`
  );
}