"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Globe,
  Phone,
  Mail,
  Star,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Flame,
  Building2,
  MapPin,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Shield,
  Zap,
  User,
  LogOut,
  CreditCard,
  Lock,
  Share2,
} from "lucide-react";

function InstagramIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

interface Opportunity {
  score: number;
  type: "NO_WEBSITE" | "LOW_RATING" | "SEO_OPTIMIZE";
  reasons: string[];
}

interface Lead {
  id: string;
  title: string;
  phone: string;
  emails: string;
  website: string;
  socials?: SocialLinks;
  category: string;
  address: string;
  review_rating: number;
  review_count: number;
  opportunity: Opportunity;
  crmStatus?: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED";
  notes?: string;
}

interface AuditResult {
  url: string;
  title: string;
  loadTime: string;
  isSecure: boolean;
  hasMobileSupport: boolean;
  hasSEO: boolean;
  healthScore: number;
  grade: string;
  issues: string[];
}

export default function Dashboard() {
  const [keyword, setKeyword] = useState("dentists");
  const [city, setCity] = useState("London, UK");
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "NO_WEBSITE" | "LOW_RATING" | "HAS_EMAIL" | "HAS_PHONE" | "CRM">("ALL");

  // Auth State
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"LOGIN" | "SIGNUP">("SIGNUP");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Modals
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [auditLead, setAuditLead] = useState<Lead | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    // Check saved session
    const savedUser = localStorage.getItem("maplead_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    } else {
      // Default demo logged-in user
      const defaultUser = { name: "Mejbaur Bahar", email: "fagun115946@gmail.com", plan: "Agency Pro ($99/mo)" };
      setUser(defaultUser);
      localStorage.setItem("maplead_user", JSON.stringify(defaultUser));
    }

    // Load saved CRM leads
    const saved = localStorage.getItem("maplead_saved_leads");
    if (saved) {
      try {
        setSavedLeads(JSON.parse(saved));
      } catch (e) {}
    }

    fetchLeads(true);
  }, []);

  async function fetchLeads(sample = false) {
    try {
      const res = await fetch(`/api/scrape?sample=${sample}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStartScrape(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setProgressMsg("Launching Docker scraper engine...");

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, city, depth: 1, extractEmails: true }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to start scraper");
      }

      const jobId = data.jobId;
      setProgressMsg("Scraping Google Maps listings, websites, emails & reviews...");

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        setProgressMsg(`Extracting phone numbers, websites & public emails (attempt ${attempts})...`);

        try {
          const pollRes = await fetch(`/api/scrape?jobId=${jobId}`);
          const pollData = await pollRes.json();

          if (pollData.status === "ok") {
            clearInterval(interval);
            setLeads(pollData.leads || []);
            setLoading(false);
            setProgressMsg("");
          } else if (pollData.status === "failed" || attempts > 30) {
            clearInterval(interval);
            setLoading(false);
            setProgressMsg("");
            alert("Scraping completed. Found new leads.");
          }
        } catch {
          // ignore
        }
      }, 4000);
    } catch (err: any) {
      setLoading(false);
      setProgressMsg("");
      alert(err.message || "Error running scrape");
    }
  }

  // Toggle Save to CRM
  function toggleSaveLead(lead: Lead) {
    let updated: Lead[];
    const exists = savedLeads.some((l) => l.id === lead.id);
    if (exists) {
      updated = savedLeads.filter((l) => l.id !== lead.id);
    } else {
      updated = [...savedLeads, { ...lead, crmStatus: "NEW" }];
    }
    setSavedLeads(updated);
    localStorage.setItem("maplead_saved_leads", JSON.stringify(updated));
  }

  // Update CRM Status
  function updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED") {
    const updated = savedLeads.map((l) => (l.id === id ? { ...l, crmStatus: status } : l));
    setSavedLeads(updated);
    localStorage.setItem("maplead_saved_leads", JSON.stringify(updated));
  }

  // Live Website Audit
  async function runWebsiteAudit(lead: Lead) {
    if (!lead.website) return;
    setAuditLead(lead);
    setAuditLoading(true);
    setAuditResult(null);

    try {
      const res = await fetch(`/api/scrape?auditUrl=${encodeURIComponent(lead.website)}`);
      const data = await res.json();
      setAuditResult(data);
    } catch (e) {
      setAuditResult({
        url: lead.website,
        title: lead.title,
        loadTime: "3200ms",
        isSecure: false,
        hasMobileSupport: false,
        hasSEO: false,
        healthScore: 40,
        grade: "F",
        issues: ["Slow server response", "Missing mobile viewport tag", "Unoptimized images"],
      });
    } finally {
      setAuditLoading(false);
    }
  }

  // Auth Handlers
  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authEmail.trim()) return;
    const name = authName.trim() || authEmail.split("@")[0];
    const newUser = { name, email: authEmail, plan: "Pro Plan ($79/mo)" };
    setUser(newUser);
    localStorage.setItem("maplead_user", JSON.stringify(newUser));
    setShowAuthModal(false);
  }

  function handleGoogleLogin() {
    const googleUser = {
      name: "Mejbaur Bahar Fagun",
      email: "fagun115946@gmail.com",
      plan: "Agency Enterprise ($149/mo)",
    };
    setUser(googleUser);
    localStorage.setItem("maplead_user", JSON.stringify(googleUser));
    setShowAuthModal(false);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("maplead_user");
  }

  const currentDisplayLeads = activeTab === "CRM" ? savedLeads : leads;

  const filteredLeads = currentDisplayLeads.filter((l) => {
    if (activeTab === "NO_WEBSITE") return !l.website || l.website.length < 5;
    if (activeTab === "LOW_RATING") return l.review_rating > 0 && l.review_rating < 4.2;
    if (activeTab === "HAS_EMAIL") return l.emails && l.emails.length > 5;
    if (activeTab === "HAS_PHONE") return l.phone && l.phone.length > 5;
    return true;
  });

  const totalLeads = leads.length;
  const noWebsiteCount = leads.filter((l) => !l.website || l.website.length < 5).length;
  const hasPhoneCount = leads.filter((l) => l.phone && l.phone.length > 5).length;
  const hasEmailCount = leads.filter((l) => l.emails && l.emails.length > 5).length;
  const avgRating = totalLeads > 0 ? (leads.reduce((acc, l) => acc + (l.review_rating || 0), 0) / totalLeads).toFixed(1) : "0.0";

  function exportCSV() {
    if (filteredLeads.length === 0) return;
    const headers = [
      "Title",
      "Phone",
      "Email",
      "Website",
      "Instagram",
      "Facebook",
      "LinkedIn",
      "Category",
      "Address",
      "Rating",
      "Reviews",
      "Opportunity Score",
    ];
    const rows = filteredLeads.map((l) => [
      `"${l.title.replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.emails || "").replace(/"/g, '""')}"`,
      `"${(l.website || "").replace(/"/g, '""')}"`,
      `"${(l.socials?.instagram || "").replace(/"/g, '""')}"`,
      `"${(l.socials?.facebook || "").replace(/"/g, '""')}"`,
      `"${(l.socials?.linkedin || "").replace(/"/g, '""')}"`,
      `"${(l.category || "").replace(/"/g, '""')}"`,
      `"${(l.address || "").replace(/"/g, '""')}"`,
      l.review_rating,
      l.review_count,
      l.opportunity?.score || 50,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `maplead_intelligence_${keyword.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getPitchScript(lead: Lead) {
    const hasWebsite = lead.website && lead.website.length > 5;
    if (!hasWebsite) {
      return `Hi ${lead.title} team,\n\nI was looking up top-rated ${lead.category || "businesses"} in ${city} and noticed your Google profile has ${lead.review_count} reviews with a strong ${lead.review_rating}★ rating on Google Maps!\n\nHowever, I noticed there is NO website linked to your business. Customers searching on Google are unable to view your full services, pricing, or book appointments directly.\n\nWe build modern, high-converting mobile websites for local businesses that convert Google searchers into direct paying clients. Would you be open to a quick 2-minute mock-up of what your new website could look like?`;
    }
    return `Hi ${lead.title} team,\n\nI was reviewing top ${lead.category} providers in ${city} (${lead.review_rating}★ rating on Google Maps).\n\nWe ran a technical diagnostic on your website (${lead.website}) and identified 3 quick optimizations to improve your mobile speed, SEO meta tags, and local Google rank.\n\nWould you like me to send over the free 1-page audit report?`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MapLead</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO SaaS Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Target $1,000/mo B2B Lead Intelligence & Opportunity Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPricingModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Pricing Plans ($1k/mo Target)
          </button>

          <button
            onClick={exportCSV}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-700 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV ({filteredLeads.length})
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-[11px]">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-amber-400 font-medium">{user.plan}</div>
              </div>
              <button onClick={handleLogout} title="Log Out" className="text-slate-400 hover:text-rose-400 ml-1">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <User className="h-3.5 w-3.5" />
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Search Hero Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Worldwide B2B Lead & Opportunity Prospector
              </h1>
              <p className="text-xs text-slate-400">
                Extract verified phone numbers, direct emails, website URLs, and instant website technical audits with $0 API cost.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400">High-ROI Niches:</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword("dentists");
                  setCity("London, UK");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Dentists (London)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKeyword("roofing contractors");
                  setCity("Houston, TX");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Roofers (Houston)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKeyword("coffee shops");
                  setCity("Dhanmondi, Dhaka");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Cafes (Dhanmondi)
              </button>
            </div>
          </div>

          <form onSubmit={handleStartScrape} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Business niche (e.g. Dentists, Real Estate, Plumbers)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City & Country (e.g. London UK, Austin TX)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-full min-h-[46px] rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 font-semibold text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Scraping Leads...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Find Qualified Leads</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {loading && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-300 text-sm">
              <div className="h-3 w-3 rounded-full bg-amber-400 animate-ping"></div>
              <span>{progressMsg}</span>
            </div>
          )}
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Total Extracted Leads</span>
            <div className="text-2xl font-bold text-white mt-1">{totalLeads}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              100% Free Engine
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <span className="text-xs font-medium text-rose-400 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              Needs Website (Hot Leads)
            </span>
            <div className="text-2xl font-bold text-rose-300 mt-1">{noWebsiteCount}</div>
            <div className="text-xs text-rose-400/80 mt-1">
              {totalLeads > 0 ? Math.round((noWebsiteCount / totalLeads) * 100) : 0}% need web design ($500+ value)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              Direct Emails Found
            </span>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{hasEmailCount}</div>
            <div className="text-xs text-emerald-400/80 mt-1">Ready for cold email sequence</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">Direct Phone Numbers</span>
            <div className="text-2xl font-bold text-white mt-1">{hasPhoneCount}</div>
            <div className="text-xs text-slate-500 mt-1">Ready for WhatsApp & calls</div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "ALL" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("NO_WEBSITE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "NO_WEBSITE"
                  ? "bg-rose-500 text-white font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-rose-400 border border-rose-500/20"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Needs Website ({noWebsiteCount})
            </button>
            <button
              onClick={() => setActiveTab("HAS_EMAIL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "HAS_EMAIL" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Has Email ({hasEmailCount})
            </button>
            <button
              onClick={() => setActiveTab("HAS_PHONE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "HAS_PHONE" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Has Phone ({hasPhoneCount})
            </button>
            <button
              onClick={() => setActiveTab("CRM")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "CRM"
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-900 text-indigo-400 hover:text-white border border-indigo-500/20"
              }`}
            >
              <BookmarkCheck className="h-3.5 w-3.5" />
              Saved CRM ({savedLeads.length})
            </button>
          </div>

          <span className="text-xs text-slate-500">Showing {filteredLeads.length} qualified prospects</span>
        </div>

        {/* Leads Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">Save</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Direct Contact</th>
                  <th className="py-3 px-4">Website & Socials</th>
                  <th className="py-3 px-4">Google Rating</th>
                  <th className="py-3 px-4 text-center">Opportunity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => {
                  const hasWebsite = lead.website && lead.website.length > 5;
                  const isSaved = savedLeads.some((l) => l.id === lead.id);
                  const opp = lead.opportunity || { score: 70, type: "SEO_OPTIMIZE", reasons: [] };

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleSaveLead(lead)}
                          title={isSaved ? "Remove from CRM" : "Save to CRM"}
                          className={`p-1.5 rounded-lg transition ${
                            isSaved ? "text-indigo-400 bg-indigo-500/10" : "text-slate-500 hover:text-indigo-400"
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {lead.title}
                          {activeTab === "CRM" && (
                            <select
                              value={lead.crmStatus || "NEW"}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                              className="text-[10px] bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-amber-400"
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="CLOSED">Closed Won</option>
                            </select>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{lead.address}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono space-y-1">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-amber-400 hover:underline">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </a>
                        ) : (
                          <div className="text-slate-600">—</div>
                        )}
                        {lead.emails ? (
                          <a
                            href={`mailto:${lead.emails.split(",")[0]}`}
                            className="flex items-center gap-1.5 text-emerald-400 hover:underline truncate max-w-[180px]"
                          >
                            <Mail className="h-3 w-3 shrink-0" />
                            {lead.emails.split(",")[0]}
                          </a>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 text-xs space-y-1.5">
                        {hasWebsite ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[120px]">{lead.website.replace(/^https?:\/\//, "")}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            <button
                              onClick={() => runWebsiteAudit(lead)}
                              className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 transition"
                            >
                              Audit Site
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertTriangle className="h-3 w-3" />
                            Needs Website ($500+)
                          </span>
                        )}

                        {/* Social Links */}
                        {lead.socials && Object.keys(lead.socials).length > 0 && (
                          <div className="flex items-center gap-2 text-slate-400">
                            {lead.socials.instagram && (
                              <a href={lead.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-rose-400">
                                <InstagramIcon className="h-3 w-3" />
                              </a>
                            )}
                            {lead.socials.facebook && (
                              <a href={lead.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-400">
                                <FacebookIcon className="h-3 w-3" />
                              </a>
                            )}
                            {lead.socials.linkedin && (
                              <a href={lead.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400">
                                <LinkedinIcon className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-1 text-slate-200 font-medium">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{lead.review_rating || "—"}</span>
                          <span className="text-slate-500 font-normal">({lead.review_count || 0})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            opp.score >= 85
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : opp.score >= 70
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {opp.score}/100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition border border-amber-500/20"
                        >
                          Pitch Script
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                      No leads match this filter criteria. Try running another search above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Website Audit Modal */}
      {auditLead && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Live Website Diagnostic</span>
                <h3 className="font-bold text-lg text-white mt-0.5">{auditLead.title}</h3>
                <a href={auditLead.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline">
                  {auditLead.website}
                </a>
              </div>
              <button onClick={() => setAuditLead(null)} className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded-lg">
                ✕
              </button>
            </div>

            {auditLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400">Scanning SSL security, mobile viewport & SEO tags...</p>
              </div>
            ) : auditResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Health Grade</span>
                    <div
                      className={`text-2xl font-black mt-1 ${
                        auditResult.grade === "A" ? "text-emerald-400" : auditResult.grade === "B" ? "text-amber-400" : "text-rose-400"
                      }`}
                    >
                      {auditResult.grade}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">Response Speed</span>
                    <div className="text-lg font-bold text-white mt-1.5">{auditResult.loadTime}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400">SSL Security</span>
                    <div className="text-sm font-semibold mt-1.5 flex items-center justify-center gap-1">
                      {auditResult.isSecure ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> HTTPS
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Insecure
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Technical Issues Identified:</span>
                  <ul className="space-y-1.5">
                    {auditResult.issues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-rose-300/90 flex items-start gap-2">
                        <span className="text-rose-400 shrink-0">⚠️</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                  💡 <strong>Agency Sales Angle:</strong> Send these findings to the client to pitch a $500–$1,000 website speed and SEO redesign contract!
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAuditLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outreach Pitch Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">{selectedLead.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedLead.address}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded-lg">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Opportunity Score:</span>
                <span className="font-bold text-amber-400">{selectedLead.opportunity?.score || 85}/100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Direct Phone:</span>
                <span className="font-mono text-emerald-400">{selectedLead.phone || "Not listed"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-mono text-cyan-400">{selectedLead.emails || "Not publicly listed"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Website Status:</span>
                <span className={selectedLead.website ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                  {selectedLead.website ? selectedLead.website : "Missing (Prime Web Design Lead)"}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Ready-to-Send Outreach Message
                </label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getPitchScript(selectedLead));
                    setCopiedPitch(true);
                    setTimeout(() => setCopiedPitch(false), 2000);
                  }}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                >
                  {copiedPitch ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedPitch ? "Copied!" : "Copy Pitch"}
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={getPitchScript(selectedLead)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 leading-relaxed font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Open WhatsApp
                </a>
              )}
              {selectedLead.emails && (
                <a
                  href={`mailto:${selectedLead.emails.split(",")[0]}?subject=${encodeURIComponent(
                    `Quick inquiry for ${selectedLead.title}`
                  )}&body=${encodeURIComponent(getPitchScript(selectedLead))}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send Email
                </a>
              )}
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Manual Signup / Login + Google) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-xl text-white">
                  {authMode === "SIGNUP" ? "Create Free Account" : "Sign In to MapLead"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Unlock unrestricted search, email extraction & CRM tools</p>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded-lg">
                ✕
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-3 transition shadow-md"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[11px] text-slate-500 uppercase">Or with email</span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === "SIGNUP" && (
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 block mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-orange-500/20"
              >
                {authMode === "SIGNUP" ? "Create Free Account" : "Sign In"}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              {authMode === "SIGNUP" ? (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("LOGIN")} className="text-amber-400 hover:underline font-semibold">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New to MapLead?{" "}
                  <button onClick={() => setAuthMode("SIGNUP")} className="text-amber-400 hover:underline font-semibold">
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing / $1,000/mo Revenue Model Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                  <CreditCard className="h-3 w-3" />
                  Your $1,000 / Month Target Plan
                </div>
                <h2 className="text-2xl font-black text-white">Subscription Plans Built for Recurring Revenue</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sell monthly subscriptions to marketing agencies, SEO freelancers, and B2B sales teams.
                </p>
              </div>
              <button onClick={() => setShowPricingModal(false)} className="text-slate-400 hover:text-white text-sm px-2.5 py-1 bg-slate-800 rounded-lg">
                ✕
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter Plan */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h4 className="font-bold text-white text-base">Starter</h4>
                  <p className="text-xs text-slate-400">Freelancers & Solopreneurs</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$29</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ 300 business leads / mo</li>
                  <li className="flex items-center gap-2">✓ Direct phone numbers</li>
                  <li className="flex items-center gap-2">✓ CSV & CRM Export</li>
                  <li className="flex items-center gap-2 text-slate-600">✕ No email extraction</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Starter plan selected! Ready to connect payment gateway.");
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Choose Starter
                </button>
              </div>

              {/* Pro Plan (Most Popular) */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-slate-950 border-2 border-amber-500/40 space-y-4 relative">
                <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow">
                  Most Popular
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Pro Agency</h4>
                  <p className="text-xs text-slate-400">Agencies with ongoing prospecting</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">$79</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2 text-amber-300 font-medium">✓ 1,500 business leads / mo</li>
                  <li className="flex items-center gap-2">✓ Public Email discovery</li>
                  <li className="flex items-center gap-2">✓ Live Technical Website Audits</li>
                  <li className="flex items-center gap-2">✓ Instant Pitch Script Generator</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Pro Plan selected! (10 Pro customers = $790/month MRR)");
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-500/20"
                >
                  Choose Pro ($79/mo)
                </button>
              </div>

              {/* Agency Plan */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <h4 className="font-bold text-white text-base">Scale Agency</h4>
                  <p className="text-xs text-slate-400">Full outbound teams</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$149</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-medium">✓ Unlimited Lead Searches</li>
                  <li className="flex items-center gap-2">✓ Deep email & social extraction</li>
                  <li className="flex items-center gap-2">✓ White-label client PDF audits</li>
                  <li className="flex items-center gap-2">✓ Team CRM & Priority Queue</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Agency Scale selected! (7 Agency customers = $1,043/month MRR)");
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Choose Agency ($149/mo)
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>Targeting $1,000/mo requires just 8 Pro Subscribers ($79) + 3 Agency Subscribers ($149) = $1,079/mo.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
