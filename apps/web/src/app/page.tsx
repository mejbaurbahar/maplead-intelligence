import React, { Suspense } from 'react';
import AutoGtmClient from './auto-gtm/company/[domain]/explore/AutoGtmClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B12] text-slate-400 p-8 flex items-center justify-center">Loading Autonomous Engine...</div>}>
      <AutoGtmClient domain="nasa.gov" />
    </Suspense>
  );
}
