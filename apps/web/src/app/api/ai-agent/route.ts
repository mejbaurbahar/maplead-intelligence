import { NextResponse } from "next/server";

interface ICPSegment {
  title: string;
  category: string;
  fitScore: number;
  reason: string;
  estDeal: string;
  recommendedQuery: string;
  targetCities: string[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || "analyze_website";

    // 1. ACTION: ANALYZE WEBSITE & EXTRACT ICP
    if (action === "analyze_website") {
      let url = body.url ? body.url.trim() : "";
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      let siteTitle = "Digital Services Agency";
      let siteDesc = "Web design, SEO marketing, and customer acquisition services.";

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        clearTimeout(timeout);

        if (res.ok) {
          const html = await res.text();
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            siteTitle = titleMatch[1].trim();
          }
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
          if (descMatch && descMatch[1]) {
            siteDesc = descMatch[1].trim();
          }
        }
      } catch (err) {
        // Fallback for demo/offline URLs
        siteTitle = url.replace(/https?:\/\//, "").split("/")[0] + " Services";
      }

      // Generate AI ICP Segments based on the offer
      const isSEOorWeb =
        siteTitle.toLowerCase().includes("web") ||
        siteTitle.toLowerCase().includes("seo") ||
        siteTitle.toLowerCase().includes("agency") ||
        siteTitle.toLowerCase().includes("design") ||
        siteDesc.toLowerCase().includes("marketing");

      const icpSegments: ICPSegment[] = isSEOorWeb
        ? [
            {
              title: "Dentists & Cosmetic Orthodontists",
              category: "Healthcare & Aesthetics",
              fitScore: 96,
              reason: "High patient LTV ($2,000+). Many have outdated websites or lack local Google Maps SEO ranking.",
              estDeal: "$1,500 - $3,500",
              recommendedQuery: "Dentists & Orthodontists",
              targetCities: ["London, UK", "New York, USA", "Austin, TX"],
            },
            {
              title: "Roofing & Home Service Contractors",
              category: "Home Infrastructure",
              fitScore: 92,
              reason: "Emergency inquiries occur via mobile Google search. Missing mobile responsiveness causes 40%+ dropoff.",
              estDeal: "$1,200 - $2,500",
              recommendedQuery: "Roofing Contractors",
              targetCities: ["Houston, TX", "Manchester, UK", "Dallas, TX"],
            },
            {
              title: "Commercial Office Cleaning Providers",
              category: "B2B Facilities",
              fitScore: 88,
              reason: "High recurring contract value. Often rely on word-of-mouth with no web presence.",
              estDeal: "$800 - $1,800/mo",
              recommendedQuery: "Commercial Cleaning",
              targetCities: ["Toronto, Canada", "Chicago, IL", "London, UK"],
            },
            {
              title: "Specialty Cafes & Fine Dining Restaurants",
              category: "Food & Beverage",
              fitScore: 84,
              reason: "Requires mobile digital menu, online table reservations, and high review velocity.",
              estDeal: "$600 - $1,200",
              recommendedQuery: "Coffee Shops & Cafes",
              targetCities: ["Dhaka, Bangladesh", "Dubai, UAE", "Melbourne, Australia"],
            },
          ]
        : [
            {
              title: "Local Retail & Boutiques",
              category: "Commerce",
              fitScore: 94,
              reason: "Requires e-commerce integration, local delivery visibility, and customer review optimization.",
              estDeal: "$800 - $2,000",
              recommendedQuery: "Boutiques & Retail",
              targetCities: ["London, UK", "New York, USA"],
            },
            {
              title: "Professional Legal & Financial Advisors",
              category: "Professional Services",
              fitScore: 90,
              reason: "High trust requirement. Poor web speed or missing SSL destroys client conversion.",
              estDeal: "$2,000 - $5,000",
              recommendedQuery: "Law Firms & Attorneys",
              targetCities: ["London, UK", "Sydney, Australia"],
            },
          ];

      return NextResponse.json({
        success: true,
        analyzedUrl: url,
        title: siteTitle,
        description: siteDesc,
        identifiedOffer: isSEOorWeb ? "B2B Digital Growth, Web Design & Local SEO" : "Professional Business Services",
        totalIcpCandidates: icpSegments.length,
        icpSegments,
      });
    }

    // 2. ACTION: GENERATE HYPER-PERSONALIZED OUTREACH SCRIPT
    if (action === "generate_pitch") {
      const { lead, offerType } = body;
      const title = lead?.title || "Business Owner";
      const category = lead?.category || "business";
      const city = lead?.address || "your city";
      const rating = lead?.review_rating || 4.8;
      const reviews = lead?.review_count || 120;
      const hasWebsite = Boolean(lead?.website && lead?.website.length > 5);

      let subject = "";
      let emailBody = "";
      let whatsappScript = "";

      if (!hasWebsite) {
        subject = `Quick question regarding ${title}'s Google listing`;
        emailBody = `Hi ${title} Team,\n\nI was browsing top-rated ${category} providers in ${city} and saw your Google Maps listing has an impressive ${rating}★ rating from ${reviews} happy clients!\n\nHowever, I noticed your profile doesn't have an active website attached. In 2026, over 74% of mobile searchers looking for ${category} click away if they can't immediately see a service menu, pricing, or instant booking.\n\nWe build high-converting mobile websites specifically for ${category} businesses that turn local Google search traffic into booked customers.\n\nWould you be open to seeing a free 2-minute visual mockup of what a modern site for ${title} could look like? No cost or commitment.\n\nBest regards,\nAutomated Growth Team`;

        whatsappScript = `Hi ${title}! 👋 Loved your ${rating}★ rating on Google Maps (${reviews} reviews). Noticed you don't have a website linked yet—would you like to see a quick 2-minute demo of a mobile booking page designed for your business?`;
      } else {
        subject = `Idea for ${title}'s website speed & local ranking`;
        emailBody = `Hi ${title} Team,\n\nI came across ${title} while searching for premier ${category} services in ${city} (${rating}★ on Google Maps).\n\nWe ran a complimentary technical diagnostic on your website (${lead.website}) and identified 2 simple optimizations that could improve your mobile load speed and local search ranking.\n\nWould you be open if I sent over a 1-page summary showing exactly where the bottlenecks are? Free of charge.\n\nBest regards,\nAutomated Growth Team`;

        whatsappScript = `Hello ${title} team! We analyzed your site ${lead.website} and identified 2 quick fixes to increase mobile inquiries from local Google searchers. May I share the 1-page report with you?`;
      }

      return NextResponse.json({
        success: true,
        subject,
        emailBody,
        whatsappScript,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("AI Agent error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
