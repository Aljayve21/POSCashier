import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

type ReceiptItem = {
    name: string;
    qty: number;
    price: number;
};

type ReceiptPdfInput = {
    amount: number;
    paymentMethod: string;
    customerName?: string | string[];
    businessName: string;
    transactionId?: string;
    items: ReceiptItem[];
};

export async function exportReceiptPdf({
    amount,
    paymentMethod,
    customerName,
    businessName,
    transactionId,
    items,
}: ReceiptPdfInput) {
    const now = new Date().toLocaleString();

    const safeCustomerName = Array.isArray(customerName)
        ? customerName[0]
        : customerName;

    const itemsHtml =
        items.length > 0
            ? items
                .map(
                    (item) => `
              <div style="display:flex; justify-content:space-between; gap: 8px; font-size:12px; margin-top: 8px;">
                <span style="max-width: 170px;">${item.name} x${item.qty}</span>
                <span>₱${(item.price * item.qty).toLocaleString()}</span>
              </div>
            `
                )
                .join("")
            : `
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-top: 8px;">
            <span>POS Transaction</span>
            <span>₱${amount.toLocaleString()}</span>
          </div>
        `;

    const html = `
    <html>
      <body style="
        margin: 0;
        padding: 0;
        background: #f3f4f6;
        font-family: monospace;
      ">
        <div style="
          width: 280px;
          margin: 20px auto;
          background: white;
          padding: 18px;
          color: #111;
        ">
          <div style="text-align: center;">
            <h2 style="margin: 0; font-size: 18px;">${businessName}</h2>
            <p style="margin: 4px 0 0; font-size: 11px;">OFFICIAL RECEIPT</p>
          </div>

          <div style="border-top: 1px dashed #111; margin: 14px 0;"></div>

          <p style="font-size: 11px; margin: 4px 0;">Date: ${now}</p>
          <p style="font-size: 11px; margin: 4px 0;">Txn: ${transactionId ?? "N/A"}</p>
          <p style="font-size: 11px; margin: 4px 0;">Customer: ${safeCustomerName ?? "Walk-in"}</p>
          <p style="font-size: 11px; margin: 4px 0;">Payment: ${paymentMethod}</p>

          <div style="border-top: 1px dashed #111; margin: 14px 0;"></div>

          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <strong>Description</strong>
            <strong>Amount</strong>
          </div>

          ${itemsHtml}

          <div style="border-top: 1px dashed #111; margin: 14px 0;"></div>

          <div style="display:flex; justify-content:space-between; font-size:15px;">
            <strong>TOTAL</strong>
            <strong>₱${amount.toLocaleString()}</strong>
          </div>

          <div style="border-top: 1px dashed #111; margin: 14px 0;"></div>

          <p style="text-align: center; font-size: 11px; margin: 0;">
            Thank you for your purchase!
          </p>
          <p style="text-align: center; font-size: 10px; margin-top: 6px;">
            Powered by Smart POS
          </p>
        </div>
      </body>
    </html>
  `;

    const result = await Print.printToFileAsync({ html });

    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
        await Sharing.shareAsync(result.uri, {
            mimeType: "application/pdf",
            dialogTitle: "Export Receipt",
            UTI: "com.adobe.pdf",
        });
    }

    return result.uri;
}

export async function exportPdf({
    title,
    htmlBody,
}: {
    title: string;
    htmlBody: string;
}) {
    const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 24px; color: #111;">
        <h2>${title}</h2>
        <p style="color:#666;">Generated: ${new Date().toLocaleString()}</p>
        <hr />
        ${htmlBody}
      </body>
    </html>
  `;

    const result = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
            mimeType: "application/pdf",
            dialogTitle: title,
            UTI: "com.adobe.pdf",
        });
    }

    return result.uri;
}