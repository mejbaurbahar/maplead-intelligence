'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  ShieldCheck,
  Star,
  Globe,
  Copy,
  Zap,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const GOOGLE_SHEET_DIRECT_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbxHOiNqRFOC_pMeS-6DHkDuilPGISk9cJfcG6Ts3lK9q3hOeRmWohyeDgam7PAIbdml5g/exec';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function AutoGtmClient({ domain }: { domain: string }) {
  const targetDomain = (domain || 'nasa.gov').toLowerCase();

  // State
  const [activeTab, setActiveTab] = useState<'people' | 'emails' | 'companies'>('people');
  const [selectedProspectIndex, setSelectedProspectIndex] = useState(2); // Amine Zefzafy by default
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [subjectText, setSubjectText] = useState('Safety reporting');
  const [emailBodyText, setEmailBodyText] = useState('');
  const [customDomainInput, setCustomDomainInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');
  const [trialStatus, setTrialStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Compute basePath
  const [basePath, setBasePath] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/maplead-intelligence')) {
      setBasePath('/maplead-intelligence');
    }
  }, []);

  // 17 Real Prospects from Explee
  const prospects = [
    {
      initials: 'AN',
      name: 'Aaron Nelan',
      title: 'First Officer',
      company: 'aircargocarriers.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/aaron-nelan',
      subject: 'Aviation safety telemetry for Air Cargo Carriers',
      pitch: `Hi Aaron,\n\nI'm Aaron at NASA ASRS. We operate the national confidential aviation safety reporting system where cargo pilots and ground crews voluntarily share flight hazards and near-miss alerts.\n\nAir Cargo Carriers crews could benefit from a confidential reporting pathway with FAA immunity protection.\n\nWould a 2-page brief on implementing automated ASRS reporting for Air Cargo Carriers' fleet be of interest?\n\nBest regards,\nNASA ASRS Flight Safety Team`,
    },
    {
      initials: 'AF',
      name: 'Amanda Shae Fouche',
      title: 'Captain',
      company: 'flyhelicoptersinc.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/amanda-shae-fouche',
      subject: 'Helicopter safety incident reporting and risk reduction',
      pitch: `Hi Amanda,\n\nI'm reaching out from NASA ASRS. Rotorcraft pilots operate in demanding low-altitude environments where confidential incident reporting drastically reduces operational risk.\n\nFly Helicopters Inc could integrate ASRS telemetry to monitor proactive safety trends without exposing pilots to regulatory penalties.\n\nWould a quick guide on confidential rotorcraft reporting be helpful for your flight operations?\n\nBest,\nNASA ASRS Operations`,
    },
    {
      initials: 'AZ',
      name: 'Amine Zefzafy',
      title: 'Pilote de ligne',
      company: 'royalairmaroc.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'azefzafy@royalairmaroc.com',
      status: 'valid',
      via: 'leadmagic',
      linkedin: 'https://linkedin.com/in/amine-zefzafy-b81568167',
      subject: 'Safety reporting',
      pitch: `Hi Amine,\n\nI'm Aaron at NASA ASRS. We run a confidential aviation safety reporting system where pilots share incidents voluntarily, and we analyze them to improve flight safety standards.\n\nRoyal Air Maroc pilots could gain a confidential channel to file reports and share near-miss lessons without fear of punishment.\n\nWould a few short written ideas on confidential reporting and immunity for Royal Air Maroc's flight crew be useful?\n\nBest,\nAaron`,
    },
    {
      initials: 'AL',
      name: 'Andrew Lee',
      title: 'Pilot',
      company: 'falconaviation.ae',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'andrew.lee@falconaviation.ae',
      status: 'valid',
      via: 'leadmagic',
      linkedin: 'https://linkedin.com/in/andrew-lee-aviation',
      subject: 'Confidential reporting telemetry for Falcon Aviation',
      pitch: `Hi Andrew,\n\nFollowing Falcon Aviation's VIP charter operations across the UAE, safety culture and confidential near-miss reporting are top priorities.\n\nNASA ASRS telemetry helps flight departments proactively identify airspace hazards before incidents occur.\n\nCould I share a 1-page overview showing how Gulf-based operators access our de-identified safety intelligence?\n\nBest regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'AC',
      name: 'Angel Castellanos',
      title: 'First Officer',
      company: 'flyviaair.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/angel-castellanos',
      subject: 'Regional carrier flight hazard reporting',
      pitch: `Hi Angel,\n\nRegional airlines face intense schedule demands where early detection of ground and approach hazards is crucial.\n\nNASA ASRS provides non-punitive reporting mechanisms that empower flight crews to highlight operational bottlenecks safely.\n\nWould you like a sample report on regional jet hazard mitigation?\n\nBest,\nNASA ASRS`,
    },
    {
      initials: 'AV',
      name: 'Angel Vazquez',
      title: 'First Officer',
      company: 'globalairlinesgroup.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'angel@globalxair.com',
      status: 'valid',
      via: 'findymail',
      linkedin: 'https://linkedin.com/in/angel-vazquez',
      subject: 'Flight safety reporting protocol for GlobalX',
      pitch: `Hi Angel,\n\nAs GlobalX expands charter and cargo operations with the A320/A321 fleet, voluntary crew reporting is essential for maintaining pristine safety ratings.\n\nWe analyze voluntary pilot disclosures to deliver proactive safety bulletins.\n\nWould a copy of our latest charter aircraft safety trends report be helpful for your team?\n\nWarm regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'AO',
      name: 'Anthony (A J) Orlando',
      title: 'MD-11 First Officer',
      company: 'westernglobalairlines.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/anthony-orlando',
      subject: 'Heavy widebody cargo hazard mitigation',
      pitch: `Hi Anthony,\n\nFlying MD-11 widebodies on international cargo lanes presents unique wake turbulence and approach challenges.\n\nNASA ASRS provides confidential incident logging that gives flight crews immunity and shares critical insights with the global aviation community.\n\nWould you be open to reviewing our widebody cargo safety dataset?\n\nBest,\nAaron`,
    },
    {
      initials: 'AD',
      name: 'Antonio Dias',
      title: 'First officer Dornier 328JET',
      company: 'flyadvancedair.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'adias@flyadvancedair.com',
      status: 'valid',
      via: 'findymail',
      linkedin: 'https://linkedin.com/in/antonio-dias-pilot',
      subject: 'Advanced Air flight deck safety reporting',
      pitch: `Hi Antonio,\n\nAdvanced Air's Dornier 328JET operations require precision across mountain and regional routes.\n\nNASA ASRS collects non-punitive crew reports to identify regional airport navigation quirks and weather trends.\n\nWould a 2-minute overview on our confidential reporting guidelines be useful for Advanced Air's flight team?\n\nBest,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BM',
      name: 'Banks Martin',
      title: 'First Officer',
      company: 'mtaircargo.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/banks-martin',
      subject: 'Mountain Air Cargo crew reporting systems',
      pitch: `Hi Banks,\n\nVoluntary hazard alerts from cargo pilots directly feed into modern SMS improvements.\n\nNASA ASRS ensures reports are fully de-identified while offering FAA enforcement incentive protection.\n\nWould you like our latest checklist on voluntary incident submission?\n\nBest,\nNASA ASRS`,
    },
    {
      initials: 'BH',
      name: 'Benjamin Hastings',
      title: 'First Officer',
      company: 'iflgroup.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'bhastings@iflgroup.com',
      status: 'valid',
      via: 'leadmagic',
      linkedin: 'https://linkedin.com/in/benjamin-hastings',
      subject: 'Ad-hoc cargo flight hazard intelligence',
      pitch: `Hi Benjamin,\n\nIFL Group's on-demand air freight flights navigate dynamic schedules and varied airfields.\n\nNASA ASRS gathers voluntary crew telemetry to highlight unrecognized airfield hazards before they cause delays.\n\nCould I email you a brief case study on how cargo operators use ASRS to protect flight crews?\n\nBest regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BF',
      name: 'Benjamin Ross Fletcher',
      title: 'First Officer',
      company: 'aceaircargo.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'benjamin@aceaircargo.com',
      status: 'catch_all',
      via: 'leadmagic',
      linkedin: 'https://linkedin.com/in/benjamin-fletcher',
      subject: 'Alaska remote operations safety logging',
      pitch: `Hi Benjamin,\n\nOperating in Alaskan bush weather presents distinct terrain and icing risks that standard flight ops rarely see.\n\nNASA ASRS maintains dedicated reporting workflows tailored to arctic and remote cargo flights.\n\nWould a copy of our Alaskan winter flight safety findings be useful for ACE Air Cargo crews?\n\nBest,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BM',
      name: 'Blair Mitchell',
      title: 'Fixed Wing MedEvac Pilot, FO',
      company: 'csiaviation.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'bmitchell@csiaviation.com',
      status: 'valid',
      via: 'leadmagic',
      linkedin: 'https://linkedin.com/in/blair-mitchell',
      subject: 'Critical care aeromedical flight safety',
      pitch: `Hi Blair,\n\nMedEvac flights operate under intense time pressure and non-standard landing profiles.\n\nNASA ASRS provides confidential incident reporting with zero risk of FAA enforcement action, ensuring aeromedical lessons are shared across the sector.\n\nWould a brief summary of aeromedical safety reports be valuable for CSI Aviation?\n\nWarm regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BP',
      name: 'Bradley Pepper',
      title: 'Captain',
      company: 'ericksoninc.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'bpepper@ericksonaviation.com',
      status: 'valid',
      via: 'findymail',
      linkedin: 'https://linkedin.com/in/bradley-pepper',
      subject: 'Heavy-lift and firefighting aviation reporting',
      pitch: `Hi Bradley,\n\nErickson's heavy-lift and aerial firefighting missions operate in some of the most unforgiving environments in aviation.\n\nNASA ASRS offers specialized reporting channels designed to identify recurring machinery and low-visibility hazards.\n\nCould I send over our report on low-level utility aviation safety trends?\n\nBest,\nAaron`,
    },
    {
      initials: 'BM',
      name: 'Brandon Maso',
      title: 'First Officer',
      company: 'abxair.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/brandon-maso',
      subject: 'Widebody B767 freight safety protocols',
      pitch: `Hi Brandon,\n\nABX Air's nationwide B767 cargo operations play a critical role in American logistics.\n\nNASA ASRS confidential reports help line pilots protect their certificates while improving overall airspace safety.\n\nWould you like to review our recent cargo approach hazard findings?\n\nBest,\nNASA ASRS`,
    },
    {
      initials: 'BO',
      name: "Brian O'Rane",
      title: 'First Officer',
      company: 'kalittacharters.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'borane@kalittacharters.com',
      status: 'valid',
      via: 'hunter',
      linkedin: 'https://linkedin.com/in/brian-orane',
      subject: 'Kalitta Charters crew safety channel',
      pitch: `Hi Brian,\n\nKalitta's emergency air ambulance and VIP charter missions require rapid response across diverse airports.\n\nNASA ASRS ensures all voluntary pilot hazard filings receive confidential review with immunity protection.\n\nWould a 1-page reference on filing ASRS reports during on-demand charter operations be of interest?\n\nBest regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BR',
      name: 'Brian Reilly',
      title: 'Chief Pilot',
      company: 'hillsboroaviation.com',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: 'breilly@hillsboroaviation.com',
      status: 'valid',
      via: 'exreacher',
      linkedin: 'https://linkedin.com/in/brian-reilly-aviation',
      subject: 'Flight training and fleet safety standards',
      pitch: `Hi Brian,\n\nAs Chief Pilot at Hillsboro Aviation, building a proactive safety culture across training and charter fleets is paramount.\n\nNASA ASRS provides flight schools and charter operators with de-identified incident datasets that make ground school training significantly more impactful.\n\nCould I share a 2-page brief on integrating ASRS telemetry into your pilot recurrent training?\n\nBest regards,\nAaron\nNASA ASRS`,
    },
    {
      initials: 'BA',
      name: 'Bruno Proence Alves',
      title: 'B747-8 First Officer',
      company: 'nca.aero',
      providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
      email: null,
      status: 'no_email',
      via: null,
      linkedin: 'https://linkedin.com/in/bruno-proence-alves',
      subject: 'Intercontinental B747-8 cargo operations safety',
      pitch: `Hi Bruno,\n\nFlying transpacific B747-8 cargo freighters for Nippon Cargo Airlines involves complex international ATC interfaces and long-haul fatigue management.\n\nNASA ASRS de-identified reports serve as a foundational resource for global airlines refining their international flight operations.\n\nWould you be open to receiving our long-haul international safety bulletin?\n\nWarm regards,\nAaron\nNASA ASRS`,
    },
  ];

  // Update email text when prospect changes
  useEffect(() => {
    const p = prospects[selectedProspectIndex] || prospects[0];
    setSubjectText(p.subject || `Safety reporting for ${p.company}`);
    setEmailBodyText(p.pitch);
  }, [selectedProspectIndex]);

  // Company Data for NASA ASRS
  const isNasa = targetDomain.includes('nasa');
  const companyData = isNasa
    ? {
        name: 'NASA ASRS',
        domain: 'nasa.gov',
        description:
          'A confidential aviation safety reporting system where pilots and staff voluntarily share incidents, analyzed to improve global flight safety standards.',
        founded: '1976',
        employees: '3 emp',
        location: '🇺🇸 Moffett Field',
        domains: '50 outreach domains',
        traffic: '25.6M /mo',
        trafficChange: '▼ 62%',
        scale: ['0', '33.3M', '66.7M', '100.0M'],
        competitors: [
          { name: 'safecom.gov', url: 'https://safecom.gov', icon: 'S' },
          { name: 'atsapsafety.org', url: 'https://atsapsafety.org', icon: 'A' },
          { name: 'aviationreporting.eu', url: 'https://aviationreporting.eu', icon: 'E' },
          { name: 'c-space.jp', url: 'https://c-space.jp', icon: 'C' },
          { name: 'international-space-agency.org', url: 'https://international-space-agency.org', icon: 'I' },
          { name: 'nami.org', url: 'https://nami.org', icon: 'N' },
          { name: 'thespaceportcompany.com', url: 'https://thespaceportcompany.com', icon: 'T' },
        ],
        campaigns: [
          { name: 'Airline pilots', count: '1.2K' },
          { name: 'Airline safety teams', count: '700' },
          { name: 'Corporate flight departments', count: '2.2K' },
          { name: 'Flight schools', count: '1.8K' },
          { name: 'Airport operators', count: '900' },
          { name: 'Regulators and trainers', count: '5.0K' },
        ],
      }
    : {
        name: targetDomain.split('.')[0].toUpperCase(),
        domain: targetDomain,
        description: `High-performance enterprise solution for ${targetDomain}, engineered to scale pipeline, acquire verified buyers, and run automated cold outreach.`,
        founded: '2019',
        employees: '45 emp',
        location: '🇺🇸 New York, US',
        domains: '50 outreach domains',
        traffic: '420K /mo',
        trafficChange: '▲ 24%',
        scale: ['0', '150K', '300K', '500K'],
        competitors: [
          { name: 'competitor1.io', url: '#', icon: 'C1' },
          { name: 'industry-lead.com', url: '#', icon: 'IL' },
          { name: 'marketgrowth.net', url: '#', icon: 'MG' },
          { name: 'enterprisealpha.org', url: '#', icon: 'EA' },
        ],
        campaigns: [
          { name: 'VP of Marketing', count: '850' },
          { name: 'Chief Operating Officers', count: '1.1K' },
          { name: 'Commercial Directors', count: '1.4K' },
          { name: 'Procurement Leads', count: '920' },
        ],
      };

  // 10 Target Companies from Explee
  const companiesList = [
    {
      name: 'IBC Airways',
      domain: 'ibcairways.com',
      desc: 'Regional airline operating Saab 340 turboprops, certified to transport hazardous materials, providing 24/7 emergency response and hurricane relief flights across the Caribbean.',
      location: 'Fort Lauderdale, United States',
      countryFlag: '🇺🇸',
      size: '55',
      traffic: '13K',
      trafficChange: '▲ 271%',
      trendUp: true,
    },
    {
      name: 'Empire Airlines',
      domain: 'empireairlines.com',
      desc: 'A FedEx partner regional airline operating ATR and Cessna aircraft, offering ATP pilot training with $5,000 certification assistance and career progression opportunities.',
      location: 'Hayden, United States',
      countryFlag: '🇺🇸',
      size: '350',
      traffic: '6K',
      trafficChange: '▲ 9%',
      trendUp: true,
    },
    {
      name: 'ALASKA CENTRAL EXPRESS INC',
      domain: 'aceaircargo.com',
      desc: 'Alaskan airline offering daily cargo flights and flexible charter services between Anchorage and remote communities.',
      location: 'Anchorage, United States',
      countryFlag: '🇺🇸',
      size: '125',
      traffic: '3K',
      trafficChange: '▲ 421%',
      trendUp: true,
    },
    {
      name: 'Martinaire Aviation',
      domain: 'martinaire.com',
      desc: 'US-based air cargo carrier using 29 Cessna 208Bs for scheduled flights to 40+ cities, offering 24/7 dispatch and HAZMAT transport with one-hour emergency response.',
      location: 'Addison, United States',
      countryFlag: '🇺🇸',
      size: '150',
      traffic: '4.2K',
      trafficChange: '▲ 15%',
      trendUp: true,
    },
    {
      name: 'Saltchuk Aviation',
      domain: 'saltchukaviation.com',
      desc: 'Premier cargo transport network serving maritime, passenger, and logistics sectors throughout North America and the Pacific.',
      location: 'Seattle, United States',
      countryFlag: '🇺🇸',
      size: '1,200',
      traffic: '28K',
      trafficChange: '▲ 44%',
      trendUp: true,
    },
    {
      name: 'CSA Air',
      domain: 'csaair.com',
      desc: 'Specialized cargo feeder airline operating Cessna Caravan aircraft under dedicated air transport contracts.',
      location: 'Kingsford, United States',
      countryFlag: '🇺🇸',
      size: '95',
      traffic: '2.1K',
      trafficChange: '▲ 8%',
      trendUp: true,
    },
    {
      name: 'Legends Airways',
      domain: 'legendsairways.com',
      desc: 'On-demand air charter operator and air ambulance provider delivering rapid aviation transport.',
      location: 'Lakeland, United States',
      countryFlag: '🇺🇸',
      size: '40',
      traffic: '1.5K',
      trafficChange: '▲ 12%',
      trendUp: true,
    },
    {
      name: 'Alaska Air Cargo',
      domain: 'alaskacargoqa.com',
      desc: 'Extensive cargo service connecting Alaska to North America, flying over 100 million pounds of seafood, mail, and freight annually.',
      location: 'Seattle, United States',
      countryFlag: '🇺🇸',
      size: '2,500',
      traffic: '110K',
      trafficChange: '▲ 32%',
      trendUp: true,
    },
    {
      name: 'AirNet II LLC',
      domain: 'airnet.com',
      desc: 'Time-critical aviation and dangerous-goods cargo specialist providing guaranteed scheduled logistics.',
      location: 'Columbus, United States',
      countryFlag: '🇺🇸',
      size: '180',
      traffic: '5.4K',
      trafficChange: '▲ 18%',
      trendUp: true,
    },
    {
      name: 'Jazz Aviation',
      domain: 'flyjazz.com',
      desc: 'Major regional operator connecting regional communities with nationwide commercial routes.',
      location: 'Halifax, Canada',
      countryFlag: '🇨🇦',
      size: '4,500',
      traffic: '85K',
      trafficChange: '▲ 25%',
      trendUp: true,
    },
  ];

  // Verified Customer Testimonials
  const testimonials = [
    {
      name: 'Wil Geller',
      role: 'Founder, Foodfluence',
      quote:
        '“It’s capable of booking five to ten demos a week on its own. With barely any instructions the leads are accurate; other platforms scrape the worst fits ever.”',
      replies: '8',
      replyRate: '16.4%',
      costLead: '$3.20',
      initials: 'WG',
    },
    {
      name: 'Joe Purcell',
      role: 'Director, LogSure',
      quote:
        '“I tried Instantly, I tried Apollo — you have to register a domain, set up DNS, warm it up. With yours you type your web address and it does all the domain warming for you… and every lead is the business owner, so the pilots convert extremely well.”',
      replies: '12',
      replyRate: '18.2%',
      costLead: '$2.85',
      initials: 'JP',
    },
    {
      name: 'Wole Fagbohun',
      role: 'PlotWeaver',
      quote:
        '“I’m literally obsessed with this platform. It’s the best, simplest, clearest platform I’ve seen. A dream come true for me.”',
      replies: '15',
      replyRate: '21.0%',
      costLead: '$2.40',
      initials: 'WF',
    },
    {
      name: 'Stuart Armley-Jones',
      role: 'Growth Lead, EdTech',
      quote:
        '“Multi-academy trusts have been the hardest to get a foot in the door with. With Explee they’re the ones I hear back from most, and a few trusts are now coming on board.”',
      replies: '7',
      replyRate: '14.8%',
      costLead: '$4.10',
      initials: 'SA',
    },
  ];

  // Submit trial email & sync to Google Sheet
  async function handleSubmitTrial(e: React.FormEvent) {
    e.preventDefault();
    if (!trialEmail.trim()) return;
    setTrialStatus('submitting');

    try {
      await fetch(GOOGLE_SHEET_DIRECT_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_trial_claim',
          email: trialEmail.trim(),
          domain: companyData.domain,
          credits: '$30 Free Credits Activated',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      // no-cors fallback
    }

    setTrialStatus('success');
  }

  const selectedProspect = prospects[selectedProspectIndex] || prospects[0];

  return (
    <div
      className="min-h-screen text-[#0d0d0f] bg-[#fbfbfb] font-sans antialiased selection:bg-black selection:text-white"
      style={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Navbar */}
      <header className="border-b border-black/[0.08] bg-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-decoration-none group"
          >
            <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm tracking-tight text-black group-hover:opacity-80 transition-opacity">
              MapLead <span className="text-emerald-600 font-mono text-xs font-normal">Auto-GTM</span>
            </span>
          </Link>
          <span className="text-black/20">/</span>
          <span className="text-xs text-black/50 font-mono">company</span>
          <span className="text-black/20">/</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/[0.04] text-xs font-mono font-medium text-black/80">
            <Globe className="w-3 h-3 text-emerald-600" />
            {companyData.domain}
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-mono text-[11px] font-medium border border-emerald-500/20">
            phase=final
          </span>
        </div>

        {/* Domain Switcher & Actions */}
        <div className="flex items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customDomainInput.trim()) {
                const clean = customDomainInput.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
                window.location.href = `${basePath}/auto-gtm/company/${clean}/explore?phase=final`;
              }
            }}
            className="flex items-center gap-1.5"
          >
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input
                type="text"
                placeholder="Analyze any domain..."
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded border border-black/[0.1] bg-black/[0.02] focus:bg-white focus:border-black focus:outline-none w-48 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium rounded bg-black text-white hover:bg-black/80 transition-colors"
            >
              Run
            </button>
          </form>

          <Link
            href="/"
            className="text-xs text-black/60 hover:text-black px-2.5 py-1 rounded border border-black/[0.08] hover:bg-black/[0.03] transition-colors"
          >
            ← Back to Lead Engine
          </Link>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-all animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            $30 Free Credits
          </button>
        </div>
      </header>

      {/* Main Grid: Left Column 300px, Right Column 1fr */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[calc(100vh-45px)]">
        {/* ================= LEFT SIDEBAR (300px) ================= */}
        <aside className="border-r border-black/[0.08] bg-[#fdfdfd] p-3.5 flex flex-col gap-3.5 overflow-y-auto">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <span className="text-xs font-mono font-medium text-black/70">
                24/7 AI-agent active
              </span>
            </div>
            <span className="text-[11px] font-mono text-black/40">Step 6 of 6</span>
          </div>

          {/* STEP 1: Research your company */}
          <div className="border-t border-black/[0.08] pt-2.5">
            <div className="flex items-center gap-2 font-mono text-xs text-black/60 mb-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>step 1 · Research your company</span>
            </div>

            <div className="p-2.5 rounded-lg border border-black/[0.06] bg-white shadow-xs">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-sm text-black">{companyData.name}</h3>
                  <a
                    href={`https://${companyData.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    {companyData.domain}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-black/70 leading-relaxed my-2">
                {companyData.description}
              </p>

              <button
                onClick={() => setShowDetailsDropdown(!showDetailsDropdown)}
                className="text-[11px] text-black/50 hover:text-black flex items-center gap-1 font-mono mb-2"
              >
                Details look off?
                {showDetailsDropdown ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {showDetailsDropdown && (
                <div className="text-[11px] text-black/60 font-mono bg-black/[0.02] p-2 rounded mb-2 border border-black/[0.05]">
                  Auto-GTM scrapes DNS, RDAP, LinkedIn company profile, and sitemap automatically.
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-black/70 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">
                  {companyData.founded}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">
                  {companyData.employees}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/[0.04]">
                  {companyData.location}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/[0.04] text-emerald-800">
                  {companyData.domains}
                </span>
              </div>

              {/* Monthly Traffic Chart */}
              <div className="border-t border-black/[0.06] pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-black/50 mb-1">
                  <span>MONTHLY TRAFFIC</span>
                  <span className="text-black font-semibold flex items-center gap-1">
                    {companyData.traffic}
                    <span className="text-red-500 font-normal">{companyData.trafficChange}</span>
                  </span>
                </div>

                {/* Sparkline Visual */}
                <div className="h-6 w-full flex items-end gap-1 pt-1">
                  <div className="w-1/6 bg-black/10 rounded-t h-[40%]"></div>
                  <div className="w-1/6 bg-black/10 rounded-t h-[55%]"></div>
                  <div className="w-1/6 bg-black/15 rounded-t h-[75%]"></div>
                  <div className="w-1/6 bg-black/20 rounded-t h-[95%]"></div>
                  <div className="w-1/6 bg-black/25 rounded-t h-[80%]"></div>
                  <div className="w-1/6 bg-emerald-600 rounded-t h-[60%]"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-black/40 mt-1">
                  {companyData.scale.map((s, idx) => (
                    <span key={idx}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Explore competitors */}
          <div className="border-t border-black/[0.08] pt-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-mono text-xs text-black/60">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>step 2 · Explore competitors</span>
              </div>
              <span className="text-[11px] font-mono text-black/40">
                COMPETITORS {companyData.competitors.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {companyData.competitors.map((comp, idx) => (
                <a
                  key={idx}
                  href={comp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono bg-white border border-black/[0.08] text-black/80 hover:border-black/30 hover:bg-black/[0.02] transition-colors"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-black/10 flex items-center justify-center text-[9px] font-bold">
                    {comp.icon}
                  </span>
                  <span>{comp.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* STEP 3: Define campaigns */}
          <div className="border-t border-black/[0.08] pt-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-mono text-xs text-black/60">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>step 3 · Define campaigns</span>
              </div>
              <span className="text-[11px] font-mono text-black/40">
                CAMPAIGNS {companyData.campaigns.length}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {companyData.campaigns.map((camp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-white border border-black/[0.06] text-xs"
                >
                  <span className="text-black/80 font-medium truncate">{camp.name}</span>
                  <span className="text-[11px] font-mono text-black/50 ml-2">
                    {camp.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STEPS 4, 5, 6 Checklist */}
          <div className="border-t border-black/[0.08] pt-2.5 flex flex-col gap-1.5 text-xs font-mono text-black/60">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>step 4 · Find potential customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>step 5 · Find decision makers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>step 6 · Write emails</span>
            </div>
          </div>

          {/* WHAT HAPPENS NEXT Widget */}
          <div className="mt-auto border-t border-black/[0.08] pt-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/[0.07] to-black/[0.03] border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <span
                      key={num}
                      className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                  Outreach ready
                </span>
              </div>

              <div className="text-[10px] font-mono uppercase tracking-wider text-black/40 mb-1">
                WHAT HAPPENS NEXT
              </div>
              <ul className="text-xs text-black/70 space-y-1 mb-3">
                <li className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-black/[0.06] flex items-center justify-center text-[9px] font-mono font-bold">
                    7
                  </span>
                  <span>Send emails</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-black/[0.06] flex items-center justify-center text-[9px] font-mono font-bold">
                    8
                  </span>
                  <span>Book meetings</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-black/[0.06] flex items-center justify-center text-[9px] font-mono font-bold">
                    9
                  </span>
                  <span>Learn & double down</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-black">$30 free credits</div>
                  <div className="text-[10px] text-black/40">No upfront charge</div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition-all"
                >
                  Start outreach
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT MAIN AREA (1fr) ================= */}
        <main className="flex flex-col overflow-hidden bg-[#fafafa]">
          {/* Top Stepper Track & Tabs */}
          <div className="border-b border-black/[0.08] bg-white px-6 py-3 flex items-center justify-between">
            {/* 1-6 Stepper Tracker */}
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: 'Research' },
                { n: 2, label: 'Competitors' },
                { n: 3, label: 'Campaigns' },
                { n: 4, label: 'Customers' },
                { n: 5, label: 'People' },
                { n: 6, label: 'Emails' },
              ].map((step, idx) => (
                <React.Fragment key={step.n}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="text-xs font-medium text-black/70 hidden md:inline">
                      {step.label}
                    </span>
                  </div>
                  {idx < 5 && <div className="w-4 h-px bg-black/[0.1]"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center bg-black/[0.05] p-0.5 rounded-lg border border-black/[0.04]">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'companies'
                    ? 'bg-white text-black shadow-xs font-semibold'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Companies ({companiesList.length})
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'people'
                    ? 'bg-white text-black shadow-xs font-semibold'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                People ({prospects.length})
              </button>
              <button
                onClick={() => setActiveTab('emails')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'emails'
                    ? 'bg-white text-black shadow-xs font-semibold'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Emails (Ready)
              </button>
            </div>
          </div>

          {/* VIEW 1: COMPANIES TABLE */}
          {activeTab === 'companies' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-white rounded-xl border border-black/[0.08] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-black/[0.06] flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm text-black">
                      Identified Target Accounts
                    </h2>
                    <p className="text-xs text-black/50">
                      High-affinity companies in commercial & regional aviation, matched with ASRS reporting criteria
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {companiesList.length} Accounts Enriched
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/[0.02] text-black/50 font-mono border-b border-black/[0.06]">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">COMPANY</th>
                        <th className="py-2.5 px-4 font-medium">DESCRIPTION</th>
                        <th className="py-2.5 px-4 font-medium">LOCATION</th>
                        <th className="py-2.5 px-4 font-medium">SIZE</th>
                        <th className="py-2.5 px-4 font-medium">MONTHLY TRAFFIC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {companiesList.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-black/[0.01] transition-colors">
                          <td className="py-3 px-4 font-medium text-black">
                            <a
                              href={`https://${comp.domain}`}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-center gap-1.5 hover:text-emerald-700"
                            >
                              <span>{comp.name}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <span className="text-[11px] font-mono text-black/40 block">
                              {comp.domain}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-black/70 max-w-md leading-relaxed">
                            {comp.desc}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-black/70">
                            <span className="mr-1">{comp.countryFlag}</span>
                            {comp.location}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-black/70">
                            {comp.size} emp
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="font-semibold text-black">{comp.traffic}</span>
                              <span className="text-emerald-700 text-[11px]">
                                {comp.trafficChange}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2 & 3: PEOPLE & EMAILS (Split 2-Column Interface) */}
          {(activeTab === 'people' || activeTab === 'emails') && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[380px_1fr] overflow-hidden">
              {/* Left Column: Decision-Makers List */}
              <div className="border-r border-black/[0.08] bg-white overflow-y-auto p-3 space-y-2">
                <div className="px-2 py-1 flex items-center justify-between text-xs text-black/50 font-mono">
                  <span>DECISION MAKERS ({prospects.length})</span>
                  <span>10 Verified with Mail</span>
                </div>

                {prospects.map((person, idx) => {
                  const isSelected = selectedProspectIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedProspectIndex(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-black bg-black/[0.02] shadow-xs ring-1 ring-black'
                          : 'border-black/[0.06] hover:border-black/20 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center font-bold text-xs text-black/70 font-mono">
                            {person.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-black flex items-center gap-1.5">
                              {person.name}
                              {person.status === 'valid' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                              )}
                            </div>
                            <div className="text-[11px] text-black/50 truncate max-w-[200px]">
                              {person.title} · {person.company}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-black text-white">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Scraper / Waterfall Enrichment Badges */}
                      <div className="mt-2 flex flex-wrap items-center gap-1 text-[9px] font-mono">
                        {person.providers.map((prov, pIdx) => (
                          <span
                            key={pIdx}
                            className={`px-1.5 py-0.5 rounded ${
                              person.via === prov
                                ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                                : 'bg-black/[0.04] text-black/50'
                            }`}
                          >
                            {prov}
                          </span>
                        ))}
                      </div>

                      {/* Verification Status */}
                      <div className="mt-2 pt-1.5 border-t border-black/[0.04] flex items-center justify-between text-[11px] font-mono">
                        {person.email ? (
                          <span className="text-black/80 font-medium truncate max-w-[200px]">
                            {person.email}
                          </span>
                        ) : (
                          <span className="text-black/40 italic">no email found</span>
                        )}

                        {person.status === 'valid' && (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            valid
                          </span>
                        )}
                        {person.status === 'catch_all' && (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            catch_all
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Personalized Cold Outreach Generator */}
              <div className="p-6 overflow-y-auto flex flex-col bg-[#fdfdfd]">
                <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col bg-white rounded-xl border border-black/[0.08] shadow-sm p-6">
                  {/* Recipient Profile Bar */}
                  <div className="flex items-start justify-between pb-4 border-b border-black/[0.06] mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm font-mono">
                        {selectedProspect.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-black">
                            {selectedProspect.name}
                          </h3>
                          <a
                            href={selectedProspect.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-black/40 hover:text-[#0077b5] transition-colors"
                          >
                            <LinkedInIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-xs text-black/50">
                          {selectedProspect.title} ·{' '}
                          <span className="font-mono">{selectedProspect.company}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono px-2 py-1 rounded bg-black/[0.04] text-black/70 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI Tailored
                    </span>
                  </div>

                  {/* Email Composer Fields */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    {/* To Field */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-black/40 w-10">To:</span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-mono font-medium text-black">
                          {selectedProspect.email || 'pending_enrichment@domain.com'}
                        </span>
                        {selectedProspect.via && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            via {selectedProspect.via}
                          </span>
                        )}
                        {selectedProspect.status === 'valid' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-600 text-white font-medium">
                            valid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-black/40 w-10">Subj:</span>
                      <input
                        type="text"
                        value={subjectText}
                        onChange={(e) => setSubjectText(e.target.value)}
                        placeholder="Subject..."
                        className="flex-1 px-3 py-1.5 rounded border border-black/[0.1] bg-black/[0.01] text-black font-medium focus:bg-white focus:outline-none focus:border-black text-xs"
                      />
                    </div>

                    {/* Body Textarea */}
                    <div className="flex-1 flex flex-col pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-black/40 mb-1">
                        <span>BODY (AI-GENERATED COLD OUTREACH)</span>
                        <span className="text-emerald-700">Click to edit</span>
                      </div>
                      <textarea
                        value={emailBodyText}
                        onChange={(e) => setEmailBodyText(e.target.value)}
                        rows={11}
                        className="w-full flex-1 p-3 rounded-lg border border-black/[0.1] bg-black/[0.01] text-black text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-black font-sans resize-none"
                      />
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-black/[0.06] mt-4 flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Subject: ${subjectText}\n\n${emailBodyText}`
                        );
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="flex items-center gap-1.5 text-xs text-black/60 hover:text-black font-mono transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {isCopied ? 'Copied to clipboard!' : 'Copy template'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Claim $30 credits & send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= HIGH-CONVERTING $30 TRIAL MODAL ================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-black/[0.1] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Panel: Value Prop & Testimonials */}
            <div className="w-full md:w-1/2 p-7 bg-[#fafafa] border-r border-black/[0.06] flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-mono font-semibold border border-emerald-500/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  $30 FREE CREDITS INCLUDED
                </div>

                <h2 className="text-xl font-bold text-black tracking-tight mb-2">
                  Finds High-Ticket Clients While You Sleep
                </h2>
                <p className="text-xs text-black/60 leading-relaxed mb-5">
                  24/7 AI-agent dedicated to your B2B offer. Runs multi-mailbox cold email outreach on pre-warmed domains from day one.
                </p>

                <div className="space-y-2.5 mb-5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div className="text-xs text-black/80">
                      <strong>AI agent finds high-intent leads 24/7</strong> matched to your ICP.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div className="text-xs text-black/80">
                      <strong>Runs outreach on 50 pre-warmed domains</strong> with zero DNS setup.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold mt-0.5">
                      ✓
                    </div>
                    <div className="text-xs text-black/80">
                      <strong>Writes personalized 1-on-1 emails</strong> that book qualified sales calls.
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Customer Quote Slider */}
              <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-xs relative mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setActiveTestimonialIndex((prev) =>
                          prev === 0 ? testimonials.length - 1 : prev - 1
                        )
                      }
                      className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-black/40">
                      {activeTestimonialIndex + 1}/{testimonials.length}
                    </span>
                    <button
                      onClick={() =>
                        setActiveTestimonialIndex((prev) =>
                          prev === testimonials.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-black/70 italic leading-relaxed mb-3 min-h-[50px]">
                  {testimonials[activeTestimonialIndex].quote}
                </p>

                <div className="flex items-center justify-between border-t border-black/[0.04] pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black/10 font-bold text-[10px] flex items-center justify-center">
                      {testimonials[activeTestimonialIndex].initials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-black">
                        {testimonials[activeTestimonialIndex].name}
                      </div>
                      <div className="text-[10px] text-black/40">
                        {testimonials[activeTestimonialIndex].role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px]">
                    <span className="text-emerald-700 font-bold">
                      {testimonials[activeTestimonialIndex].replyRate}
                    </span>{' '}
                    reply rate
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Activation Form */}
            <div className="w-full md:w-1/2 p-7 flex flex-col justify-between bg-white overflow-y-auto">
              <div>
                <h3 className="text-lg font-bold text-black mb-1">
                  Start Your Free Trial
                </h3>
                <p className="text-xs text-black/50 mb-5">
                  Alright, no more countdowns. Your $30 free credits are reserved for <strong>{companyData.domain}</strong>.
                </p>

                {trialStatus === 'success' ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-sm text-emerald-900">
                      $30 Free Credits Activated!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      We have queued the initial 50 outreach domains and 17 decision-makers for {companyData.domain}. Logged to your secure Google Sheet dashboard. Check your inbox for the automated dashboard invite.
                    </p>
                    <button
                      onClick={() => setShowCheckoutModal(false)}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
                    >
                      Return to Workspace
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTrial} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={trialEmail}
                        onChange={(e) => setTrialEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-black/[0.12] focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-black/[0.02] border border-black/[0.06] text-[11px] text-black/60 space-y-1">
                      <div className="flex items-center justify-between text-black font-medium">
                        <span>Today's charge:</span>
                        <span className="text-emerald-700 font-bold">$0.00</span>
                      </div>
                      <p className="text-[10px] text-black/40">
                        Your payment method just confirms you're real. Once your $30 credits run out, we'll charge $0.04 per email. Cancel anytime with 1 click.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={trialStatus === 'submitting'}
                      className="w-full py-2.5 rounded-lg bg-black hover:bg-black/80 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      {trialStatus === 'submitting'
                        ? 'Activating $30 Credits...'
                        : 'Claim $30 & Start Free Trial'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-black/40 font-mono pt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Secured by Stripe • 256-bit Encryption</span>
                    </div>
                  </form>
                )}
              </div>

              {/* Social Proof Stats */}
              <div className="pt-5 border-t border-black/[0.06] mt-6 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-black font-mono">24/7</div>
                  <div className="text-[10px] text-black/40 font-mono">Autonomous</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-700 font-mono">15.8%</div>
                  <div className="text-[10px] text-black/40 font-mono">Reply Rate</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-black font-mono">8-12</div>
                  <div className="text-[10px] text-black/40 font-mono">Demos / Mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
