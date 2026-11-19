import React, { useState } from 'react';
import { APPRAISAL_PRESETS } from '../data/mockData';
import { AppraisalDemoResult } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Scan, 
  Activity, 
  CheckCircle2, 
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';

interface AppraisalEngineProps {
  onLiquidatePreset?: (brand: string, estimatedPayout: number) => void;
}

export const AppraisalEngine: React.FC<AppraisalEngineProps> = ({ onLiquidatePreset }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(APPRAISAL_PRESETS[0].id);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Ready for inspection');
  const [currentResult, setCurrentResult] = useState<AppraisalDemoResult>({
    brand: APPRAISAL_PRESETS[0].brand,
    category: APPRAISAL_PRESETS[0].category,
    estimatedRetail: APPRAISAL_PRESETS[0].retail,
    payoutCash: APPRAISAL_PRESETS[0].cash,
    payoutCredit: APPRAISAL_PRESETS[0].credit,
    conditionGrade: APPRAISAL_PRESETS[0].grade,
    seamIntegrity: APPRAISAL_PRESETS[0].integrity,
    fabricPurity: APPRAISAL_PRESETS[0].purity,
    turnaroundEstimate: 'Instant on handover',
  });

  const activePreset = APPRAISAL_PRESETS.find((p) => p.id === selectedPresetId) || APPRAISAL_PRESETS[0];

  const handleRunScan = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = APPRAISAL_PRESETS.find((p) => p.id === presetId) || APPRAISAL_PRESETS[0];

    setIsScanning(true);
    setScanStep('Detecting brand typography & care tag...');

    setTimeout(() => {
      setScanStep('Analyzing stitch density & collar elasticity...');
    }, 600);

    setTimeout(() => {
      setScanStep('Querying Delhi NCR campus demand velocity index...');
    }, 1200);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep('Appraisal Complete');
      setCurrentResult({
        brand: preset.brand,
        category: preset.category,
        estimatedRetail: preset.retail,
        payoutCash: preset.cash,
        payoutCredit: preset.credit,
        conditionGrade: preset.grade,
        seamIntegrity: preset.integrity,
        fabricPurity: preset.purity,
        turnaroundEstimate: 'Instant on handover',
      });
    }, 1800);
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3F20] font-semibold">
            Computer Vision & Pricing Algorithm
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#142B15] mt-1">
            AI Garment Appraisal Engine
          </h2>
          <p className="text-sm text-[#5A564A] mt-1 max-w-xl">
            ReVogue uses proprietary multi-angle CV models to inspect fabric wear, seam tension,
            brand authenticity, and campus velocity to quote guaranteed upfront cash in under 2 seconds.
          </p>
        </div>
        <div className="text-xs font-mono text-[#1E3F20] bg-white border border-[#1E3F20]/20 px-3 py-1.5 rounded self-start sm:self-auto">
          Model Version: ResNet-Cloth-v2.8 · 99.4% Accuracy
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Preset Garment Selector & Interactive Scanner Mockup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF9F4] border border-[#1E3F20]/15 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E3F20]/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#142B15] font-semibold">
                Test Garment Profiles
              </span>
              <span className="text-xs font-mono text-[#8C8675]">Select to Inspect</span>
            </div>

            <div className="space-y-2.5">
              {APPRAISAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleRunScan(preset.id)}
                  disabled={isScanning}
                  className={`w-full text-left p-3 rounded border transition-all cursor-pointer flex items-center justify-between ${
                    selectedPresetId === preset.id
                      ? 'border-[#1E3F20] bg-white ring-2 ring-[#1E3F20]/20 shadow-xs'
                      : 'border-[#1E3F20]/15 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#142B15] flex items-center gap-1.5">
                      <span>{preset.name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#5A564A]">
                      {preset.brand} · Orig. ₹{preset.retail.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#1E3F20]">
                      ₹{preset.cash} Cash
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Run Appraisal Action Button */}
            <button
              onClick={() => handleRunScan(selectedPresetId)}
              disabled={isScanning}
              className="w-full py-2.5 bg-[#1E3F20] text-[#F7F5EE] hover:bg-[#142B15] disabled:opacity-60 text-xs font-mono font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C2F04E]" />
                  <span>Scanning Garment Matrix...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-[#C2F04E]" />
                  <span>Re-Scan Selected Garment</span>
                </>
              )}
            </button>
          </div>

          {/* Scanner Optical Simulation Viewport */}
          <div className="bg-[#142B15] text-[#FAF9F4] rounded-lg p-5 relative overflow-hidden font-mono text-xs">
            {/* Grid crosshairs */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C2F04E_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#C2F04E]">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>OPTICAL INSPECTION ACTIVE</span>
                </span>
                <span>STATUS: {isScanning ? 'PROCESSING' : 'LOCKED'}</span>
              </div>

              <div className="p-3 bg-black/40 rounded border border-[#C2F04E]/20 space-y-1">
                <div className="text-[#8C8675] text-[10px]">CURRENT PIPELINE STAGE:</div>
                <div className="text-white font-medium">{scanStep}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-white/5 p-2 rounded">
                  <span className="text-[#8C8675] block text-[10px]">SEAM INTEGRITY</span>
                  <span className="text-[#C2F04E] font-bold">{activePreset.integrity}% PASS</span>
                </div>
                <div className="bg-white/5 p-2 rounded">
                  <span className="text-[#8C8675] block text-[10px]">SANITY GRADE</span>
                  <span className="text-white font-bold">{activePreset.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appraisal Report & Instant Valuation Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#1E3F20]/15 rounded-lg p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3F20]/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1E3F20]" />
                <h3 className="text-base font-bold text-[#142B15]">
                  Certified AI Inspection Certificate
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8C8675]">
                Batch #RV-QC-{selectedPresetId.replace('preset-', '40')}
              </span>
            </div>

            {/* Garment Title and Brand Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF9F4] p-4 rounded border border-[#1E3F20]/10">
              <div>
                <span className="text-xs font-mono text-[#1E3F20] font-semibold">{currentResult.brand}</span>
                <h4 className="text-lg font-bold text-[#142B15]">{activePreset.name}</h4>
                <p className="text-xs text-[#5A564A] mt-0.5">{currentResult.fabricPurity}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-[#8C8675]">Original Retail</span>
                <div className="text-sm font-mono text-[#5A564A] line-through">
                  ₹{currentResult.estimatedRetail.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Diagnostic Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded bg-[#FAF9F4] border border-[#1E3F20]/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C8675]">Condition Grade</span>
                <div className="text-base font-bold text-[#142B15]">{currentResult.conditionGrade}</div>
                <p className="text-[11px] text-[#5A564A]">No blemishes or stains</p>
              </div>

              <div className="p-3.5 rounded bg-[#FAF9F4] border border-[#1E3F20]/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C8675]">Seam & Stitch Integrity</span>
                <div className="text-base font-bold text-[#1E3F20] font-mono">{currentResult.seamIntegrity}%</div>
                <p className="text-[11px] text-[#5A564A]">Structural seams intact</p>
              </div>

              <div className="p-3.5 rounded bg-[#FAF9F4] border border-[#1E3F20]/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C8675]">Campus Velocity</span>
                <div className="text-base font-bold text-[#FF5E36]">High Demand</div>
                <p className="text-[11px] text-[#5A564A]">Est. drop sale in &lt; 24h</p>
              </div>
            </div>

            {/* Inspection Auditor Notes */}
            <div className="space-y-1 text-xs">
              <span className="font-mono text-[#8C8675] uppercase text-[11px]">Computer Vision Auditor Findings:</span>
              <p className="text-[#302E28] bg-[#FAF9F4] p-3 rounded border border-[#1E3F20]/10 leading-relaxed">
                {activePreset.notes} Ready for 120°C medical steam treatment and vacuum seal.
              </p>
            </div>

            {/* Instant Guaranteed Payout Offer Strip */}
            <div className="p-5 rounded-lg bg-[#1E3F20] text-[#F7F5EE] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#C2F04E]">
                    Guaranteed Upfront Offer
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-1">
                    ₹{currentResult.payoutCash} UPI Cash
                  </div>
                  <div className="text-xs text-[#ECE8DC] mt-0.5">
                    or ₹{currentResult.payoutCredit} in ReVogue Drop Tokens (+20% bonus)
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-xs font-mono text-[#C2F04E] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C2F04E]" />
                    <span>Instant UPI Handover Payout</span>
                  </div>
                  {onLiquidatePreset && (
                    <button
                      type="button"
                      onClick={() => onLiquidatePreset(currentResult.brand, currentResult.payoutCash)}
                      className="px-4 py-2 bg-[#C2F04E] hover:bg-[#d2f772] text-[#142B15] text-xs font-mono font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Liquidate This Piece</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Protocol Standard Assurance */}
            <div className="flex items-center gap-3 text-xs text-[#5A564A] pt-2 border-t border-[#1E3F20]/10">
              <Flame className="w-4 h-4 text-[#FF5E36]" />
              <span>
                Standard Sanitization Protocol: Every acquired piece enters hospital-grade steam sanitization before being featured in campus thrift drops.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
