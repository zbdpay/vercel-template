import type { TokenCache, TokenRecord } from "@zbdpay/agent-fetch";
import type { VercelKV } from "@vercel/kv";

export class VercelKVTokenCache implements TokenCache {
  constructor(private kv: VercelKV) {}

  async get(url: string): Promise<TokenRecord | null> {
    return this.kv.get<TokenRecord>(`zbd:token:${url}`);
  }

  async set(url: string, record: TokenRecord): Promise<void> {
    // expiresAt is a Unix timestamp in SECONDS (not milliseconds).
    // See FileTokenCache.isExpired: expiresAt <= Math.floor(Date.now() / 1000)
    const ttl = record.expiresAt
      ? Math.max(record.expiresAt - Math.floor(Date.now() / 1000), 1)
      : 86400;
    await this.kv.set(`zbd:token:${url}`, record, { ex: ttl });
  }

  async delete(url: string): Promise<void> {
    await this.kv.del(`zbd:token:${url}`);
  }
}
