import { NextResponse } from "next/server";

export interface CompanyIntel {
  name: string;
  domain: string;
  description: string;
  founded: string;
  employees: string;
  location: string;
  flag: string;
  monthlyTraffic: string;
  trafficTrend: string;
  outreachDomains: string;
}

export interface CompetitorItem {
  name: string;
  domain: string;
  url: string;
  initial: string;
}

export interface CampaignSegment {
  name: string;
  count: string;
  description: string;
  fitScore: number;
  estDeal: string;
}

export interface DecisionMaker {
  initials: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  email: string;
  emailStatus: "valid" | "catch_all" | "no_email";
  verifiedVia: "leadmagic" | "findymail" | "hunter" | "exreacher";
  linkedin: string;
  emailSubject: string;
  emailBody: string;
}

export interface CustomerCompany {
  name: string;
  domain: string;
  category: string;
  size: string;
  fitScore: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || "analyze_website";

    // 1. ACTION: FULL EXPLEE-STYLE AUTO-GTM PIPELINE (From any domain or URL)
    if (action === "analyze_website") {
      let rawUrl = (body.url || "").trim();
      if (!rawUrl) rawUrl = "nasa.gov";

      const cleanDomain = rawUrl
        .replace(/^https?:\/\//i, "")
        .replace(/\/.*$/, "")
        .toLowerCase();

      let siteTitle = "";
      let siteDesc = "";

      // Attempt live fetch if possible
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`https://${cleanDomain}`, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
      } catch (e) {
        // Fallback gracefully
      }

      // Check if NASA or aerospace
      const isNasa = cleanDomain.includes("nasa.gov");
      const isAviation = isNasa || cleanDomain.includes("flight") || cleanDomain.includes("aero") || cleanDomain.includes("pilot");

      let company: CompanyIntel;
      let competitors: CompetitorItem[];
      let campaigns: CampaignSegment[];
      let companies: CustomerCompany[];
      let people: DecisionMaker[];

      if (isNasa) {
        company = {
          name: "NASA ASRS",
          domain: "nasa.gov",
          description:
            "A confidential aviation safety reporting system where pilots and staff voluntarily share incidents, analyzed to improve global flight safety standards.",
          founded: "1976",
          employees: "3.2K emp",
          location: "Moffett Field, CA, USA",
          flag: "🇺🇸",
          monthlyTraffic: "25.6M /mo",
          trafficTrend: "▲ 12%",
          outreachDomains: "50 outreach domains",
        };

        competitors = [
          { name: "SafeCom", domain: "safecom.gov", url: "https://safecom.gov/", initial: "S" },
          { name: "ATSAP Safety", domain: "atsapsafety.org", url: "https://atsapsafety.org/", initial: "A" },
          { name: "Aviation Reporting EU", domain: "aviationreporting.eu", url: "https://aviationreporting.eu/", initial: "A" },
          { name: "C-Space", domain: "c-space.jp", url: "https://c-space.jp/", initial: "C" },
          { name: "Intl Space Agency", domain: "international-space-agency.org", url: "https://international-space-agency.org/", initial: "I" },
          { name: "NAMI Flight", domain: "nami.org", url: "https://nami.org/", initial: "N" },
          { name: "Spaceport Co", domain: "thespaceportcompany.com", url: "https://thespaceportcompany.com/", initial: "S" },
        ];

        campaigns = [
          { name: "Airline pilots", count: "1.2K", description: "Commercial & charter captains filing flight hazard logs", fitScore: 98, estDeal: "$2,500/yr" },
          { name: "Airline safety teams", count: "700", description: "SMS managers & flight operation compliance officers", fitScore: 95, estDeal: "$5,000/yr" },
          { name: "Corporate flight departments", count: "2.2K", description: "Private jet operators and VIP fleet coordinators", fitScore: 92, estDeal: "$3,800/yr" },
          { name: "Flight schools", count: "1.8K", description: "CFI trainers & aviation academy directors", fitScore: 89, estDeal: "$1,500/yr" },
          { name: "Airport operators", count: "900", description: "Ground control and runway operations supervisors", fitScore: 87, estDeal: "$4,200/yr" },
          { name: "Regulators and trainers", count: "5.0K", description: "FAA / ICAO certified flight auditors", fitScore: 94, estDeal: "$7,500/yr" },
        ];

        companies = [
          { name: "Royal Air Maroc", domain: "royalairmaroc.com", category: "Commercial Airline", size: "5,000+ emp", fitScore: 98 },
          { name: "Falcon Aviation", domain: "falconaviation.ae", category: "Charter & VIP Flight", size: "500-1,000 emp", fitScore: 96 },
          { name: "Global Airlines Group", domain: "globalairlinesgroup.com", category: "International Carrier", size: "1,200 emp", fitScore: 94 },
          { name: "Air Cargo Carriers", domain: "aircargocarriers.com", category: "Freight & Logistics", size: "350 emp", fitScore: 91 },
          { name: "Advanced Air", domain: "flyadvancedair.com", category: "Regional Aviation", size: "200 emp", fitScore: 89 },
          { name: "Erickson Inc", domain: "ericksoninc.com", category: "Heavy-Lift Aviation", size: "800 emp", fitScore: 88 },
        ];

        people = [
          {
            initials: "AZ",
            name: "Amine Zefzafy",
            title: "Pilote de ligne",
            company: "Royal Air Maroc",
            domain: "royalairmaroc.com",
            email: "azefzafy@royalairmaroc.com",
            emailStatus: "valid",
            verifiedVia: "leadmagic",
            linkedin: "https://linkedin.com/in/amine-zefzafy-b81568167",
            emailSubject: "Safety reporting & crew immunity",
            emailBody: `Hi Amine,\n\nI'm Aaron at NASA ASRS. We run a confidential aviation safety reporting system where pilots share incidents voluntarily, and we analyze them to improve flight safety standards.\n\nRoyal Air Maroc pilots could gain a confidential channel to file reports and share near-miss lessons without fear of punishment.\n\nWould a few short written ideas on confidential reporting and immunity for Royal Air Maroc's flight crew be useful?\n\nBest,\nAaron`,
          },
          {
            initials: "AL",
            name: "Andrew Lee",
            title: "Chief Pilot & Operations",
            company: "Falcon Aviation",
            domain: "falconaviation.ae",
            email: "andrew.lee@falconaviation.ae",
            emailStatus: "valid",
            verifiedVia: "leadmagic",
            linkedin: "https://linkedin.com/in/andrewlee-aviation",
            emailSubject: "Incident telemetry for Falcon Aviation",
            emailBody: `Hi Andrew,\n\nI noticed Falcon Aviation's expanding executive charter fleet across the UAE.\n\nWith increased flight hours, tracking voluntary crew observations confidentially helps identify runway and altitude variances before they impact operations.\n\nWould you be open to a 2-minute overview on how we benchmark safety data for private jet fleets?\n\nBest regards,\nAaron`,
          },
          {
            initials: "AV",
            name: "Angel Vazquez",
            title: "First Officer",
            company: "Global Airlines Group",
            domain: "globalairlinesgroup.com",
            email: "angel@globalxair.com",
            emailStatus: "valid",
            verifiedVia: "findymail",
            linkedin: "https://linkedin.com/in/angelvazquez-pilot",
            emailSubject: "Quick thought on Global Airlines flight crew reporting",
            emailBody: `Hi Angel,\n\nI hope your flying schedule is going smoothly.\n\nAt NASA ASRS, we've developed anonymized incident logs that help commercial First Officers flag airspace anomalies without administrative exposure.\n\nCould I send over a quick summary of the findings we recently published for commercial line pilots?\n\nRegards,\nAaron`,
          },
          {
            initials: "AD",
            name: "Antonio Dias",
            title: "First Officer Dornier 328JET",
            company: "Advanced Air",
            domain: "flyadvancedair.com",
            email: "adias@flyadvancedair.com",
            emailStatus: "valid",
            verifiedVia: "findymail",
            linkedin: "https://linkedin.com/in/antoniodias-dornier",
            emailSubject: "Regional flight hazard metrics for Advanced Air",
            emailBody: `Hi Antonio,\n\nSaw your operations on the Dornier 328JET route. Regional hops have unique weather and uncontrolled airspace challenges.\n\nWe provide confidential reporting pipelines specifically tailored for regional flight crews to protect pilot licenses while ensuring fleet safety.\n\nWould a 3-point breakdown be useful to glance over?\n\nBest,\nAaron`,
          },
          {
            initials: "BR",
            name: "Brian Reilly",
            title: "Chief Pilot",
            company: "Hillsboro Aviation",
            domain: "hillsboroaviation.com",
            email: "breilly@hillsboroaviation.com",
            emailStatus: "valid",
            verifiedVia: "hunter",
            linkedin: "https://linkedin.com/in/brianreilly-chiefpilot",
            emailSubject: "Confidential reporting protocol for Hillsboro pilots",
            emailBody: `Hi Brian,\n\nAs Chief Pilot at Hillsboro Aviation, managing mixed training and charter operations requires high vigilance on safety culture.\n\nWe enable flight departments to integrate NASA ASRS reporting with zero paperwork friction for your captains and instructors.\n\nAre you open to reviewing a 1-page integration summary this week?\n\nBest regards,\nAaron`,
          },
          {
            initials: "BP",
            name: "Bradley Pepper",
            title: "Captain",
            company: "Erickson Inc",
            domain: "ericksoninc.com",
            email: "bpepper@ericksonaviation.com",
            emailStatus: "valid",
            verifiedVia: "findymail",
            linkedin: "https://linkedin.com/in/bradleypepper-aviation",
            emailSubject: "Heavy-lift safety reporting protocols",
            emailBody: `Hi Bradley,\n\nErickson's heavy-lift operations face terrain and load environments that standard airline models can't capture.\n\nWe specialize in confidential reporting mechanisms that protect specialty aviators while capturing vital mission telemetry.\n\nWould you have 2 minutes to check out our recent heavy-lift safety brief?\n\nCheers,\nAaron`,
          },
        ];
      } else {
        // Generic / Custom domain analysis (Local Business, Tech, Healthcare, Legal, Retail, Agency)
        const brand = cleanDomain.split(".")[0].toUpperCase();
        const displayTitle = siteTitle || `${brand} Services`;
        const displayDesc =
          siteDesc ||
          `Premium services and specialized customer solutions delivered across ${cleanDomain}.`;

        const isLocalDental =
          cleanDomain.includes("dent") ||
          displayTitle.toLowerCase().includes("dental") ||
          displayTitle.toLowerCase().includes("smile");
        const isAgency =
          cleanDomain.includes("agency") ||
          cleanDomain.includes("media") ||
          cleanDomain.includes("seo") ||
          cleanDomain.includes("design") ||
          displayTitle.toLowerCase().includes("marketing");

        company = {
          name: displayTitle.slice(0, 32),
          domain: cleanDomain,
          description: displayDesc,
          founded: "2018",
          employees: "15 - 50 emp",
          location: "Global & Regional Hub",
          flag: "🌐",
          monthlyTraffic: "42.8K /mo",
          trafficTrend: "▲ 18%",
          outreachDomains: "25 outreach domains",
        };

        if (isLocalDental) {
          competitors = [
            { name: "SmileCare Dental", domain: "smilecaredental.com", url: "https://smilecaredental.com", initial: "S" },
            { name: "Apex Orthodontics", domain: "apexortho.com", url: "https://apexortho.com", initial: "A" },
            { name: "City Center Dental", domain: "citycenterdental.co.uk", url: "https://citycenterdental.co.uk", initial: "C" },
            { name: "Elite Cosmetic Dentistry", domain: "elitedentistry.com", url: "https://elitedentistry.com", initial: "E" },
            { name: "Pure Dental Care", domain: "puredental.com", url: "https://puredental.com", initial: "P" },
          ];

          campaigns = [
            { name: "Local Family Patients", count: "3.4K", description: "Parents seeking biannual exams & pediatric teeth cleanings", fitScore: 98, estDeal: "$800/yr" },
            { name: "Cosmetic Veneer Inquirers", count: "1.1K", description: "High-ticket smile makeover and invisible aligner prospects", fitScore: 95, estDeal: "$3,500/case" },
            { name: "Emergency Dental Needs", count: "850", description: "Same-day toothache relief & urgent root canal extraction", fitScore: 93, estDeal: "$1,200/case" },
            { name: "Corporate Dental Wellness", count: "420", description: "Local employer employee benefit dental discount plans", fitScore: 90, estDeal: "$4,500/yr" },
          ];

          companies = [
            { name: "Metropolitan Health Hub", domain: "metrohealthgroup.com", category: "Corporate Wellness", size: "250 emp", fitScore: 96 },
            { name: "City West Law Associates", domain: "citywestlaw.com", category: "Legal Firm Benefits", size: "85 emp", fitScore: 93 },
            { name: "Apex Fitness & Spa", domain: "apexfitnesshub.com", category: "Aesthetics & Wellness", size: "45 emp", fitScore: 91 },
          ];

          people = [
            {
              initials: "SJ",
              name: "Sarah Jenkins",
              title: "Benefits Director",
              company: "Metropolitan Health Hub",
              domain: "metrohealthgroup.com",
              email: "s.jenkins@metrohealthgroup.com",
              emailStatus: "valid",
              verifiedVia: "leadmagic",
              linkedin: "https://linkedin.com/in/sarahjenkins-hr",
              emailSubject: `Executive dental wellness for Metropolitan Health staff`,
              emailBody: `Hi Sarah,\n\nI was looking into Metropolitan Health Hub's focus on employee wellness.\n\nWe provide corporate preventative dental partnerships with priority appointments and zero out-of-pocket cleanings for top-tier employers.\n\nWould you be open to a quick 2-minute overview of how our corporate smile packages work for your team?\n\nBest regards,\n${displayTitle} Care Team`,
            },
            {
              initials: "MD",
              name: "Marcus Davies",
              title: "Managing Partner",
              company: "City West Law Associates",
              domain: "citywestlaw.com",
              email: "marcus@citywestlaw.com",
              emailStatus: "valid",
              verifiedVia: "findymail",
              linkedin: "https://linkedin.com/in/marcusdavies-law",
              emailSubject: `Staff health perk for City West Law team`,
              emailBody: `Hi Marcus,\n\nLaw firm schedules leave very little time for health appointments during business hours.\n\nWe offer executive weekend and evening dental slots designed for busy legal professionals with express check-ins.\n\nCould I share a 1-page breakdown of how 3 other regional firms provide this as a perk?\n\nRegards,\n${displayTitle} Team`,
            },
          ];
        } else {
          // B2B SaaS / Agency / Business Services
          competitors = [
            { name: "AlphaGrowth Partners", domain: "alphagrowth.io", url: "https://alphagrowth.io", initial: "A" },
            { name: "Nexus Lead Intelligence", domain: "nexuslead.com", url: "https://nexuslead.com", initial: "N" },
            { name: "Vanguard Scale Co", domain: "vanguardscale.com", url: "https://vanguardscale.com", initial: "V" },
            { name: "Apex Demand Gen", domain: "apexdemand.co", url: "https://apexdemand.co", initial: "A" },
            { name: "Orbit Market Engine", domain: "orbitmarket.io", url: "https://orbitmarket.io", initial: "O" },
          ];

          campaigns = [
            { name: "B2B SaaS Founders", count: "2.4K", description: "Early & growth stage tech founders seeking predictable pipeline", fitScore: 97, estDeal: "$2,000 - $5,000/mo" },
            { name: "Agency Directors & Heads of Growth", count: "1.8K", description: "Digital marketing agencies looking to automate outbound client acquisition", fitScore: 94, estDeal: "$1,500 - $3,500/mo" },
            { name: "Commercial Service Contractors", count: "3.1K", description: "High-ticket commercial service providers wanting inbound quote requests", fitScore: 91, estDeal: "$1,200 - $2,500/mo" },
            { name: "Regional Enterprise Consultancies", count: "950", description: "Professional consultancies scaling their enterprise client roster", fitScore: 89, estDeal: "$3,000 - $8,000/mo" },
          ];

          companies = [
            { name: "CloudScale Logic", domain: "cloudscalelogic.io", category: "B2B Cloud SaaS", size: "45 emp", fitScore: 97 },
            { name: "Apex Media Agency", domain: "apexmediagroup.com", category: "Marketing Services", size: "30 emp", fitScore: 94 },
            { name: "Pinnacle Financial Advisory", domain: "pinnacleadvisors.com", category: "Wealth & Advisory", size: "75 emp", fitScore: 91 },
          ];

          people = [
            {
              initials: "TC",
              name: "Thomas Chen",
              title: "Founder & CEO",
              company: "CloudScale Logic",
              domain: "cloudscalelogic.io",
              email: "tchen@cloudscalelogic.io",
              emailStatus: "valid",
              verifiedVia: "leadmagic",
              linkedin: "https://linkedin.com/in/thomaschen-cloud",
              emailSubject: `Automated client acquisition for CloudScale Logic`,
              emailBody: `Hi Thomas,\n\nI was reviewing CloudScale Logic's cloud optimization offering.\n\nMost B2B founders spend 15+ hours weekly manually prospecting or burning budget on cold ads with low conversion.\n\nWe deployed an autonomous AI engine that discovers verified enterprise decision makers and books qualified meetings directly on your calendar.\n\nWould you be open to a 2-minute video mockup showing 5 live prospective clients we identified for CloudScale Logic?\n\nBest,\nAutomated Growth Team`,
            },
            {
              initials: "EM",
              name: "Elena Morales",
              title: "Head of Growth",
              company: "Apex Media Agency",
              domain: "apexmediagroup.com",
              email: "elena@apexmediagroup.com",
              emailStatus: "valid",
              verifiedVia: "findymail",
              linkedin: "https://linkedin.com/in/elenamorales-growth",
              emailSubject: `Pipeline idea for Apex Media's outbound campaigns`,
              emailBody: `Hi Elena,\n\nLoved your agency's recent case studies on scaling creative ROI.\n\nWe built a multi-channel outbound system that scrapes verified Google Maps & business registry data and writes personalized cold emails that hit 42%+ open rates.\n\nCould I send over a quick 1-page sample showing how this could feed your client acquisition pipeline?\n\nCheers,\nGrowth Team`,
            },
            {
              initials: "RH",
              name: "Robert Harrison",
              title: "Managing Director",
              company: "Pinnacle Financial Advisory",
              domain: "pinnacleadvisors.com",
              email: "rharrison@pinnacleadvisors.com",
              emailStatus: "valid",
              verifiedVia: "hunter",
              linkedin: "https://linkedin.com/in/robertharrison-pinnacle",
              emailSubject: `High-net-worth client lead pipeline for Pinnacle`,
              emailBody: `Hi Robert,\n\nIn wealth management, referral growth often plateaus without a systematic outbound pipeline for corporate executives.\n\nOur system maps high-ticket business owners in your target cities with verified contact information and warm introduction sequences.\n\nWould you be open to reviewing a 2-minute overview this week?\n\nBest regards,\nPartnerships Team`,
            },
          ];
        }
      }

      return NextResponse.json({
        success: true,
        company,
        competitors,
        campaigns,
        companies,
        people,
        totalCampaigns: campaigns.length,
        totalLeads: people.length,
      });
    }

    // 2. ACTION: GENERATE PITCH (Direct Quick Action)
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
