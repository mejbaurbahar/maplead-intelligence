'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Globe,
  MapPin,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Star,
  Copy,
  Send,
  Users,
  Target,
  Building2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Flame,
  RefreshCw,
  Play,
  Pause,
  Calendar,
  Mail,
  Phone,
  ArrowRight,
  Lock,
  Check,
  Layers,
  Activity,
  FileText,
  Sliders,
  Eye,
  CheckCheck,
  Clock,
  Radio,
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

// 9 Standard GTM Steps
const GTM_STEPS = [
  { id: 1, name: 'Recon & Intake', short: '1. Recon', desc: 'Domain analysis & tech stack extraction' },
  { id: 2, name: 'Company & Traffic', short: '2. Traffic', desc: 'Firmographics & 6-month traffic telemetry' },
  { id: 3, name: 'Competitor Radar', short: '3. Competitors', desc: 'Rival discovery & positioning matrix' },
  { id: 4, name: 'ICP Campaigns', short: '4. Campaigns', desc: '6 High-converting targeted ICP segments' },
  { id: 5, name: 'Target Accounts', short: '5. Accounts', desc: '10 High-intent accounts mapped to ICP' },
  { id: 6, name: 'Decision Makers', short: '6. People', desc: 'Waterfall verification via Hunter, LeadMagic, etc.' },
  { id: 7, name: 'AI Value Pitch', short: '7. Pitch', desc: 'Autonomous personalized cold email composer' },
  { id: 8, name: 'Omnichannel Drip', short: '8. Sequence', desc: '4-touch email & LinkedIn sequence simulator' },
  { id: 9, name: 'Inbox & CRM Sync', short: '9. Sync', desc: 'AI reply triage & Google Sheet automated sync' },
];

// Mock Google Maps Lead Discovery
const MOCK_MAPS_BUSINESSES = [
  {
    name: 'Apex Aviation Systems & Charter',
    domain: 'apexaviation.co.uk',
    rating: 4.9,
    reviews: 142,
    location: 'London Heathrow, UK',
    phone: '+44 20 7946 0831',
    category: 'Commercial Aviation & Training',
    monthlyVisitors: '185K',
  },
  {
    name: 'Skymesh Tech Logistics Group',
    domain: 'skymeshlogistics.com',
    rating: 4.8,
    reviews: 215,
    location: 'Austin, TX, USA',
    phone: '+1 512 555 0192',
    category: 'Air Freight & Cargo Logistics',
    monthlyVisitors: '420K',
  },
  {
    name: 'Consolto Remote Video Suite',
    domain: 'consolto.com',
    rating: 4.7,
    reviews: 388,
    location: 'San Francisco, CA, USA',
    phone: '+1 415 555 2671',
    category: 'B2B Video Conferencing & Booking',
    monthlyVisitors: '680K',
  },
  {
    name: 'Global Flight Deck Intelligence',
    domain: 'globalflightdeck.com',
    rating: 4.9,
    reviews: 94,
    location: 'Frankfurt, Germany',
    phone: '+49 69 950 1200',
    category: 'Aviation Safety Software',
    monthlyVisitors: '95K',
  },
];

export default function AutoGtmClient({ domain }: { domain: string }) {
  const initialDomain = (domain || 'nasa.gov').toLowerCase();

  // Active step in the 9-step pipeline (1 to 9)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [targetDomain, setTargetDomain] = useState<string>(initialDomain);
  const [customDomainInput, setCustomDomainInput] = useState<string>(initialDomain);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Search mode: 'domain' or 'maps'
  const [inputMode, setInputMode] = useState<'domain' | 'maps'>('domain');
  const [mapsKeyword, setMapsKeyword] = useState('Aviation Software & Safety');
  const [mapsLocation, setMapsLocation] = useState('London, UK');
  const [discoveredMapsLeads, setDiscoveredMapsLeads] = useState(MOCK_MAPS_BUSINESSES);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);

  // Sub-tab selection for Step 5 & 6
  const [activeTab, setActiveTab] = useState<'companies' | 'people' | 'emails'>('people');
  const [selectedProspectIndex, setSelectedProspectIndex] = useState(2); // Amine Zefzafy
  const [selectedWaterfallFilter, setSelectedWaterfallFilter] = useState<'ALL' | 'HUNTER' | 'LEADMAGIC' | 'FINDYMAIL' | 'EXREACHER'>('ALL');
  const [selectedTone, setSelectedTone] = useState<'Direct' | 'Data-Driven' | 'Consultative' | 'Executive Brief'>('Data-Driven');
  const [prospectSearchQuery, setProspectSearchQuery] = useState('');

  // Modals & Sheet Sync State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');
  const [trialStatus, setTrialStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<'synced' | 'syncing' | 'idle'>('synced');
  const [syncHistory, setSyncHistory] = useState<Array<{ time: string; event: string; target: string }>>([
    { time: '09:15 AM', event: 'Domain Recon Completed', target: 'nasa.gov' },
    { time: '09:16 AM', event: '17 Decision Makers Verified', target: '4 Waterfall Providers' },
    { time: '09:18 AM', event: 'Google Sheet Auto-Sync Active', target: 'Tab: GTM_Leads' },
  ]);

  // Testimonials Carousel
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const testimonials = [
    {
      name: 'Wil Geller',
      company: 'Foodfluence',
      role: 'Founder & Head of Growth',
      replyRate: '16.4% Reply Rate',
      quote:
        'Replaced 3 separate enrichment tools and an outsourced SDR agency with an automated engine that actually lands in primary decision-maker inboxes.',
      avatar: 'WG',
    },
    {
      name: 'Joe Purcell',
      company: 'Skymesh Systems',
      role: 'Head of Outbound Demand Gen',
      replyRate: '18.2% Reply Rate',
      quote:
        'The waterfall verification across Hunter and LeadMagic stopped our domain burn. We booked 28 qualified enterprise meetings in our first 14 days.',
      avatar: 'JP',
    },
    {
      name: 'Wole Fagbohun',
      company: 'PlotWeaver',
      role: 'VP Sales Operations',
      replyRate: '21.0% Reply Rate',
      quote:
        'The autonomous pitch generation matches our technical value proposition perfectly. Prospects reply thinking our founders hand-wrote every word.',
      avatar: 'WF',
    },
  ];

  // 17 Real Decision Makers from Explee with Waterfall providers
  const prospects = useMemo(
    () => [
      {
        initials: 'AN',
        name: 'Aaron Nelan',
        title: 'First Officer',
        company: 'aircargocarriers.com',
        providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
        email: null,
        status: 'no_email',
        via: null,
        deliverability: '0%',
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
        deliverability: '0%',
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
        deliverability: '99.2%',
        linkedin: 'https://linkedin.com/in/amine-zefzafy-b81568167',
        subject: 'Safety reporting and immunity for flight crews',
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
        deliverability: '98.5%',
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
        deliverability: '0%',
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
        deliverability: '99.0%',
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
        deliverability: '0%',
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
        deliverability: '97.8%',
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
        deliverability: '0%',
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
        deliverability: '98.9%',
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
        deliverability: '94.0%',
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
        deliverability: '99.5%',
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
        deliverability: '98.7%',
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
        deliverability: '0%',
        linkedin: 'https://linkedin.com/in/brandon-maso',
        subject: 'Commercial cargo fleet incident tracking',
        pitch: `Hi Brandon,\n\nManaging tight turnarounds on B767 freighters requires early detection of ramp and dispatch conflicts.\n\nNASA ASRS enables flight crew members to log issues without fear of carrier or FAA repercussions.\n\nWould a quick guide on ASRS electronic filing be helpful for ABX Air crews?\n\nBest,\nNASA ASRS Flight Team`,
      },
      {
        initials: 'BJ',
        name: 'Brett Jackson',
        title: 'Captain',
        company: 'solairus.com',
        providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
        email: 'bjackson@solairus.com',
        status: 'valid',
        via: 'hunter',
        deliverability: '99.1%',
        linkedin: 'https://linkedin.com/in/brett-jackson',
        subject: 'Business aviation safety protocols for Solairus',
        pitch: `Hi Brett,\n\nPrivate aviation clients expect flawless execution and the highest safety margins.\n\nNASA ASRS gives corporate captains a direct pipeline to confidential hazard mitigation and FAA advisory updates.\n\nCould I share a 1-page executive summary on how Part 135 and Part 91 operators maximize ASRS benefits?\n\nBest regards,\nAaron\nNASA ASRS`,
      },
      {
        initials: 'BR',
        name: 'Brian Ray',
        title: 'First Officer - Falcon 900',
        company: 'planetnine.com',
        providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
        email: 'brian.ray@planetnine.com',
        status: 'catch_all',
        via: 'exreacher',
        deliverability: '93.2%',
        linkedin: 'https://linkedin.com/in/brian-ray',
        subject: 'Ultra-long-range business jet hazard reporting',
        pitch: `Hi Brian,\n\nFlying Falcon 900s trans-oceanic involves non-standard airspace transitions and rapid weather changes.\n\nNASA ASRS provides confidential event filing that protects your credentials while informing international safety databases.\n\nWould you like a sample breakdown of recent corporate long-range incident reports?\n\nWarm regards,\nAaron`,
      },
      {
        initials: 'BS',
        name: 'Bryan Schierman',
        title: 'Captain',
        company: 'ameriflight.com',
        providers: ['hunter', 'exreacher', 'findymail', 'leadmagic'],
        email: 'bschierman@ameriflight.com',
        status: 'valid',
        via: 'hunter',
        deliverability: '99.3%',
        linkedin: 'https://linkedin.com/in/bryan-schierman',
        subject: 'Feeder cargo flight safety optimization',
        pitch: `Hi Bryan,\n\nAmeriflight's feeder network operates high-frequency night segments where weather and fatigue are major factors.\n\nNASA ASRS offers confidential reporting with FAA enforcement waiver protections, helping carriers identify operational risks early.\n\nWould you be open to receiving our quarterly feeder aviation safety bulletin?\n\nBest,\nAaron\nNASA ASRS`,
      },
    ],
    []
  );

  // 10 High-Intent Target Companies
  const companies = [
    {
      name: 'Delta Air Lines Safety Ops',
      domain: 'delta.com',
      industry: 'Commercial Aviation',
      desc: 'Commercial airline operating global hub network with strict SMS requirements.',
      location: 'Atlanta, GA',
      flag: '🇺🇸',
      size: '100,000+ emp',
      traffic: '48.2M',
      trafficTrend: '+4.8%',
      prospectsCount: 3,
    },
    {
      name: 'United Airlines Flight Ops',
      domain: 'united.com',
      industry: 'Commercial Aviation',
      desc: 'Major transatlantic and domestic flag carrier focusing on pilot voluntary reporting.',
      location: 'Chicago, IL',
      flag: '🇺🇸',
      size: '95,000+ emp',
      traffic: '44.5M',
      trafficTrend: '+3.2%',
      prospectsCount: 2,
    },
    {
      name: 'FedEx Express Air Safety',
      domain: 'fedex.com',
      industry: 'Air Freight & Logistics',
      desc: 'Global cargo airline operating large widebody freighter fleet worldwide.',
      location: 'Memphis, TN',
      flag: '🇺🇸',
      size: '500,000+ emp',
      traffic: '72.1M',
      trafficTrend: '+1.5%',
      prospectsCount: 2,
    },
    {
      name: 'CAE Civil Aviation Training',
      domain: 'cae.com',
      industry: 'Aviation Training',
      desc: 'World leader in civil aviation flight simulators, training centers, and SMS tools.',
      location: 'Montreal, QC',
      flag: '🇨🇦',
      size: '13,000+ emp',
      traffic: '1.8M',
      trafficTrend: '+8.4%',
      prospectsCount: 1,
    },
    {
      name: 'Lufthansa Systems Flight Deck',
      domain: 'lhsystems.com',
      industry: 'Aviation Software',
      desc: 'Airline IT and flight deck optimization provider deploying modern EFB workflows.',
      location: 'Frankfurt, Germany',
      flag: '🇩🇪',
      size: '2,800+ emp',
      traffic: '890K',
      trafficTrend: '-2.1%',
      prospectsCount: 2,
    },
    {
      name: 'FlightSafety International',
      domain: 'flightsafety.com',
      industry: 'Aviation Training',
      desc: 'Premier professional aviation training company for business and commercial pilots.',
      location: 'New York, NY',
      flag: '🇺🇸',
      size: '4,500+ emp',
      traffic: '640K',
      trafficTrend: '+5.7%',
      prospectsCount: 1,
    },
    {
      name: 'NetJets Aviation Ops',
      domain: 'netjets.com',
      industry: 'Business Aviation',
      desc: 'Worlds largest private jet operator providing fractional aircraft ownership.',
      location: 'Columbus, OH',
      flag: '🇺🇸',
      size: '8,000+ emp',
      traffic: '2.4M',
      trafficTrend: '+12.3%',
      prospectsCount: 2,
    },
    {
      name: 'Dallas Fort Worth Airport Operations',
      domain: 'dfwairport.com',
      industry: 'Airport Management',
      desc: 'Major air hub managing complex multi-runway operations and ramp safety alerts.',
      location: 'Dallas, TX',
      flag: '🇺🇸',
      size: '2,000+ emp',
      traffic: '3.1M',
      trafficTrend: '+6.9%',
      prospectsCount: 1,
    },
    {
      name: 'Embry-Riddle Aeronautical Flight Dept',
      domain: 'erau.edu',
      industry: 'Higher Education & Aviation',
      desc: 'Renowned aeronautical university operating high-volume collegiate flight fleets.',
      location: 'Daytona Beach, FL',
      flag: '🇺🇸',
      size: '3,200+ emp',
      traffic: '2.9M',
      trafficTrend: '-0.8%',
      prospectsCount: 1,
    },
    {
      name: 'Atlas Air Worldwide',
      domain: 'atlasair.com',
      industry: 'Air Freight Charter',
      desc: 'Major provider of outsourced aircraft and aviation operating services.',
      location: 'Purchase, NY',
      flag: '🇺🇸',
      size: '5,000+ emp',
      traffic: '780K',
      trafficTrend: '+3.4%',
      prospectsCount: 1,
    },
  ];

  // 6 Targeted ICP Campaigns
  const campaigns = [
    {
      name: 'Airline Pilots & Crew',
      share: '22%',
      leadsCount: '1.2K',
      valueProp: 'Confidential reporting with FAA enforcement waiver & de-identified safety intelligence.',
      pain: 'Fear of regulatory penalties and career jeopardy when reporting near-miss incidents.',
      criteria: ['Commercial Part 121 / 135 pilots', 'Active turbine aircraft flight deck', 'Operates in FAA / EASA airspace'],
    },
    {
      name: 'Flight Safety Directors & SMS Teams',
      share: '20%',
      leadsCount: '700',
      valueProp: 'Automated telemetry ingestion connecting confidential crew reports to SMS databases.',
      pain: 'Under-reporting of human factors bottlenecks and slow hazard mitigation cycle times.',
      criteria: ['Director or VP of Aviation Safety', 'Airline or Corporate Flight Dept', 'Dedicated SMS software stack'],
    },
    {
      name: 'Cargo & Ad-Hoc Freight Operators',
      share: '18%',
      leadsCount: '850',
      valueProp: 'Night & all-weather approach hazard bulletins tailored for freight aircraft.',
      pain: 'Severe schedule volatility, unmonitored fatigue, and non-standard airfields.',
      criteria: ['Part 121 cargo airline', 'Widebody or feeder turboprop fleets', 'Global night routes'],
    },
    {
      name: 'Helicopter & Utility Aviation Crews',
      share: '15%',
      leadsCount: '620',
      valueProp: 'Low-altitude terrain & obstacle telemetry for rotorcraft and air ambulance teams.',
      pain: 'High incident fatality rates in remote terrain, wire strikes, and sudden weather shifts.',
      criteria: ['Emergency Medical Services (EMS)', 'Offshore / Utility rotorcraft', 'Part 135 certificate'],
    },
    {
      name: 'Business Aviation & Fractional Fleets',
      share: '13%',
      leadsCount: '510',
      valueProp: 'VIP executive passenger safety benchmarking with zero reputational exposure.',
      pain: 'High client confidentiality requirements preventing open industry incident sharing.',
      criteria: ['Fractional or Charter fleet (NetJets, Flexjet)', 'Gulfstream, Global, Falcon aircraft', 'IS-BAO Stage 2 or 3 certified'],
    },
    {
      name: 'Flight Training Academies & Universities',
      share: '12%',
      leadsCount: '480',
      valueProp: 'Early safety culture onboarding for student aviators and instructional staff.',
      pain: 'High student pilot turnover leading to recurrent ground damage and airspace busts.',
      criteria: ['Collegiate flight school or 141 academy', '50+ training aircraft', 'Full-time safety manager on staff'],
    },
  ];

  // 7 Direct Competitors
  const competitors = [
    { name: 'safecom.gov', domain: 'safecom.gov', traffic: '450K', overlap: '88%' },
    { name: 'atsapsafety.org', domain: 'atsapsafety.org', traffic: '120K', overlap: '74%' },
    { name: 'aviationreporting.eu', domain: 'aviationreporting.eu', traffic: '95K', overlap: '68%' },
    { name: 'c-space.jp', domain: 'c-space.jp', traffic: '210K', overlap: '52%' },
    { name: 'international-space-agency.org', domain: 'international-space-agency.org', traffic: '1.4M', overlap: '61%' },
    { name: 'nami.org', domain: 'nami.org', traffic: '3.2M', overlap: '44%' },
    { name: 'thespaceportcompany.com', domain: 'thespaceportcompany.com', traffic: '80K', overlap: '39%' },
  ];

  // Filtered prospects
  const filteredProspects = prospects.filter((p) => {
    const matchesWaterfall =
      selectedWaterfallFilter === 'ALL' ||
      (selectedWaterfallFilter === 'HUNTER' && (p.via === 'hunter' || p.providers.includes('hunter'))) ||
      (selectedWaterfallFilter === 'LEADMAGIC' && (p.via === 'leadmagic' || p.providers.includes('leadmagic'))) ||
      (selectedWaterfallFilter === 'FINDYMAIL' && (p.via === 'findymail' || p.providers.includes('findymail'))) ||
      (selectedWaterfallFilter === 'EXREACHER' && (p.via === 'exreacher' || p.providers.includes('exreacher')));

    const matchesSearch =
      !prospectSearchQuery ||
      p.name.toLowerCase().includes(prospectSearchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(prospectSearchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(prospectSearchQuery.toLowerCase());

    return matchesWaterfall && matchesSearch;
  });

  const activeProspect = prospects[selectedProspectIndex] || prospects[0];

  // Auto-play simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setCurrentStep((s) => (s < 9 ? s + 1 : 1));
            return 0;
          }
          return prev + 20;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handler: Run new domain
  const handleRunDomain = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customDomainInput.trim()) return;
    const cleanDomain = customDomainInput.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
    setTargetDomain(cleanDomain);
    setCurrentStep(1);
    setSyncHistory((prev) => [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Started Intake Recon', target: cleanDomain },
      ...prev,
    ]);
  };

  // Handler: Maps lead selection
  const handleSelectMapsLead = (lead: typeof MOCK_MAPS_BUSINESSES[0]) => {
    setCustomDomainInput(lead.domain);
    setTargetDomain(lead.domain);
    setInputMode('domain');
    setCurrentStep(1);
    setSyncHistory((prev) => [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Imported from Maps Lead Radar', target: lead.domain },
      ...prev,
    ]);
  };

  // Handler: Claim Trial & Log to Google Sheet
  const handleClaimTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialEmail) return;
    setTrialStatus('submitting');
    try {
      await fetch(GOOGLE_SHEET_DIRECT_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trial_claim',
          email: trialEmail,
          domain: targetDomain,
          timestamp: new Date().toISOString(),
          status: 'ACTIVE_30_CREDITS',
          step: currentStep,
          leadsQueued: 17,
        }),
      });
      setTrialStatus('success');
      setSyncHistory((prev) => [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Logged to Google Sheet', target: trialEmail },
        ...prev,
      ]);
    } catch (err) {
      console.error('Sheet webhook failed', err);
      setTrialStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* ── TOP NAV BAR ──────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#0A0F1A]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            title="Return to Main Radar"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
              M
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight flex items-center gap-1.5 text-white">
                MapLead <span className="text-emerald-400">Autonomous GTM</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  v3.4
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous B2B Lead Intelligence & Multi-Channel Engine
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Intake Mode Switcher & Input */}
        <div className="flex items-center gap-2 max-w-xl w-full">
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs font-medium">
            <button
              onClick={() => setInputMode('domain')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                inputMode === 'domain' ? 'bg-emerald-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Direct Domain
            </button>
            <button
              onClick={() => setInputMode('maps')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                inputMode === 'maps' ? 'bg-emerald-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Google Maps Radar
            </button>
          </div>

          {inputMode === 'domain' ? (
            <form onSubmit={handleRunDomain} className="flex-1 flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-emerald-500/50 transition-colors">
              <Globe className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                placeholder="Enter target website, e.g. nasa.gov or consolto.com"
                className="bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none w-full"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                Scan <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={mapsKeyword}
                onChange={(e) => setMapsKeyword(e.target.value)}
                placeholder="Niche (e.g. Dentists, Aviation)"
                className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none w-1/2"
              />
              <input
                type="text"
                value={mapsLocation}
                onChange={(e) => setMapsLocation(e.target.value)}
                placeholder="City (e.g. London, Austin)"
                className="bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none w-1/2"
              />
            </div>
          )}
        </div>

        {/* Right Action: Sheet Sync & $30 Free Credits CTA */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sheet Auto-Sync Active
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>$30 Free Credits</span>
          </button>
        </div>
      </header>

      {/* ── 9-STEP PIPELINE PROGRESS STEPPER ───────────────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#0A0F1A]/50 px-4 py-2.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-[900px]">
          {/* Stepper buttons */}
          <div className="flex items-center gap-1.5 flex-1">
            {GTM_STEPS.map((step) => {
              const isPast = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all border ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold shadow-sm'
                      : isPast
                      ? 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/20'
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPast ? '✓' : step.id}
                  </span>
                  <span className="whitespace-nowrap">{step.name}</span>
                </button>
              );
            })}
          </div>

          {/* Auto-Play Toggle */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10 shrink-0">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isAutoPlaying ? 'Pause Agent' : 'Auto-Run 24/7 Agent'}
            </button>
          </div>
        </div>
      </div>

      {/* ── GOOGLE MAPS RADAR DRAWER (When Mode = Maps) ───────────────── */}
      {inputMode === 'maps' && (
        <section className="bg-slate-950/90 border-b border-emerald-500/20 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  Local B2B Business Discovery (Google Maps Engine)
                </h3>
                <span className="text-xs text-slate-400">
                  Showing businesses for &quot;{mapsKeyword}&quot; in &quot;{mapsLocation}&quot;
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">
                Click any business to auto-feed website into 9-Step GTM Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {discoveredMapsLeads.map((lead, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectMapsLead(lead)}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-850 cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/15 transition-all" />
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {lead.name}
                    </h4>
                    <span className="flex items-center gap-0.5 text-[11px] font-mono text-amber-400 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {lead.rating}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span className="text-emerald-400 font-mono underline">{lead.domain}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{lead.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                    <span>{lead.reviews} Google Reviews</span>
                    <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Launch GTM &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN WORKSPACE (2-COLUMN DYNAMIC LAYOUT) ────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: 300px Company Context & Quick Stats (lg:col-span-4) */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Company Brief Card */}
          <div className="p-4 rounded-2xl bg-[#0C1220] border border-white/[0.08] relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Target Company Recon
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                Step {currentStep} of 9
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {targetDomain.includes('nasa') ? 'NASA ASRS' : targetDomain}
                </h2>
                <a
                  href={`https://${targetDomain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  {targetDomain} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                {targetDomain.includes('nasa') ? '🇺🇸 Moffett Field' : 'Global B2B'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {targetDomain.includes('nasa')
                ? "NASA's Aviation Safety Reporting System (ASRS) operates the FAA's voluntary, confidential safety incident reporting system, capturing critical human factors data across air traffic management, flight crews, and ground operations."
                : `Autonomous B2B intelligence scanned ${targetDomain}. Analyzing high-ticket ICP opportunities, technological stack, decision-maker org charts, and competitors.`}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 text-[11px] text-slate-300">
                Founded 1976
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 text-[11px] text-slate-300">
                3.2K emp
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 text-[11px] text-slate-300">
                Federal Aviation
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                50 Outreach Domains
              </span>
            </div>

            {/* Monthly Traffic Snapshot Chart */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">Monthly Web Traffic</span>
                <span className="text-emerald-400 font-mono font-semibold">25.6M /mo (▲ 12%)</span>
              </div>
              {/* Traffic Bars */}
              <div className="flex items-end gap-1.5 h-14 pt-2">
                {[
                  { month: 'May', height: '40%', val: '18M' },
                  { month: 'Jun', height: '55%', val: '21M' },
                  { month: 'Jul', height: '65%', val: '23M' },
                  { month: 'Aug', height: '50%', val: '19M' },
                  { month: 'Sep', height: '75%', val: '24M' },
                  { month: 'Oct', height: '90%', val: '25.6M' },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar relative">
                    <div
                      style={{ height: bar.height }}
                      className={`w-full rounded-t transition-all ${
                        i === 5
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                    <span className="text-[9px] text-slate-500">{bar.month}</span>
                    <div className="absolute -top-7 hidden group-hover/bar:block bg-slate-950 border border-white/10 text-[10px] font-mono px-1.5 py-0.5 rounded text-white z-10 whitespace-nowrap">
                      {bar.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Competitors & Campaign Pills */}
          <div className="p-4 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Competitor Universe</span>
              <span className="text-emerald-400 font-mono text-[11px]">7 Discovered</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {competitors.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 text-xs text-slate-300 hover:border-emerald-500/40 hover:text-white cursor-pointer transition-colors"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>High-Value ICP Segments</span>
              <span className="text-emerald-400 font-mono text-[11px]">6 Active</span>
            </h3>
            <div className="space-y-1.5">
              {campaigns.slice(0, 3).map((camp, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-300 font-medium truncate">{camp.name}</span>
                  <span className="text-emerald-400 font-mono text-[11px] shrink-0">{camp.share}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity & Google Sheet Sync Ledger */}
          <div className="p-4 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Live Engine Audit Log
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Google Sheet Sync</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              {syncHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-slate-500">{item.time}</span>
                  <span className="text-slate-200 truncate mx-2">{item.event}</span>
                  <span className="text-emerald-400 shrink-0">{item.target}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Interactive Step Content (lg:col-span-8) */}
        <main className="lg:col-span-8 flex flex-col gap-4">
          {/* STEP 1: RECON & INTAKE */}
          {currentStep === 1 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 1
                    </span>
                    Live Domain Reconnaissance & Extraction
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time automated crawl of {targetDomain} across DNS, SSL certificates, headers, and tech stack.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 2 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Recon Architecture Flowchart Diagram */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Autonomous Extraction Pipeline Diagram
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs text-center font-mono">
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 relative">
                    <div className="text-[10px] text-slate-500 mb-1">NODE 01</div>
                    <div className="font-semibold">DNS & WHOIS</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ Resolved 1976</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 relative">
                    <div className="text-[10px] text-slate-500 mb-1">NODE 02</div>
                    <div className="font-semibold">HTTP Scrape</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ 200 OK / SSL</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 relative">
                    <div className="text-[10px] text-slate-500 mb-1">NODE 03</div>
                    <div className="font-semibold">Tech Fingerprint</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ Next/Drupal/AWS</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 relative">
                    <div className="text-[10px] text-slate-500 mb-1">NODE 04</div>
                    <div className="font-semibold">ICP Classifier</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ B2B Aerospace</div>
                  </div>
                </div>
              </div>

              {/* Terminal Simulation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-slate-500">$ agent.recon.initiate(&quot;{targetDomain}&quot;)</div>
                <div className="text-emerald-400">✓ Target alive. SSL Certificate: Valid (DigiCert Global Root CA)</div>
                <div className="text-slate-300">→ Discovered 50 secondary outreach domains for warmup isolation.</div>
                <div className="text-slate-300">→ Discovered 17 decision makers across Flight Operations and Air Safety.</div>
                <div className="text-emerald-400">✓ Ingestion complete. Ready for Firmographic & Traffic Analysis.</div>
              </div>
            </div>
          )}

          {/* STEP 2: COMPANY INTELLIGENCE & TRAFFIC */}
          {currentStep === 2 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 2
                    </span>
                    Company Firmographics & Traffic Analytics
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Traffic volume, historical trends, geographic concentration, and organizational hierarchy.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 3 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <div className="text-slate-400 text-xs">Total Monthly Visits</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">25,600,000</div>
                  <div className="text-xs text-emerald-400 mt-0.5">▲ 12.4% vs last quarter</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <div className="text-slate-400 text-xs">Target Decision Makers</div>
                  <div className="text-xl font-bold text-white font-mono mt-1">17 Verified</div>
                  <div className="text-xs text-emerald-400 mt-0.5">0% bounce guarantee</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5">
                  <div className="text-slate-400 text-xs">Estimated Enterprise LTV</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">$14,500 - $35,000</div>
                  <div className="text-xs text-slate-400 mt-0.5">High-Ticket B2B Contract</div>
                </div>
              </div>

              {/* Geographic Breakdown Chart */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Geographic Traffic Origin Breakdown
                </div>
                <div className="space-y-2">
                  {[
                    { country: 'United States 🇺🇸', pct: '64%', leads: '16.4M' },
                    { country: 'United Kingdom 🇬🇧', pct: '14%', leads: '3.6M' },
                    { country: 'European Union 🇪🇺', pct: '12%', leads: '3.1M' },
                    { country: 'Canada & Australia 🇨🇦 🇦🇺', pct: '10%', leads: '2.5M' },
                  ].map((geo, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>{geo.country}</span>
                        <span className="font-mono text-emerald-400">{geo.pct} ({geo.leads})</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: geo.pct }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COMPETITOR RADAR */}
          {currentStep === 3 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 3
                    </span>
                    Competitor Radar & Positioning Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzing 7 market alternatives to uncover positioning gaps and unique value propositions.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 4 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {competitors.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{comp.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                        {comp.overlap} Overlap
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Monthly Traffic:</span>
                      <span className="font-mono text-white">{comp.traffic}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: comp.overlap }} className="bg-emerald-500 h-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CAMPAIGNS & ICP STRATEGY */}
          {currentStep === 4 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 4
                    </span>
                    Campaign & ICP Segmentation Strategy
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    6 Targeted ICP segments generated from company signals, ranked by win-probability.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 5 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {campaigns.map((camp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{camp.name}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {camp.share} Win Rate
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <span className="text-emerald-400 font-semibold">Value Prop: </span>
                      {camp.valueProp}
                    </div>

                    <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
                      <div className="text-rose-400 font-semibold mb-0.5">CORE PAIN:</div>
                      {camp.pain}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">ICP Criteria:</div>
                      {camp.criteria.map((c, i) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: TARGET ACCOUNTS DIRECTORY */}
          {currentStep === 5 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 5
                    </span>
                    10 High-Intent Target Accounts Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing accounts with fleet density and immediate outbound fit for {targetDomain}.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 6 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Account & Domain</th>
                      <th className="py-2.5 px-3">Industry Focus</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Employees</th>
                      <th className="py-2.5 px-3">Monthly Visits</th>
                      <th className="py-2.5 px-3">Verified Leads</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {companies.map((comp, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white">{comp.name}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">{comp.domain}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{comp.industry}</td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {comp.flag} {comp.location}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{comp.size}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-200">
                          {comp.traffic}{' '}
                          <span className={comp.trafficTrend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                            {comp.trafficTrend}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono text-[10px]">
                            {comp.prospectsCount} verified
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setCurrentStep(6)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium transition-colors"
                          >
                            View People &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 6: WATERFALL DECISION MAKERS */}
          {currentStep === 6 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 6
                    </span>
                    Waterfall Decision-Maker Enrichment
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Triple-verification cascade via Hunter &rarr; LeadMagic &rarr; Findymail &rarr; Exreacher.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(7)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                  >
                    Draft Cold Emails <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Waterfall Flowchart */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">PROVIDER CASCADE:</span>
                {(['ALL', 'HUNTER', 'LEADMAGIC', 'FINDYMAIL', 'EXREACHER'] as const).map((prov) => (
                  <button
                    key={prov}
                    onClick={() => setSelectedWaterfallFilter(prov)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      selectedWaterfallFilter === prov
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>

              {/* Prospects List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProspects.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedProspectIndex(idx);
                      setCurrentStep(7);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activeProspect.name === p.name
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-slate-900/80 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {p.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                            {p.name}
                            <a
                              href={p.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-emerald-400"
                            >
                              <LinkedInIcon className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{p.title}</div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          p.status === 'valid'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : p.status === 'catch_all'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 truncate mb-2">
                      {p.email || 'No business email found'}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                      <span>Via: {p.via || 'all waterfall searched'}</span>
                      <span className="text-emerald-400 font-semibold">Deliverability: {p.deliverability}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: AI PERSONALIZED PITCH COMPOSER */}
          {currentStep === 7 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 7
                    </span>
                    AI Personalized Value Pitch Composer
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tailored for {activeProspect.name} ({activeProspect.title} at {activeProspect.company}).
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  View Sequence Simulator <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tone Switcher */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Tone Profile:</span>
                {(['Direct', 'Data-Driven', 'Consultative', 'Executive Brief'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTone(t)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedTone === t
                        ? 'bg-emerald-500 text-slate-950 font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <span className="ml-auto text-emerald-400 font-mono text-xs">High-Open Score: 88%</span>
              </div>

              {/* Subject Line */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-mono uppercase">Subject Line (Personalized)</label>
                <input
                  type="text"
                  defaultValue={activeProspect.subject}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Email Body (Grounding in ASRS voluntary incident signals)</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">{'{{firstName}}'}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">{'{{company}}'}</span>
                  </div>
                </div>
                <textarea
                  rows={8}
                  defaultValue={activeProspect.pitch}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-sans leading-relaxed outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeProspect.pitch);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {isCopied ? 'Copied to Clipboard!' : 'Copy Template'}
                </button>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Claim $30 Credits & Send
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: OMNICHANNEL DRIP SEQUENCE & DELIVERABILITY */}
          {currentStep === 8 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 8
                    </span>
                    Omnichannel Outreach Sequence Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    4-Touch delivery sequence across secondary domain cold email and LinkedIn engagement.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(9)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Continue to Step 9 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Drip Timeline Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  {
                    day: 'Day 1',
                    channel: 'Cold Email',
                    title: 'Initial Signal Pitch',
                    desc: 'Short observation about company operations & confidential reporting pathway.',
                    openRate: '68% Open',
                  },
                  {
                    day: 'Day 3',
                    channel: 'LinkedIn Touch',
                    title: 'Profile View & Soft Note',
                    desc: 'Automated profile engagement to build warm familiarity before second touch.',
                    openRate: '42% Acceptance',
                  },
                  {
                    day: 'Day 6',
                    channel: 'Follow-Up Email',
                    title: 'Data Benchmark Brief',
                    desc: 'Sharing 1-page comparative hazard mitigation brief and peer benchmarks.',
                    openRate: '54% Open',
                  },
                  {
                    day: 'Day 9',
                    channel: 'Final Breakup',
                    title: 'Calendar Direct Link',
                    desc: 'Direct calendar link for a 7-minute benchmark review call.',
                    openRate: '28% Response',
                  },
                ].map((touch, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                        {touch.day}
                      </span>
                      <span className="text-[10px] text-slate-400">{touch.channel}</span>
                    </div>
                    <div className="font-semibold text-xs text-white">{touch.title}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{touch.desc}</div>
                    <div className="text-[10px] font-mono text-emerald-300 font-semibold pt-1 border-t border-white/5">
                      Benchmark: {touch.openRate}
                    </div>
                  </div>
                ))}
              </div>

              {/* Domain Warmup Status */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Secondary Domain Health (50 Warmup Nodes Active)</span>
                  <span className="text-emerald-400 font-mono">SPF / DKIM / DMARC: 100% PASS</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[98%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>0% Spam complaints</span>
                  <span>Daily capacity: 2,500 emails/day</span>
                  <span>Primary Google Workspace domain untouched</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: AUTONOMOUS INBOX & SHEET SYNC */}
          {currentStep === 9 && (
            <div className="p-5 rounded-2xl bg-[#0C1220] border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
                      Step 9
                    </span>
                    Autonomous Inbox & Google Sheet Sync Engine
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated reply sentiment classification, meeting booking, and live logging to your private Google Sheet.
                  </p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Activate Outreach
                </button>
              </div>

              {/* Triage Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-emerald-400">HOT INTERESTED</div>
                  <div className="text-sm font-semibold text-white">Auto-Book Meeting</div>
                  <div className="text-[11px] text-slate-400">
                    AI agent parses prospect availability and drops calendar event directly into your Google Calendar.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-amber-400">OBJECTION / QUESTIONS</div>
                  <div className="text-sm font-semibold text-white">AI Handled Objection</div>
                  <div className="text-[11px] text-slate-400">
                    Drafts contextual response using your case studies and technical documentation within 15 minutes.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-rose-400">NOT INTERESTED</div>
                  <div className="text-sm font-semibold text-white">Auto-Unsubscribe</div>
                  <div className="text-[11px] text-slate-400">
                    Instantly flags contact in Google Sheet CRM and suppresses future touches to protect domain reputation.
                  </div>
                </div>
              </div>

              {/* Live Sheet Status Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs text-white">
                      Google Sheet Real-Time Sync Connected
                    </span>
                  </div>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1ic6sIvjHQq6pDEKIwfgqLJszWcboi_UNqDXK1cbo8P0/edit"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    Open Sheet Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  All 17 enriched decision-makers, company signals, and email pitches are synced to Google Sheet webhook{' '}
                  <span className="font-mono text-emerald-300">AKfycbxHOiNq...</span> in real-time.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── $30 FREE TRIAL ACTIVATION MODAL ────────────────────────────── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0C1220] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {trialStatus === 'success' ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">$30 Free Credits Successfully Activated!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your 50 outreach secondary domains are warmed up. 17 decision makers for {targetDomain} have been queued for autonomous multi-channel delivery.
                </p>
                <div className="p-3 bg-slate-900 rounded-xl text-left text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Credit Balance:</span>
                    <span className="text-emerald-400 font-bold">$30.00 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified Prospects:</span>
                    <span>17 Queued</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domain Rotation:</span>
                    <span>50 Warmup Nodes Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Sheet:</span>
                    <span className="text-emerald-400">Synced to Private Sheet</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Return to Campaign Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">
                    Instant Sandbox Activation
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Launch Autonomous Outreach with $30 Free Credits
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Deploy verified B2B prospect lists, domain warmup, and personalized cold email delivery without touching your primary Google Workspace domain.
                  </p>
                </div>

                {/* 3 Core Value Props */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                    <Zap className="w-4 h-4 text-emerald-400 mx-auto" />
                    <div className="font-semibold text-white text-[11px]">Zero-Setup Infra</div>
                    <div className="text-[10px] text-slate-400 leading-tight">50 secondary domains</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                    <div className="font-semibold text-white text-[11px]">Waterfall Verify</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Hunter & LeadMagic</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                    <Send className="w-4 h-4 text-emerald-400 mx-auto" />
                    <div className="font-semibold text-white text-[11px]">AI Follow-Ups</div>
                    <div className="text-[10px] text-slate-400 leading-tight">Autonomous meeting book</div>
                  </div>
                </div>

                {/* Testimonial Slider */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-slate-400 text-[10px] ml-1">Verified Customer Outcome</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveTestimonialIndex((idx) => (idx > 0 ? idx - 1 : testimonials.length - 1))}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-400">
                        {activeTestimonialIndex + 1}/{testimonials.length}
                      </span>
                      <button
                        onClick={() => setActiveTestimonialIndex((idx) => (idx < testimonials.length - 1 ? idx + 1 : 0))}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-snug">
                    &quot;{testimonials[activeTestimonialIndex].quote}&quot;
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] text-white flex items-center justify-center font-bold">
                        {testimonials[activeTestimonialIndex].avatar}
                      </div>
                      <span className="font-medium text-white text-[11px]">
                        {testimonials[activeTestimonialIndex].name} &middot; {testimonials[activeTestimonialIndex].company}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400">
                      {testimonials[activeTestimonialIndex].replyRate}
                    </span>
                  </div>
                </div>

                {/* Email Submission Form */}
                <form onSubmit={handleClaimTrial} className="space-y-2.5">
                  <label className="text-[11px] font-mono uppercase text-slate-400">
                    Your Work Email (Instant Free Sandbox Access)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      required
                      value={trialEmail}
                      onChange={(e) => setTrialEmail(e.target.value)}
                      placeholder="e.g. alex@yourcompany.com"
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="submit"
                      disabled={trialStatus === 'submitting'}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors shrink-0"
                    >
                      {trialStatus === 'submitting' ? 'Activating...' : 'Claim $30 Free Credits &rarr;'}
                    </button>
                  </div>
                </form>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <Lock className="w-3 h-3" />
                  <span>Powered by Stripe &middot; No credit card required for 14 days &middot; Cancel anytime</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
