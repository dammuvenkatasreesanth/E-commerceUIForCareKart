export function orderConfirmationEmail(orderNumber: string, totalAmount: string, name: string): { subject: string; html: string } {
  return {
    subject: `Your CareKart order ${orderNumber} is confirmed`,
    html: `<p>Hi ${name || "there"},</p>
<p>Thanks for your order! Your order <strong>${orderNumber}</strong> has been confirmed for a total of <strong>₹${totalAmount}</strong>.</p>
<p>Your tax invoice is attached to this email.</p>
<p>We'll notify you as your order is packed and shipped.</p>`,
  };
}
