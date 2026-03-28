import { withPaymentRequired } from "@axobot/pay/next";

export const runtime = "nodejs";

let handler: ((req: Request, ctx: unknown) => Response | Promise<Response>) | null = null;

export async function GET(req: Request, ctx: unknown) {
  if (!handler) {
    handler = withPaymentRequired(
      {
        amount: 100,
        currency: "SAT",
      },
      async () => {
        return Response.json({
          data: "Premium content unlocked. Thanks for the sats!",
          timestamp: new Date().toISOString(),
        });
      },
    );
  }

  return handler(req, ctx);
}
