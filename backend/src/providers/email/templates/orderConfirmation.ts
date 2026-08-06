import { emailShell, emailHeading, emailParagraph, emailSummaryBox, emailMuted } from "./layout";

export function orderConfirmationEmail(orderNumber: string, totalAmount: string, name: string): { subject: string; html: string } {
  const html = emailShell(`
    ${emailHeading(`Order confirmed, ${name || "there"}! 🎉`)}
    ${emailParagraph("Thanks for your order — here's a quick summary:")}
    ${emailSummaryBox([
      { label: "Order Number", value: orderNumber },
      { label: "Total Paid", value: `₹${totalAmount}`, emphasize: true },
    ])}
    ${emailParagraph("Your tax invoice is attached to this email. We'll notify you as your order is packed and shipped.")}
    ${emailMuted("You can track this order any time from your CareKart account.")}
  `);
  return { subject: `Your CareKart order ${orderNumber} is confirmed`, html };
}
