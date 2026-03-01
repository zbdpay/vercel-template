export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.ZBD_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ZBD_API_KEY not configured" },
      { status: 500 },
    );
  }

  const res = await fetch("https://api.zbdpay.com/v0/wallet", {
    headers: { apikey: apiKey },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch balance" },
      { status: res.status },
    );
  }

  const { data } = await res.json();
  return Response.json({
    balance: data.balance,
    balanceSats: Math.floor(data.balance / 1000),
  });
}
