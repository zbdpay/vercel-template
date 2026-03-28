import { agentFetch, zbdPayL402Invoice } from "@axobot/fetch";
import { VercelKVTokenCache } from "./kv-token-cache";
import { kv } from "@vercel/kv";

const tokenCache = new VercelKVTokenCache(kv);

export function zbdFetch(url: string, init?: RequestInit) {
  return agentFetch(url, {
    tokenCache,
    maxPaymentSats: 1000,
    pay: (challenge, context) =>
      zbdPayL402Invoice(challenge, context ?? { url: "" }, {
        apiKey: process.env.ZBD_API_KEY!,
      }),
    waitForPayment: async (paymentId) => {
      // Poll ZBD API for async settlement
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const res = await fetch(
          `https://api.zbdpay.com/v0/payments/${paymentId}`,
          { headers: { apikey: process.env.ZBD_API_KEY! } },
        );
        const body = await res.json();
        const status = body?.data?.status ?? body?.status;
        if (
          status === "completed" ||
          status === "paid" ||
          status === "settled"
        ) {
          return {
            status: "completed" as const,
            paymentId,
            preimage: body?.data?.preimage ?? body?.preimage,
            amountPaidSats: body?.data?.amount_sats ?? body?.amount_sats,
          };
        }
        if (
          status === "failed" ||
          status === "error" ||
          status === "cancelled"
        ) {
          return {
            status: "failed" as const,
            paymentId,
            failureReason: `payment_${status}`,
          };
        }
      }
      return { status: "pending" as const, paymentId };
    },
    ...(init && { requestInit: init }),
  });
}
