export function buildWhatsAppUrl(
  destinations: string[],
  travelers?: number,
  dateFrom?: string,
  dateTo?: string,
  packageName?: string
): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  let message = "Hi! I'm interested in planning a tour.\n\n";

  if (packageName) {
    message += `Package: ${packageName}\n\n`;
  }

  if (destinations.length > 0) {
    message += "Destinations I'd like to visit:\n";
    destinations.forEach((d) => {
      message += `  • ${d}\n`;
    });
    message += "\n";
  }

  if (travelers) {
    message += `Number of travelers: ${travelers}\n`;
  }

  if (dateFrom) {
    message += `From: ${dateFrom}\n`;
  }
  if (dateTo) {
    message += `To: ${dateTo}\n`;
  }

  message += "\nPlease send me a quote. Thank you!";

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildSimpleWhatsAppUrl(text: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
