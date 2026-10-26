import React, { Suspense } from 'react';
import AutoGtmClient from './AutoGtmClient';

export function generateStaticParams() {
  return [
    { domain: 'nasa.gov' },
    { domain: 'demo' },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono text-xs">Loading Auto-GTM Engine...</div>}>
      <AutoGtmClient domain={resolvedParams.domain} />
    </Suspense>
  );
}
