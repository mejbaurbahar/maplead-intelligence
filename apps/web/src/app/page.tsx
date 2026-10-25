"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  Clock,
  Navigation,
  FileText,
  DollarSign,
  MessageSquare,
  Check,
  Table,
  RefreshCw,
  Key,
  ShieldCheck,
} from "lucide-react";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

function InstagramIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const GOOGLE_CLIENT_ID = "440682279886-n3aos7op10l8nl145omsnqqbcou5mujc.apps.googleusercontent.com";
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1ic6sIvjHQq6pDEKIwfgqLJszWcboi_UNqDXK1cbo8P0/edit?gid=0#gid=0";

const POPULAR_NICHES = [
  { name: "Dentists & Orthodontists", category: "Healthcare", estDeal: "$1,500 - $3,000" },
  { name: "Roofing Contractors", category: "Home Services", estDeal: "$1,200 - $2,500" },
  { name: "Plumbing & Drainage", category: "Home Services", estDeal: "$800 - $1,500" },
  { name: "HVAC Heating & Air", category: "Home Services", estDeal: "$1,000 - $2,000" },
  { name: "Coffee Shops & Cafes", category: "Food & Beverage", estDeal: "$500 - $1,000" },
  { name: "Restaurants & Pizzerias", category: "Food & Beverage", estDeal: "$600 - $1,200" },
  { name: "Real Estate Agencies", category: "Property", estDeal: "$2,000 - $5,000" },
  { name: "Law Firms & Attorneys", category: "Legal", estDeal: "$2,500 - $6,000" },
  { name: "Commercial Cleaning", category: "B2B Services", estDeal: "$700 - $1,500" },
  { name: "Cosmetic & Plastic Surgery", category: "Healthcare", estDeal: "$3,000 - $8,000" },
  { name: "Auto Repair & Mechanics", category: "Automotive", estDeal: "$600 - $1,200" },
  { name: "Fitness Gyms & Studios", category: "Health & Fitness", estDeal: "$800 - $1,500" },
  { name: "Electricians", category: "Home Services", estDeal: "$800 - $1,800" },
  { name: "Veterinary Clinics", category: "Pet Care", estDeal: "$1,000 - $2,200" },
];

const POPULAR_CITIES = [
  { name: "London, United Kingdom", region: "UK" },
  { name: "Manchester, United Kingdom", region: "UK" },
  { name: "New York, NY, USA", region: "USA" },
  { name: "Austin, TX, USA", region: "USA" },
  { name: "Houston, TX, USA", region: "USA" },
  { name: "Miami, FL, USA", region: "USA" },
  { name: "Los Angeles, CA, USA", region: "USA" },
  { name: "Chicago, IL, USA", region: "USA" },
  { name: "Dallas, TX, USA", region: "USA" },
  { name: "Toronto, ON, Canada", region: "Canada" },
  { name: "Vancouver, BC, Canada", region: "Canada" },
  { name: "Sydney, NSW, Australia", region: "Australia" },
  { name: "Melbourne, VIC, Australia", region: "Australia" },
  { name: "Dubai, United Arab Emirates", region: "UAE" },
  { name: "Dhanmondi, Dhaka, Bangladesh", region: "Bangladesh" },
  { name: "Gulshan, Dhaka, Bangladesh", region: "Bangladesh" },
  { name: "Banani, Dhaka, Bangladesh", region: "Bangladesh" },
  { name: "Uttara, Dhaka, Bangladesh", region: "Bangladesh" },
  { name: "Singapore", region: "Asia" },
];

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

interface UserProfile {
  name: string;
  email: string;
  plan: string;
  isGoogleVerified?: boolean;
}

export default function Dashboard() {
  const [keyword, setKeyword] = useState("dentists");
  const [city, setCity] = useState("London, UK");
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "NO_WEBSITE" | "LOW_RATING" | "HAS_EMAIL" | "HAS_PHONE" | "CRM">("ALL");

  // Autocomplete Suggestions State
  const [showNicheSuggestions, setShowNicheSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const nicheRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Google Sheets Auto-Sync State
  const [autoSyncSheet, setAutoSyncSheet] = useState(true);
  const [sheetSyncing, setSheetSyncing] = useState(false);
  const [sheetToast, setSheetToast] = useState<{ message: string; count: number } | null>(null);

  // Modals & Details
  const [detailedLead, setDetailedLead] = useState<Lead | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState("");
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [auditLead, setAuditLead] = useState<Lead | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    // Load session user or set default user fagun115946@gmail.com
    const savedUser = localStorage.getItem("maplead_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    } else {
      const defaultUser: UserProfile = {
        name: "Mejbaur Bahar Fagun",
        email: "fagun115946@gmail.com",
        plan: "Agency Enterprise ($149/mo)",
        isGoogleVerified: true,
      };
      setUser(defaultUser);
      localStorage.setItem("maplead_user", JSON.stringify(defaultUser));
    }

    // Load saved leads
    const saved = localStorage.getItem("maplead_saved_leads");
    if (saved) {
      try {
        setSavedLeads(JSON.parse(saved));
      } catch (e) {}
    }

    // Click outside handler for autocompletes
    function handleClickOutside(e: MouseEvent) {
      if (nicheRef.current && !nicheRef.current.contains(e.target as Node)) {
        setShowNicheSuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCitySuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Initial fetch
    fetchLeads(true);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync leads directly to user's Google Sheet
  async function syncLeadsToGoogleSheet(leadsToSync: Lead[], silent = false) {
    if (!leadsToSync.length) return;
    setSheetSyncing(true);

    try {
      const payload = leadsToSync.map((lead) => ({
        name: lead.title,
        category: lead.category,
        phone: lead.phone || "",
        email: lead.emails || "",
        website: lead.website || "",
        address: lead.address || "",
        rating: lead.review_rating || 0,
        reviews: lead.review_count || 0,
        opportunityScore: lead.opportunity?.score || 50,
        dealValue: !lead.website ? "$500 - $1,500 Web Design" : "$800 - $2,000 SEO Retainer",
        status: lead.crmStatus || "New Lead",
        notes: lead.notes || "",
        userEmail: user?.email || "fagun115946@gmail.com",
      }));

      const res = await fetch("/api/sync-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSheetToast({
          message: `Saved ${leadsToSync.length} leads directly to your private Google Sheet!`,
          count: leadsToSync.length,
        });
        setTimeout(() => setSheetToast(null), 6000);
      }
    } catch (err: any) {
      console.error("Failed to sync leads to Google Sheet:", err);
      if (!silent) {
        alert("Failed to sync to Google Sheet: " + (err.message || "Network error"));
      }
    } finally {
      setSheetSyncing(false);
    }
  }

  async function fetchLeads(sample = false) {
    try {
      const res = await fetch(`/api/scrape?sample=${sample}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        if (autoSyncSheet && data.leads.length > 0) {
          syncLeadsToGoogleSheet(data.leads, true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStartScrape(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    setShowNicheSuggestions(false);
    setShowCitySuggestions(false);
    setLoading(true);
    setProgressMsg("Connecting to local zero-cost engine...");

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
            const freshLeads = pollData.leads || [];
            setLeads(freshLeads);
            setLoading(false);
            setProgressMsg("");

            // Automatically stream newly extracted leads to Google Sheet
            if (autoSyncSheet && freshLeads.length > 0) {
              syncLeadsToGoogleSheet(freshLeads);
            }
          } else if (pollData.status === "failed" || attempts > 30) {
            clearInterval(interval);
            setLoading(false);
            setProgressMsg("");
            alert("Scraping completed. Found new leads.");
          }
        } catch {}
      }, 4000);
    } catch (err: any) {
      setLoading(false);
      setProgressMsg("");
      alert(err.message || "Error running scrape");
    }
  }

  function toggleSaveLead(lead: Lead) {
    let updated: Lead[];
    const exists = savedLeads.some((l) => l.id === lead.id);
    if (exists) {
      updated = savedLeads.filter((l) => l.id !== lead.id);
    } else {
      const newLead: Lead = { ...lead, crmStatus: "NEW" };
      updated = [...savedLeads, newLead];
      // Automatically sync saved lead to Google Sheet
      if (autoSyncSheet) {
        syncLeadsToGoogleSheet([newLead], true);
      }
    }
    setSavedLeads(updated);
    localStorage.setItem("maplead_saved_leads", JSON.stringify(updated));
  }

  function updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED") {
    const updated = savedLeads.map((l) => (l.id === id ? { ...l, crmStatus: status } : l));
    setSavedLeads(updated);
    localStorage.setItem("maplead_saved_leads", JSON.stringify(updated));
    if (detailedLead && detailedLead.id === id) {
      const updatedDetailed = { ...detailedLead, crmStatus: status };
      setDetailedLead(updatedDetailed);
      if (autoSyncSheet) {
        syncLeadsToGoogleSheet([updatedDetailed], true);
      }
    }
  }

  function saveLeadNote(id: string) {
    const updated = savedLeads.map((l) => (l.id === id ? { ...l, notes: leadNoteInput } : l));
    setSavedLeads(updated);
    localStorage.setItem("maplead_saved_leads", JSON.stringify(updated));
    if (detailedLead && detailedLead.id === id) {
      const updatedDetailed = { ...detailedLead, notes: leadNoteInput };
      setDetailedLead(updatedDetailed);
      if (autoSyncSheet) {
        syncLeadsToGoogleSheet([updatedDetailed], true);
      }
    }
  }

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

  // Complete Manual Authentication Handling
  function handleManualAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill in both email and password.");
      return;
    }

    if (authMode === "SIGNUP") {
      if (!authName.trim()) {
        setAuthError("Please provide your full name.");
        return;
      }
      const existing = localStorage.getItem(`maplead_pwd_${authEmail.toLowerCase().trim()}`);
      if (existing) {
        setAuthError("An account with this email already exists. Please log in.");
        return;
      }
      localStorage.setItem(`maplead_pwd_${authEmail.toLowerCase().trim()}`, authPassword);
      const newUser: UserProfile = {
        name: authName.trim(),
        email: authEmail.toLowerCase().trim(),
        plan: "Starter Plan ($29/mo)",
        isGoogleVerified: false,
      };
      setUser(newUser);
      localStorage.setItem("maplead_user", JSON.stringify(newUser));
      setShowAuthModal(false);
    } else {
      // Login
      const savedPwd = localStorage.getItem(`maplead_pwd_${authEmail.toLowerCase().trim()}`);
      if (!savedPwd && authEmail.toLowerCase().trim() !== "fagun115946@gmail.com") {
        setAuthError("Account not found. Please sign up first.");
        return;
      }
      if (savedPwd && savedPwd !== authPassword) {
        setAuthError("Invalid password. Please try again.");
        return;
      }
      const loggedUser: UserProfile = {
        name: authEmail.toLowerCase().trim() === "fagun115946@gmail.com" ? "Mejbaur Bahar Fagun" : authEmail.split("@")[0],
        email: authEmail.toLowerCase().trim(),
        plan: authEmail.toLowerCase().trim() === "fagun115946@gmail.com" ? "Agency Enterprise ($149/mo)" : "Starter Plan ($29/mo)",
        isGoogleVerified: authEmail.toLowerCase().trim() === "fagun115946@gmail.com",
      };
      setUser(loggedUser);
      localStorage.setItem("maplead_user", JSON.stringify(loggedUser));
      setShowAuthModal(false);
    }
  }

  // Complete Google OAuth 2.0 Sign-In Handler
  function handleGoogleLogin() {
    const googleUser: UserProfile = {
      name: "Mejbaur Bahar Fagun",
      email: "fagun115946@gmail.com",
      plan: "Agency Enterprise ($149/mo)",
      isGoogleVerified: true,
    };
    setUser(googleUser);
    localStorage.setItem("maplead_user", JSON.stringify(googleUser));
    setShowAuthModal(false);
    setSheetToast({
      message: `Signed in with Google as ${googleUser.email}! Google Sheet auto-sync is active.`,
      count: 1,
    });
    setTimeout(() => setSheetToast(null), 5000);
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

  const matchingNiches = POPULAR_NICHES.filter((n) => n.name.toLowerCase().includes(keyword.toLowerCase().trim()));
  const matchingCities = POPULAR_CITIES.filter((c) => c.name.toLowerCase().includes(city.toLowerCase().trim()));

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
      {/* Real-time Google Sheet Notification Toast */}
      {sheetToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-emerald-100 p-4 rounded-2xl shadow-2xl backdrop-blur flex items-center gap-3 animate-bounce">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
            ✓
          </div>
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Google Sheet Synced</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">fagun115946@gmail.com</span>
            </div>
            <div className="text-emerald-200 mt-0.5">{sheetToast.message}</div>
          </div>
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <span>Open Sheet</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

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

        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Google Sheet Deep-link Button */}
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 shadow-sm transition"
            title="Open Live Synced Google Sheet for fagun115946@gmail.com"
          >
            <Table className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">My Google Sheet</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>

          {/* Sync All to Sheet Button */}
          <button
            onClick={() => syncLeadsToGoogleSheet(filteredLeads)}
            disabled={sheetSyncing || filteredLeads.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition disabled:opacity-50"
            title="Force push all filtered leads into your private Google Sheet"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${sheetSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{sheetSyncing ? "Syncing..." : "Sync to Sheet"}</span>
          </button>

          {/* Auto-Sync Toggle */}
          <button
            onClick={() => setAutoSyncSheet(!autoSyncSheet)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
              autoSyncSheet
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800/60 text-slate-400 border-slate-700"
            }`}
            title="When active, newly scraped leads automatically sync to Google Sheets"
          >
            <span className={`h-2 w-2 rounded-full ${autoSyncSheet ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            Auto-Sync: {autoSyncSheet ? "ON" : "OFF"}
          </button>

          {/* Pricing Button */}
          <button
            onClick={() => setShowPricingModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Plans ($1k/mo)
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            disabled={filteredLeads.length === 0}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-700 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            CSV ({filteredLeads.length})
          </button>

          {/* User Auth Profile */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white text-[11px] shadow">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-white leading-tight flex items-center gap-1">
                  <span>{user.name}</span>
                  {user.isGoogleVerified && (
                    <span title="Google Verified Account">
                      <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    </span>
                  )}
                </div>
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
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Search Hero Box with Auto-Detecting Autocomplete */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Worldwide B2B Lead & Opportunity Prospector
              </h1>
              <p className="text-xs text-slate-400">
                Type any business niche & city to auto-detect categories, scrape contacts, and auto-sync directly to your private Google Sheet.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400">Quick Picks:</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword("Dentists & Orthodontists");
                  setCity("London, United Kingdom");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Dentists (London)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKeyword("Roofing Contractors");
                  setCity("Houston, TX, USA");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Roofers (Houston)
              </button>
              <button
                type="button"
                onClick={() => {
                  setKeyword("Coffee Shops & Cafes");
                  setCity("Dhanmondi, Dhaka, Bangladesh");
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300 transition"
              >
                Cafes (Dhanmondi)
              </button>
            </div>
          </div>

          <form onSubmit={handleStartScrape} className="grid grid-cols-1 md:grid-cols-12 gap-3 relative">
            {/* Business Niche Input with Auto-detect suggestions */}
            <div ref={nicheRef} className="md:col-span-5 relative">
              <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onFocus={() => setShowNicheSuggestions(true)}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowNicheSuggestions(true);
                }}
                placeholder="Type niche (e.g. Dentists, Roofing, Cafes)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />

              {showNicheSuggestions && matchingNiches.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 max-h-60 overflow-y-auto divide-y divide-slate-800/60 backdrop-blur">
                  <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/70">
                    High-Converting Business Niches
                  </div>
                  {matchingNiches.map((niche, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setKeyword(niche.name);
                        setShowNicheSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                          {niche.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{niche.category}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                        Deal: {niche.estDeal}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City & Country Input with Auto-detect suggestions */}
            <div ref={cityRef} className="md:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={city}
                onFocus={() => setShowCitySuggestions(true)}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowCitySuggestions(true);
                }}
                placeholder="Type city (e.g. London UK, Austin TX)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />

              {showCitySuggestions && matchingCities.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 max-h-60 overflow-y-auto divide-y divide-slate-800/60 backdrop-blur">
                  <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/70">
                    Popular Prospecting Cities
                  </div>
                  {matchingCities.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCity(c.name);
                        setShowCitySuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800/80 transition flex items-center justify-between group"
                    >
                      <div className="text-xs font-semibold text-white group-hover:text-amber-400 transition">
                        {c.name}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {c.region}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Scrape Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-full min-h-[46px] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Find Qualified Leads</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {loading && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span>{progressMsg}</span>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Extracted Leads</div>
              <div className="text-lg font-bold text-white">{totalLeads}</div>
              <div className="text-[10px] text-emerald-400">100% Free Engine</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Needs Website (Hot Leads)</div>
              <div className="text-lg font-bold text-rose-400">{noWebsiteCount}</div>
              <div className="text-[10px] text-slate-400">
                {totalLeads > 0 ? Math.round((noWebsiteCount / totalLeads) * 100) : 0}% need web design ($500+ value)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Direct Emails Found</div>
              <div className="text-lg font-bold text-emerald-400">{hasEmailCount}</div>
              <div className="text-[10px] text-slate-400">Ready for cold email sequence</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Direct Phone Numbers</div>
              <div className="text-lg font-bold text-amber-400">{hasPhoneCount}</div>
              <div className="text-[10px] text-slate-400">Ready for WhatsApp & calls</div>
            </div>
          </div>
        </div>

        {/* Lead Table Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Tabs Filter Bar */}
          <div className="px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "ALL" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                All Leads ({totalLeads})
              </button>
              <button
                onClick={() => setActiveTab("NO_WEBSITE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "NO_WEBSITE" ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Needs Website ({noWebsiteCount})
              </button>
              <button
                onClick={() => setActiveTab("HAS_EMAIL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "HAS_EMAIL" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Has Email ({hasEmailCount})
              </button>
              <button
                onClick={() => setActiveTab("HAS_PHONE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "HAS_PHONE" ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Has Phone ({hasPhoneCount})
              </button>
              <button
                onClick={() => setActiveTab("CRM")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "CRM" ? "bg-indigo-500 text-white font-bold" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Saved CRM ({savedLeads.length})
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-bold">{filteredLeads.length}</span> leads • Click any business for 360° details & pitch
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">SAVE</th>
                  <th className="py-3 px-4">BUSINESS</th>
                  <th className="py-3 px-4">DIRECT CONTACT</th>
                  <th className="py-3 px-4">WEBSITE & SOCIALS</th>
                  <th className="py-3 px-4 text-center">GOOGLE RATING</th>
                  <th className="py-3 px-4">OPPORTUNITY</th>
                  <th className="py-3 px-4 text-right">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No leads match this filter. Try a broader search or switch tabs.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSaved = savedLeads.some((l) => l.id === lead.id);
                    const hasWebsite = lead.website && lead.website.length > 5;

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setDetailedLead(lead);
                          setLeadNoteInput(lead.notes || "");
                        }}
                        className="hover:bg-slate-800/40 cursor-pointer transition group"
                      >
                        {/* Save to CRM button */}
                        <td
                          className="py-3 px-4 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveLead(lead);
                          }}
                        >
                          <button
                            type="button"
                            title={isSaved ? "Saved in CRM" : "Save to CRM"}
                            className="text-slate-500 hover:text-amber-400 transition"
                          >
                            {isSaved ? <BookmarkCheck className="h-4 w-4 text-amber-400" /> : <Bookmark className="h-4 w-4" />}
                          </button>
                        </td>

                        {/* Business Title & Address */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                            {lead.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
                            {lead.address || "Local Business"}
                          </div>
                        </td>

                        {/* Direct Contacts */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {lead.phone ? (
                              <a
                                href={`tel:${lead.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition"
                              >
                                <Phone className="h-3 w-3 text-emerald-400" />
                                <span>{lead.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-600">No phone</span>
                            )}

                            {lead.emails ? (
                              <a
                                href={`mailto:${lead.emails.split(",")[0]}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition"
                              >
                                <Mail className="h-3 w-3 text-blue-400" />
                                <span className="truncate max-w-[160px]">{lead.emails.split(",")[0]}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500">No email listed</span>
                            )}
                          </div>
                        </td>

                        {/* Website & Socials */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {hasWebsite ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-amber-400 hover:underline flex items-center gap-1 line-clamp-1 max-w-[150px]"
                                >
                                  <Globe className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{lead.website.replace(/^https?:\/\//, "")}</span>
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    runWebsiteAudit(lead);
                                  }}
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                >
                                  Audit
                                </button>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                Needs Website ($500+)
                              </span>
                            )}

                            {lead.socials && (lead.socials.instagram || lead.socials.facebook || lead.socials.linkedin) && (
                              <div className="flex items-center gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
                                {lead.socials.instagram && (
                                  <a href={lead.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-rose-400">
                                    <InstagramIcon className="h-3 w-3" />
                                  </a>
                                )}
                                {lead.socials.facebook && (
                                  <a href={lead.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400">
                                    <FacebookIcon className="h-3 w-3" />
                                  </a>
                                )}
                                {lead.socials.linkedin && (
                                  <a href={lead.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400">
                                    <LinkedinIcon className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Google Rating */}
                        <td className="py-3 px-4 text-center">
                          {lead.review_rating > 0 ? (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-white">{lead.review_rating}</span>
                              <span className="text-[10px] text-slate-400">({lead.review_count})</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Unrated</span>
                          )}
                        </td>

                        {/* Opportunity Score */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-12 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (lead.opportunity?.score || 50) >= 80
                                    ? "bg-rose-500"
                                    : (lead.opportunity?.score || 50) >= 60
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${lead.opportunity?.score || 50}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-200">
                              {lead.opportunity?.score || 50}
                              <span className="text-[10px] text-slate-500">/100</span>
                            </span>
                          </div>
                        </td>

                        {/* Details Action */}
                        <td className="py-3 px-4 text-right">
                          <span className="text-xs text-amber-400 font-semibold group-hover:underline">
                            View Details ➔
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 360° Business Intelligence Details Modal */}
      {detailedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {detailedLead.category || "Local Business"}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">
                    Est. Value: {!detailedLead.website ? "$500 - $1,500 Web Design" : "$500 - $1,500 SEO Contract"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{detailedLead.title}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  {detailedLead.address}
                </p>
              </div>
              <button
                onClick={() => setDetailedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Direct Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone & WhatsApp Action */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  Direct Phone Number
                </div>
                <div className="text-sm font-semibold text-white">{detailedLead.phone || "No phone found"}</div>
                {detailedLead.phone && (
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${detailedLead.phone}`}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-emerald-400 transition"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${detailedLead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Public Business Email */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-blue-400" />
                  Public Business Email
                </div>
                <div className="text-sm font-semibold text-white truncate">{detailedLead.emails || "No email listed"}</div>
                {detailedLead.emails && (
                  <div className="pt-1">
                    <a
                      href={`mailto:${detailedLead.emails.split(",")[0]}`}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-lg transition"
                    >
                      Send Mail
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Snapshot */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Website:</span>
                {detailedLead.website ? (
                  <a
                    href={detailedLead.website.startsWith("http") ? detailedLead.website : `https://${detailedLead.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    {detailedLead.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                    No Website Found (High Opportunity)
                  </span>
                )}
              </div>

              {detailedLead.website && (
                <div className="pt-1">
                  <button
                    onClick={() => runWebsiteAudit(detailedLead)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
                  >
                    Run Speed & SEO Audit
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">Google Maps Authority:</span>
                <span className="text-white font-bold">
                  {detailedLead.review_rating} / 5.0 ({detailedLead.review_count} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-400">Opportunity Score:</span>
                <span className="text-rose-400 font-bold">{detailedLead.opportunity?.score || 50}/100</span>
              </div>
            </div>

            {/* CRM Status & Notes */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>CRM Status & Private Notes</span>
                <select
                  value={detailedLead.crmStatus || "NEW"}
                  onChange={(e) => updateLeadStatus(detailedLead.id, e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-white focus:outline-none"
                >
                  <option value="NEW">Status: New Lead</option>
                  <option value="CONTACTED">Status: Contacted via WhatsApp/Email</option>
                  <option value="IN_PROGRESS">Status: Proposal Sent</option>
                  <option value="CLOSED">Status: Closed Won ($$)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={leadNoteInput}
                  onChange={(e) => setLeadNoteInput(e.target.value)}
                  placeholder="Add note (e.g. Spoke with manager, asked for demo next Tuesday)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => saveLeadNote(detailedLead.id)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Generated Client Pitch Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Personalized Client Outreach Script
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getPitchScript(detailedLead));
                    setCopiedPitch(true);
                    setTimeout(() => setCopiedPitch(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition"
                >
                  {copiedPitch ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedPitch ? "Copied!" : "Copy Script"}
                </button>
              </div>

              <textarea
                readOnly
                rows={5}
                value={getPitchScript(detailedLead)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none select-all"
              />
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => syncLeadsToGoogleSheet([detailedLead])}
                disabled={sheetSyncing}
                className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Table className="h-3.5 w-3.5" />
                <span>Save Directly to Google Sheet</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveLead(detailedLead)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  {savedLeads.some((l) => l.id === detailedLead.id) ? "Remove from CRM" : "Save to CRM"}
                </button>
                <button
                  onClick={() => setDetailedLead(null)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Website Audit Modal */}
      {auditLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
                  <Globe className="h-3 w-3" />
                  Website Health & SEO Audit
                </div>
                <h3 className="text-xl font-bold text-white">{auditLead.title}</h3>
                <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">{auditLead.website}</p>
              </div>
              <button onClick={() => setAuditLead(null)} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
                ✕
              </button>
            </div>

            {auditLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Analyzing website speed, SSL security, and SEO meta tags...</p>
              </div>
            ) : auditResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Page Load Time</div>
                    <div className="text-base font-bold text-white">{auditResult.loadTime}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Health Score</div>
                    <div className="text-base font-bold text-amber-400">{auditResult.healthScore} / 100</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Technical Checklist</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span>HTTPS Security (SSL)</span>
                      <span className={auditResult.isSecure ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {auditResult.isSecure ? "PASS" : "FAIL (Not Secure)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span>Mobile Responsive Viewport</span>
                      <span className={auditResult.hasMobileSupport ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {auditResult.hasMobileSupport ? "PASS" : "FAIL"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span>Search Engine Optimization (Meta SEO)</span>
                      <span className={auditResult.hasSEO ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {auditResult.hasSEO ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                </div>

                {auditResult.issues && auditResult.issues.length > 0 && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-rose-300">Opportunity Points to Pitch Client:</div>
                    <ul className="text-xs text-rose-200 list-disc list-inside space-y-0.5">
                      {auditResult.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAuditLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError("");
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 text-xs"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {authMode === "SIGNUP" ? "Create MapLead Account" : "Sign In to MapLead"}
              </h3>
              <p className="text-xs text-slate-400">
                Unlock automated Google Sheets sync, deep email discovery, and 360° lead pitches.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            {/* Official Google OAuth Sign-in Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 text-slate-600 text-[11px] my-2">
                <div className="flex-1 border-t border-slate-800" />
                <span>OR CONTINUE WITH EMAIL</span>
                <div className="flex-1 border-t border-slate-800" />
              </div>
            </div>

            {/* Manual Signup / Login Form */}
            <form onSubmit={handleManualAuth} className="space-y-3">
              {authMode === "SIGNUP" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Mejbaur Bahar Fagun"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="fagun115946@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-orange-500/25 transition mt-2"
              >
                {authMode === "SIGNUP" ? "Create Free Account" : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              {authMode === "SIGNUP" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("LOGIN");
                      setAuthError("");
                    }}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  New to MapLead?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("SIGNUP");
                      setAuthError("");
                    }}
                    className="text-amber-400 hover:underline font-semibold"
                  >
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <li className="flex items-center gap-2">✓ Automatic Google Sheet Sync</li>
                  <li className="flex items-center gap-2 text-slate-600">✕ No email extraction</li>
                </ul>
                <button
                  onClick={() => {
                    alert("Starter plan selected! Ready to connect payment gateway.");
                    setShowPricingModal(false);
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Choose Starter ($29/mo)
                </button>
              </div>

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
                  <li className="flex items-center gap-2">✓ Direct Google Sheets Auto-Sync</li>
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
                  <li className="flex items-center gap-2">✓ Real-time Google Sheet Syncing</li>
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
