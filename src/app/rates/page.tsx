'use client';

import React, { useState, useCallback } from 'react';
import { SuiteNav } from '@/components/layout/SuiteNav';
import {
  MARKETS, ROLES, CONFIGS,
  Market, RoleType, MarketRoleConfig,
} from '@/lib/rateData';
import {
  calculateRates, payRateOptions, fmt$, fmtPct,
  CompanyType, RateResult,
} from '@/lib/rateEngine';

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconCamera({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconWriting({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconSocial({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RoleIcon({ icon, size = 'md' }: { icon: RoleType['icon']; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const wrap = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const colors: Record<string, string> = {
    camera:  'bg-amber-500/20 text-amber-400',
    writing: 'bg-sky-500/20 text-sky-400',
    social:  'bg-rose-500/20 text-rose-400',
  };
  return (
    <div className={`${wrap} ${colors[icon]} rounded-xl flex items-center justify-center shrink-0`}>
      {icon === 'camera'  && <IconCamera className={sz} />}
      {icon === 'writing' && <IconWriting className={sz} />}
      {icon === 'social'  && <IconSocial className={sz} />}
    </div>
  );
}

// ─── Margin Progress Bar ──────────────────────────────────────────────────────

function MarginBar({ result }: { result: RateResult }) {
  const { actualGP, targetGP, minGP, atOrAboveTarget, belowMin } = result;
  const fillPct = Math.min((actualGP / targetGP) * 100, 100);
  const barColor = belowMin ? 'bg-red-500' : atOrAboveTarget ? 'bg-green-500' : 'bg-amber-400';
  const textColor = belowMin ? 'text-red-400' : atOrAboveTarget ? 'text-green-400' : 'text-amber-400';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Margin</span>
        <span className={`text-sm font-bold tabular-nums ${textColor}`}>{fmtPct(actualGP)}</span>
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Min {fmtPct(minGP)}</span>
        <span>Target {fmtPct(targetGP)}</span>
      </div>

      {atOrAboveTarget ? (
        <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-400/10 rounded-lg px-3 py-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          At or above target margin
        </div>
      ) : belowMin ? (
        <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium bg-red-400/10 rounded-lg px-3 py-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Below minimum — negotiate or decline
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium bg-amber-400/10 rounded-lg px-3 py-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
          Below target — watch your margin
        </div>
      )}
    </div>
  );
}

// ─── Content Type Card ────────────────────────────────────────────────────────

function ContentCard({
  role,
  config,
  market,
  companyType,
  payRate,
  onPayRateChange,
}: {
  role: RoleType;
  config: MarketRoleConfig;
  market: Market;
  companyType: CompanyType;
  payRate: number;
  onPayRateChange: (v: number) => void;
}) {
  const result = calculateRates(payRate, config.overheadRate, market, config.avgRate, companyType);
  const opts = payRateOptions();

  const badgeColors: Record<string, string> = {
    camera:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
    writing: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    social:  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  return (
    <div className="bg-[#162038] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <RoleIcon icon={role.icon} />
          <div>
            <div className="text-white font-semibold text-sm">{role.name}</div>
            <div className="text-slate-400 text-xs mt-0.5">per day</div>
          </div>
        </div>
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg border ${badgeColors[role.icon]}`}>
          {role.category}
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Base rate row */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Base Rate</div>
            <div className="relative">
              <select
                value={payRate}
                onChange={e => onPayRateChange(parseFloat(e.target.value))}
                className="w-full appearance-none bg-[#0d1526] border border-white/10 text-white font-semibold text-base rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-[#e91e8c]/50 focus:ring-1 focus:ring-[#e91e8c]/30 cursor-pointer"
              >
                {opts.map(v => (
                  <option key={v} value={v}>{fmt$(v)} / day</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Avg rate chip */}
          <button
            onClick={() => onPayRateChange(config.avgRate)}
            title="Reset to destination average base rate"
            className="shrink-0 flex items-center gap-1.5 bg-[#e91e8c]/15 hover:bg-[#e91e8c]/25 border border-[#e91e8c]/30 text-[#ff6bb5] text-xs font-bold px-3 py-2 rounded-xl transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Avg {fmt$(config.avgRate)}
          </button>
        </div>

        {/* Day rate / Rush rate */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0d1526] rounded-xl p-3">
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">Day Rate</div>
            <div className="text-2xl font-bold text-[#ff6bb5] tabular-nums">{fmt$(result.dayRate)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">at target margin</div>
          </div>
          <div className="bg-[#0d1526] rounded-xl p-3">
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">Rush Rate</div>
            <div className="text-2xl font-bold text-[#ff6bb5] tabular-nums">{fmt$(result.rushRate)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">day rate × 1.5</div>
          </div>
        </div>

        {/* Overhead / Cost / Profit */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Overhead',    value: fmtPct(result.overheadRate) },
            { label: 'Cost / day',  value: fmt$(result.costPerDay)     },
            { label: 'Profit / day', value: fmt$(result.profitPerDay)  },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#0d1526] rounded-xl p-3">
              <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">{label}</div>
              <div className="text-sm font-semibold text-white tabular-nums">{value}</div>
            </div>
          ))}
        </div>

        {/* Margin bar */}
        <MarginBar result={result} />
      </div>
    </div>
  );
}

// ─── Rate Notes Footer ────────────────────────────────────────────────────────

function RateNotes() {
  const notes = [
    { label: 'Formula',       body: 'base × (1 + overhead%) / (1 − targetMargin%)' },
    { label: 'Target Margin', body: 'Set per destination — minimum acceptable margin' },
    { label: 'Rush Rate',     body: 'Day rate × 1.5 for urgent delivery' },
    { label: 'Overhead',      body: 'Gear depreciation + travel costs + editing software' },
    { label: 'Min Margin',    body: 'Floor — negotiate or decline below this' },
    { label: 'Avg Rate',      body: 'Pink chip = destination average base day rate' },
  ];
  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5 mt-6">
      <div className="text-[10px] font-bold tracking-widest text-[#e91e8c] uppercase mb-4">
        Rate Calculator Notes
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {notes.map(({ label, body }) => (
          <div key={label} className="flex gap-2 text-xs">
            <span className="text-white font-semibold shrink-0">• {label}:</span>
            <span className="text-slate-400">{body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RatesPage() {
  const [marketId, setMarketId]       = useState('europe');
  const [companyType, setCompanyType] = useState<CompanyType>('Direct');
  const [payRates, setPayRates]       = useState<Record<string, number>>({});

  const market  = MARKETS.find(m => m.id === marketId)!;
  const configs = CONFIGS.filter(c => c.marketId === marketId);

  const getPayRate = (roleId: string) =>
    payRates[`${marketId}:${roleId}`] ??
    configs.find(c => c.roleId === roleId)?.avgRate ??
    400;

  const setPayRate = (roleId: string, v: number) =>
    setPayRates(prev => ({ ...prev, [`${marketId}:${roleId}`]: v }));

  // ── Copy Rates ──────────────────────────────────────────────────────────────
  const copyRates = useCallback(() => {
    const lines = [
      `MemoryLane Creator Rates — ${market.name} (${companyType} Client)`,
      `Target Margin: ${fmtPct(market.targetGP)}  Min Margin: ${fmtPct(market.minGP)}`,
      '',
    ];
    configs.forEach(cfg => {
      const role   = ROLES.find(r => r.id === cfg.roleId)!;
      const pay    = getPayRate(cfg.roleId);
      const result = calculateRates(pay, cfg.overheadRate, market, cfg.avgRate, companyType);
      lines.push(
        `${role.name}`,
        `  Base: ${fmt$(pay)}/day  Day Rate: ${fmt$(result.dayRate)}  Rush: ${fmt$(result.rushRate)}`,
        `  Overhead: ${fmtPct(result.overheadRate)}  Cost/day: ${fmt$(result.costPerDay)}  Profit/day: ${fmt$(result.profitPerDay)}  Margin: ${fmtPct(result.actualGP)}`,
        '',
      );
    });
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketId, companyType, payRates]);

  // ── Reset to Avg ────────────────────────────────────────────────────────────
  const resetAvg = () => {
    const updates: Record<string, number> = {};
    configs.forEach(c => { updates[`${marketId}:${c.roleId}`] = c.avgRate; });
    setPayRates(prev => ({ ...prev, ...updates }));
  };

  const handlePrint = () => window.print();

  const companyTabs: { id: CompanyType; label: string }[] = [
    { id: 'Direct',   label: 'Direct Brand' },
    { id: 'Agency',   label: 'Agency' },
    { id: 'Platform', label: `Platform (${fmtPct(market.platformMU)} fee)` },
  ];

  return (
    <div className="min-h-screen bg-[#0a1120] text-white">
      <SuiteNav />

      {/* ── Sub-header ── */}
      <div className="bg-[#0d1526] border-b border-white/5 sticky top-16 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Creator Day Rate Calculator
            </div>
            <div className="flex items-center gap-1">
              {[
                { label: 'Copy Rates', icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3', onClick: copyRates },
                { label: 'Reset Avg',  icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', onClick: resetAvg },
                { label: 'Print',      icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z', onClick: handlePrint },
              ].map(({ label, icon, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex items-center gap-1 text-slate-400 hover:text-white text-[11px] px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {/* Destination tabs */}
        <div className="bg-[#162038] rounded-2xl p-2 grid grid-cols-3 gap-1.5">
          {MARKETS.map(m => {
            const active = m.id === marketId;
            return (
              <button
                key={m.id}
                onClick={() => setMarketId(m.id)}
                className={`rounded-xl py-2.5 px-2 text-center transition-all ${
                  active
                    ? 'text-white font-semibold shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                style={active ? { background: 'linear-gradient(135deg,#c2185b,#e91e8c)' } : {}}
              >
                <div className="text-sm font-semibold leading-tight">{m.name}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{m.region}</div>
              </button>
            );
          })}
        </div>

        {/* Destination metrics bar */}
        <div className="bg-[#162038] rounded-2xl px-5 py-3.5 flex items-center justify-between">
          <div className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#e91e8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {market.name}
            <span className="text-slate-400 text-xs font-normal">{market.region} · {configs.length} content types</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Target</div>
              <div className="font-bold text-[#ff6bb5]">{fmtPct(market.targetGP)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Min</div>
              <div className="font-bold text-white">{fmtPct(market.minGP)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Agency MU</div>
              <div className="font-bold text-white">{market.agencyMU}%</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Platform MU</div>
              <div className="font-bold text-green-400">{market.platformMU}%</div>
            </div>
          </div>
        </div>

        {/* Client type tabs */}
        <div className="bg-[#162038] rounded-2xl p-1.5 flex gap-1">
          {companyTabs.map(tab => {
            const active = tab.id === companyType;
            return (
              <button
                key={tab.id}
                onClick={() => setCompanyType(tab.id)}
                className={`flex-1 rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#1e3a5f] text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content type cards */}
        {configs.map(cfg => {
          const role = ROLES.find(r => r.id === cfg.roleId);
          if (!role) return null;
          return (
            <ContentCard
              key={cfg.roleId}
              role={role}
              config={cfg}
              market={market}
              companyType={companyType}
              payRate={getPayRate(cfg.roleId)}
              onPayRateChange={v => setPayRate(cfg.roleId, v)}
            />
          );
        })}

        {/* Notes */}
        <RateNotes />

        <div className="pb-6" />
      </div>
    </div>
  );
}
