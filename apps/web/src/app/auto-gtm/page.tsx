import React, { Suspense } from 'react';
import AutoGtmClient from './company/[domain]/explore/AutoGtmClient';

export default function AutoGtmRootPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs">Loading Auto-GTM Engine...</div>}>
      <AutoGtmClient domain="nasa.gov" />
    </Suspense>
  );
}
