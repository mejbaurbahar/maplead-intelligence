import { NextRequest, NextResponse } from "next/server";

const SCRAPER_BASE_URL = process.env.SCRAPER_BASE_URL || "http://127.0.0.1:8080";

const CITY_COORDS: Record<string, { lat: string; lon: string }> = {
  dhaka: { lat: "23.8103", lon: "90.4125" },
  dhanmondi: { lat: "23.7461", lon: "90.3742" },
  gulshan: { lat: "23.7925", lon: "90.4078" },
  banani: { lat: "23.7937", lon: "90.4066" },
  uttara: { lat: "23.8759", lon: "90.3795" },
  austin: { lat: "30.2672", lon: "-97.7431" },
  houston: { lat: "29.7604", lon: "-95.3698" },
  dallas: { lat: "32.7767", lon: "-96.7970" },
  london: { lat: "51.5074", lon: "-0.1278" },
  manchester: { lat: "53.4808", lon: "-2.2426" },
  "new york": { lat: "40.7128", lon: "-74.0060" },
  miami: { lat: "25.7617", lon: "-80.1918" },
  chicago: { lat: "41.8781", lon: "-87.6298" },
  dubai: { lat: "25.2048", lon: "55.2708" },
  toronto: { lat: "43.6532", lon: "-79.3832" },
  sydney: { lat: "-33.8688", lon: "151.2093" },
};

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    rows.push(row);
  }

  return rows;
}

function extractSocials(text: string) {
  const socials: { instagram?: string; facebook?: string; linkedin?: string } = {};
  if (!text) return socials;

  const igMatch = text.match(/https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._-]+/i);
  if (igMatch) socials.instagram = igMatch[0];

  const fbMatch = text.match(/https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._-]+/i);
  if (fbMatch) socials.facebook = fbMatch[0];

  const liMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9._-]+/i);
  if (liMatch) socials.linkedin = liMatch[0];

  return socials;
}

function calculateOpportunity(lead: {
  website?: string;
  phone?: string;
  review_rating?: number;
  review_count?: number;
}) {
  let score = 50;
  const reasons: string[] = [];

  const hasWebsite = lead.website && lead.website.length > 5;
  const rating = lead.review_rating || 0;
  const reviews = lead.review_count || 0;

  if (!hasWebsite) {
    score += 45;
    reasons.push("🚨 Missing Website: High conversion client for web design ($500+ value)");
  } else {
    score += 15;
    reasons.push("🌐 Active Website: Candidate for SEO, speed, and mobile responsiveness audit");
  }

  if (reviews > 100 && rating >= 4.0) {
    score += 20;
    reasons.push("⭐ Established Local Authority: Proven customer volume & high revenue");
  } else if (rating > 0 && rating < 4.2) {
    score += 25;
    reasons.push("📉 Sub-optimal Rating: Needs Google Review boosting & reputation repair");
  }

  if (lead.phone && lead.phone.length > 5) {
    score += 10;
    reasons.push("📞 Direct Phone Number: Available for instant WhatsApp or call outreach");
  }

  return {
    score: Math.min(score, 100),
    type: !hasWebsite ? "NO_WEBSITE" : rating < 4.2 ? "LOW_RATING" : "SEO_OPTIMIZE",
    reasons,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, city = "London", depth = 1, extractEmails = true } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const cityLower = city.toLowerCase().trim();
    let coords = { lat: "51.5074", lon: "-0.1278" }; // Default London

    for (const [key, val] of Object.entries(CITY_COORDS)) {
      if (cityLower.includes(key)) {
        coords = val;
        break;
      }
    }

    const fullQuery = `${keyword} in ${city}`;
    const enginePayload = {
      name: `maplead-${Date.now()}`,
      keywords: [fullQuery],
      lat: coords.lat,
      lon: coords.lon,
      lang: "en",
      depth: Math.min(depth, 3),
      email: extractEmails,
      extra_reviews: true,
      max_time: 240,
    };

    const res = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enginePayload),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Engine error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, jobId: data.id, query: fullQuery });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const jobId = searchParams.get("jobId");
  const sample = searchParams.get("sample");
  const auditUrl = searchParams.get("auditUrl");

  // Instant Website Audit Route
  if (auditUrl) {
    try {
      const targetUrl = auditUrl.startsWith("http") ? auditUrl : `https://${auditUrl}`;
      const startTime = Date.now();
      const resp = await fetch(targetUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MapLeadAuditor/1.0)" },
        signal: AbortSignal.timeout(6000),
      });
      const loadTime = Date.now() - startTime;
      const html = await resp.text();

      const hasMetaDesc = /<meta\s+name=["']description["']/i.test(html);
      const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "No title found";

      const issues: string[] = [];
      let grade = "A";
      let healthScore = 95;

      if (!hasViewport) {
        issues.push("Missing mobile viewport tag (Poor mobile experience)");
        healthScore -= 30;
      }
      if (!hasMetaDesc) {
        issues.push("Missing meta description (Lower Google ranking CTR)");
        healthScore -= 20;
      }
      if (loadTime > 2500) {
        issues.push(`Slow response time (${loadTime}ms) - Hurts conversion`);
        healthScore -= 25;
      }
      if (!targetUrl.startsWith("https://")) {
        issues.push("Insecure HTTP connection (Browser marks as Not Secure)");
        healthScore -= 35;
      }

      if (healthScore < 60) grade = "F";
      else if (healthScore < 75) grade = "C";
      else if (healthScore < 85) grade = "B";

      return NextResponse.json({
        url: targetUrl,
        title,
        loadTime: `${loadTime}ms`,
        isSecure: targetUrl.startsWith("https://"),
        hasMobileSupport: hasViewport,
        hasSEO: hasMetaDesc,
        healthScore,
        grade,
        issues: issues.length ? issues : ["Website meets standard baseline requirements"],
      });
    } catch (e: any) {
      return NextResponse.json({
        url: auditUrl,
        healthScore: 35,
        grade: "F",
        loadTime: "Timed out",
        issues: ["Website failed to respond or blocked automated connection. High risk of losing customers."],
      });
    }
  }

  // Sample data fallback for instant preview
  if (sample === "true" || !jobId) {
    const sampleLeads = [
      {
        id: "lead_1",
        title: "Apex Dental Clinic London",
        phone: "+44 20 7946 0912",
        emails: "info@apexdentallondon.co.uk",
        website: "https://apexdentallondon.co.uk",
        socials: { instagram: "https://instagram.com/apexdental", facebook: "https://facebook.com/apexdental" },
        category: "Dental clinic",
        address: "42 Harley Street, Marylebone, London W1G 9PR",
        review_rating: 4.8,
        review_count: 512,
        opportunity: calculateOpportunity({ website: "https://apexdentallondon.co.uk", phone: "+44 20 7946 0912", review_rating: 4.8, review_count: 512 }),
      },
      {
        id: "lead_2",
        title: "City Smile Studio",
        phone: "+44 20 7946 0184",
        emails: "",
        website: "",
        socials: {},
        category: "Dentist",
        address: "15 Bishopsgate, London EC2N 3AQ",
        review_rating: 4.6,
        review_count: 240,
        opportunity: calculateOpportunity({ phone: "+44 20 7946 0184", review_rating: 4.6, review_count: 240 }),
      },
      {
        id: "lead_3",
        title: "Beans & Aroma Coffees",
        phone: "09613-810910",
        emails: "",
        website: "",
        socials: {},
        category: "Coffee shop",
        address: "Satmasjid Road, Dhanmondi, Dhaka",
        review_rating: 4.4,
        review_count: 437,
        opportunity: calculateOpportunity({ phone: "09613-810910", review_rating: 4.4, review_count: 437 }),
      },
      {
        id: "lead_4",
        title: "Houston Premier Roofing Pros",
        phone: "+1 713-555-0199",
        emails: "sales@houstonroofpros.com",
        website: "http://houstonroofpros.com",
        socials: { facebook: "https://facebook.com/houstonroofpros" },
        category: "Roofing contractor",
        address: "2400 Westheimer Rd, Houston, TX 77098",
        review_rating: 3.8,
        review_count: 128,
        opportunity: calculateOpportunity({ website: "http://houstonroofpros.com", phone: "+1 713-555-0199", review_rating: 3.8, review_count: 128 }),
      },
      {
        id: "lead_5",
        title: "Brew Buddies Artisan Roasters",
        phone: "01338-527342",
        emails: "",
        website: "",
        socials: {},
        category: "Cafe & Roastery",
        address: "Concord Sohel Square, Satmasjid Rd, Dhaka",
        review_rating: 4.2,
        review_count: 325,
        opportunity: calculateOpportunity({ phone: "01338-527342", review_rating: 4.2, review_count: 325 }),
      },
      {
        id: "lead_6",
        title: "Tabaq Gourmet Coffee",
        phone: "01710-963066",
        emails: "contact@tabaqcoffee.com",
        website: "http://www.tabaqcoffee.com/",
        socials: { facebook: "https://facebook.com/tabaqcoffee", instagram: "https://instagram.com/tabaqcoffee" },
        category: "Coffee shop",
        address: "House 37, Road 2, Dhanmondi, Dhaka",
        review_rating: 4.6,
        review_count: 1625,
        opportunity: calculateOpportunity({ website: "http://www.tabaqcoffee.com/", phone: "01710-963066", review_rating: 4.6, review_count: 1625 }),
      },
    ];

    return NextResponse.json({ status: "ok", leads: sampleLeads });
  }

  try {
    const statusRes = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs/${jobId}`);
    if (!statusRes.ok) {
      return NextResponse.json({ status: "error", message: "Job not found" }, { status: 404 });
    }

    const jobData = await statusRes.json();
    if (jobData.Status !== "ok") {
      return NextResponse.json({ status: jobData.Status });
    }

    const csvRes = await fetch(`${SCRAPER_BASE_URL}/api/v1/jobs/${jobId}/download`);
    const csvText = await csvRes.text();
    const rows = parseCSV(csvText);

    const leads = rows.map((r, i) => {
      const rating = parseFloat(r.review_rating) || 0;
      const reviews = parseInt(r.review_count, 10) || 0;
      const website = r.website || "";
      const phone = r.phone || "";
      const emails = r.emails || "";
      const rawText = JSON.stringify(r);
      const socials = extractSocials(rawText);

      return {
        id: r.place_id || r.cid || `lead_${i + 1}`,
        title: r.title || "Local Business",
        phone,
        emails,
        website,
        socials,
        category: r.category || "Local Business",
        address: r.address || "",
        review_rating: rating,
        review_count: reviews,
        opportunity: calculateOpportunity({ website, phone, review_rating: rating, review_count: reviews }),
      };
    });

    return NextResponse.json({ status: "ok", leads });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
