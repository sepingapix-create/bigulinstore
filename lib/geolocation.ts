export interface GeoLocation {
  city: string;
  region: string;
  country?: string;
}

const GEO_TIMEOUT_MS = 5000;

function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Fetches location for a single IP with fallback between 3 providers.
 */
export async function getIPLocation(ip: string): Promise<GeoLocation | null> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") return null;

  const fallbacks = [
    // 1. ip-api.com (HTTP)
    async () => {
      const res = await fetchWithTimeout(`http://ip-api.com/json/${ip}?fields=city,regionName,status`);
      const data = await res.json();
      if (data.status !== "success") throw new Error("ip-api failed");
      return { city: data.city, region: data.regionName };
    },
    // 2. ipwho.is
    async () => {
      const res = await fetchWithTimeout(`https://ipwho.is/${ip}`);
      const data = await res.json();
      if (!data.success) throw new Error("ipwho.is failed");
      return { city: data.city, region: data.region };
    },
    // 3. freeipapi.com
    async () => {
      const res = await fetchWithTimeout(`https://freeipapi.com/api/json/${ip}`);
      const data = await res.json();
      if (!data.cityName) throw new Error("freeipapi failed");
      return { city: data.cityName, region: data.regionName };
    }
  ];

  for (const fn of fallbacks) {
    try {
      const result = await fn();
      if (result.city) return result;
    } catch (err) {
      continue; // Try next fallback
    }
  }

  return null;
}

/**
 * Optimized batch location fetching for lists.
 * Tries ip-api.com batch first, then fallbacks individually for missing results.
 */
export async function getBatchLocations(ips: string[]): Promise<Record<string, GeoLocation>> {
  const results: Record<string, GeoLocation> = {};
  const uniqueIps = Array.from(new Set(ips)).filter(ip => ip && ip !== "unknown");

  if (uniqueIps.length === 0) return results;

  // Try ip-api.com BATCH first (most efficient) — HTTP (free tier doesn't support HTTPS)
  try {
    const response = await fetchWithTimeout("http://ip-api.com/batch", {
      method: "POST",
      body: JSON.stringify(uniqueIps.map(ip => ({ query: ip, fields: "city,regionName,status,query" }))),
      headers: { "Content-Type": "application/json" }
    });
    
    if (response.ok) {
      const data = await response.json();
      data.forEach((loc: any) => {
        if (loc.status === "success" && loc.query) {
          results[loc.query] = { city: loc.city, region: loc.regionName };
        }
      });
    }
  } catch (err) {
    console.error("Batch primary geo-fetch failed, falling back to individual lookups");
  }

  // For any IP that failed batch or wasn't included, try fallbacks
  const missingIps = uniqueIps.filter(ip => !results[ip]);
  
  if (missingIps.length > 0) {
    await Promise.all(
      missingIps.map(async (ip) => {
        const loc = await getIPLocation(ip);
        if (loc) results[ip] = loc;
      })
    );
  }

  return results;
}

