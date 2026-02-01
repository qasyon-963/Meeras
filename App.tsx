
import React, { useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS } from './constants';
import { Language, DeceasedGender, HeirsData, CalculationResponse } from './types';
import { LanguageToggle } from './components/LanguageToggle';
import { StepIndicator } from './components/StepIndicator';
import { calculateInheritance } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Users, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  Scale, 
  Info, 
  Home, 
  AlertTriangle,
  RefreshCw,
  Download,
  Languages,
  GanttChart,
  Calculator,
  CheckCircle2,
  FileText
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [view, setView] = useState<'home' | 'form' | 'results' | 'about'>('home');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CalculationResponse | null>(null);

  const [formData, setFormData] = useState<HeirsData>({
    deceasedGender: DeceasedGender.MALE,
    estateValue: 0,
    currency: 'SAR',
    debts: 0,
    willAmount: 0,
    hasHusband: false,
    wivesCount: 0,
    sonsCount: 0,
    daughtersCount: 0,
    hasFather: false,
    hasMother: false,
    fullBrothersCount: 0,
    fullSistersCount: 0,
    paternalBrothersCount: 0,
    paternalSistersCount: 0,
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  const netEstateCalculations = useMemo(() => {
    const estate = formData.estateValue || 0;
    const debts = formData.debts || 0;
    const initialRemainder = Math.max(0, estate - debts);
    const maxWill = estate / 3;
    const actualWill = formData.willAmount || 0;
    const net = Math.max(0, initialRemainder - actualWill);
    
    return {
      estate,
      debts,
      will: actualWill,
      net,
      isWillOverLimit: actualWill > maxWill && estate > 0
    };
  }, [formData.estateValue, formData.debts, formData.willAmount]);

  // منطق مطور لاستخراج الورثة وتفصيلهم بشكل فردي
  const individualHeirs = useMemo(() => {
    if (!results) return [];
    
    const list: { name: string; amount: number; percentage: number; fraction: string }[] = [];
    const labels = TRANSLATIONS.individualHeirLabels[lang] as any;

    // دالة مساعدة للبحث المرن في المصفوفة
    const getShare = (keywords: string[]) => {
      return results.shares.find(s => 
        keywords.some(k => s.heir.toLowerCase().includes(k.toLowerCase()))
      );
    };

    // 1. الزوج / الزوجات
    if (formData.hasHusband) {
      const s = getShare(['husband', 'زوج']);
      if (s) list.push({ name: labels.husband, amount: s.amount, percentage: s.sharePercentage, fraction: s.shareFraction });
    }
    if (formData.wivesCount > 0) {
      const s = getShare(['wife', 'wives', 'زوجة', 'زوجات']);
      if (s) {
        const individualAmount = s.amount / formData.wivesCount;
        const individualPerc = s.sharePercentage / formData.wivesCount;
        for (let i = 1; i <= formData.wivesCount; i++) {
          list.push({ 
            name: formData.wivesCount > 1 ? `${labels.wife} ${i}` : labels.wife, 
            amount: individualAmount, 
            percentage: individualPerc, 
            fraction: s.shareFraction 
          });
        }
      }
    }

    // 2. الوالدان
    if (formData.hasFather) {
      const s = getShare(['father', 'أب']);
      if (s) list.push({ name: labels.father, amount: s.amount, percentage: s.sharePercentage, fraction: s.shareFraction });
    }
    if (formData.hasMother) {
      const s = getShare(['mother', 'أم']);
      if (s) list.push({ name: labels.mother, amount: s.amount, percentage: s.sharePercentage, fraction: s.shareFraction });
    }

    // 3. الأبناء (بالتفصيل الفردي)
    if (formData.sonsCount > 0) {
      const s = getShare(['son', 'sons', 'ابن', 'أبناء']);
      if (s) {
        const individualAmount = s.amount / formData.sonsCount;
        const individualPerc = s.sharePercentage / formData.sonsCount;
        for (let i = 1; i <= formData.sonsCount; i++) {
          list.push({ 
            name: formData.sonsCount > 1 ? `${labels.son} ${i}` : labels.son, 
            amount: individualAmount, 
            percentage: individualPerc, 
            fraction: s.shareFraction 
          });
        }
      }
    }

    // 4. البنات (بالتفصيل الفردي)
    if (formData.daughtersCount > 0) {
      const s = getShare(['daughter', 'daughters', 'بنت', 'بنات', 'ابنة']);
      if (s) {
        const individualAmount = s.amount / formData.daughtersCount;
        const individualPerc = s.sharePercentage / formData.daughtersCount;
        for (let i = 1; i <= formData.daughtersCount; i++) {
          list.push({ 
            name: formData.daughtersCount > 1 ? `${labels.daughter} ${i}` : labels.daughter, 
            amount: individualAmount, 
            percentage: individualPerc, 
            fraction: s.shareFraction 
          });
        }
      }
    }

    // 5. الإخوة والأخوات
    if (formData.fullBrothersCount > 0) {
      const s = getShare(['full brother', 'أخ شقيق']);
      if (s) {
        const individualAmount = s.amount / formData.fullBrothersCount;
        const individualPerc = s.sharePercentage / formData.fullBrothersCount;
        for (let i = 1; i <= formData.fullBrothersCount; i++) {
          list.push({ name: `${labels.brother} ${i}`, amount: individualAmount, percentage: individualPerc, fraction: s.shareFraction });
        }
      }
    }
    if (formData.fullSistersCount > 0) {
      const s = getShare(['full sister', 'أخت شقيقة']);
      if (s) {
        const individualAmount = s.amount / formData.fullSistersCount;
        const individualPerc = s.sharePercentage / formData.fullSistersCount;
        for (let i = 1; i <= formData.fullSistersCount; i++) {
          list.push({ name: `${labels.sister} ${i}`, amount: individualAmount, percentage: individualPerc, fraction: s.shareFraction });
        }
      }
    }

    return list;
  }, [results, formData, lang]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await calculateInheritance(formData, lang);
      setResults(res);
      setView('results');
    } catch (error) {
      alert("Error calculating distribution. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
        <Scale className="w-12 h-12 text-emerald-600" />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
        {t('appName')}
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-2xl">
        {lang === 'ar' 
          ? "أداة سهلة وسريعة لمساعدتك في فهم توزيع المواريث حسب الشريعة الإسلامية. صُممت لتقديم معلومات واضحة ومبسطة للجميع."
          : "A quick and easy tool to help you understand inheritance distribution according to Islamic Sharia. Designed to provide clear and simplified information for everyone."}
      </p>

      <button
        onClick={() => setView('form')}
        className="px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 group"
      >
        {t('start')}
        {lang === 'ar' ? <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="group-hover:translate-x-1 transition-transform" />}
      </button>

      <div className="mt-16 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 text-start">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900 mb-1">{t('disclaimerTitle')}</h3>
          <p className="text-amber-800 text-sm">{t('disclaimerText')}</p>
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    const totalSteps = 4;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator currentStep={step} totalSteps={totalSteps} lang={lang} />
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[450px] transition-all">
          
          {step === 1 && (
            <div className="space-y-8 flex flex-col items-center">
              <div className="text-center">
                <Languages className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">{t('step1Title')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => setLang('ar')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    lang === 'ar' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className="text-2xl font-bold font-arabic">العربية</span>
                  <span className="text-slate-400 text-sm">Arabic</span>
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    lang === 'en' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className="text-2xl font-bold font-english">English</span>
                  <span className="text-slate-400 text-sm">الإنجليزية</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Wallet className="text-emerald-600" />
                {t('step2Title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('estateLabel')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.estateValue || ''}
                      onChange={(e) => setFormData({ ...formData, estateValue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Currency / العملة</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="SAR">SAR (ر.س)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="KWD">KWD (د.ك)</option>
                    <option value="EGP">EGP (ج.م)</option>
                    <option value="QAR">QAR (ر.ق)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('debtsLabel')}</label>
                  <input
                    type="number"
                    value={formData.debts || ''}
                    onChange={(e) => setFormData({ ...formData, debts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('willLabel')}</label>
                  <input
                    type="number"
                    value={formData.willAmount || ''}
                    onChange={(e) => setFormData({ ...formData, willAmount: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none ${netEstateCalculations.isWillOverLimit ? 'border-amber-400 bg-amber-50' : 'border-slate-200'}`}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-emerald-900 font-bold flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    {t('netEstateLabel')}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-700">
                      {netEstateCalculations.net.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 text-emerald-600 font-bold uppercase">{formData.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Users className="text-emerald-600" />
                {t('step3Title')}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, deceasedGender: DeceasedGender.MALE, hasHusband: false })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                      formData.deceasedGender === DeceasedGender.MALE ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100'
                    }`}
                  >
                    <span className="font-bold">{t('male')}</span>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, deceasedGender: DeceasedGender.FEMALE, wivesCount: 0 })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                      formData.deceasedGender === DeceasedGender.FEMALE ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100'
                    }`}
                  >
                    <span className="font-bold">{t('female')}</span>
                  </button>
                </div>

                {formData.deceasedGender === DeceasedGender.MALE ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('wivesLabel')}</label>
                    <select
                      value={formData.wivesCount}
                      onChange={(e) => setFormData({ ...formData, wivesCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      {[0, 1, 2, 3, 4].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <input
                      type="checkbox"
                      checked={formData.hasHusband}
                      onChange={(e) => setFormData({ ...formData, hasHusband: e.target.checked })}
                      className="w-5 h-5 rounded accent-emerald-600"
                    />
                    <label className="text-sm font-medium text-slate-700">{t('husbandLabel')}</label>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('sonsLabel')}</label>
                    <input
                      type="number"
                      value={formData.sonsCount || ''}
                      onChange={(e) => setFormData({ ...formData, sonsCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('daughtersLabel')}</label>
                    <input
                      type="number"
                      value={formData.daughtersCount || ''}
                      onChange={(e) => setFormData({ ...formData, daughtersCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <GanttChart className="text-emerald-600" />
                {t('step4Title')}
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasFather}
                    onChange={(e) => setFormData({ ...formData, hasFather: e.target.checked })}
                    className="w-5 h-5 rounded accent-emerald-600"
                  />
                  <label className="text-sm font-medium text-slate-700">{t('fatherLabel')}</label>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasMother}
                    onChange={(e) => setFormData({ ...formData, hasMother: e.target.checked })}
                    className="w-5 h-5 rounded accent-emerald-600"
                  />
                  <label className="text-sm font-medium text-slate-700">{t('motherLabel')}</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('brothersLabel')}</label>
                  <input
                    type="number"
                    value={formData.fullBrothersCount || ''}
                    onChange={(e) => setFormData({ ...formData, fullBrothersCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('sistersLabel')}</label>
                  <input
                    type="number"
                    value={formData.fullSistersCount || ''}
                    onChange={(e) => setFormData({ ...formData, fullSistersCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : setView('home')}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-all"
          >
            {lang === 'ar' ? <ChevronRight /> : <ChevronLeft />}
            {t('back')}
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              {t('next')}
              {lang === 'ar' ? <ChevronLeft /> : <ChevronRight />}
            </button>
          ) : (
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Scale />}
              {t('calculate')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const totalDistributed = individualHeirs.reduce((sum, h) => sum + h.amount, 0);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* نسخة الطباعة (مخفية في الشاشة) */}
        <div className="print-only bg-white text-black p-8 space-y-12">
           <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-emerald-600 mb-2">{t('appName')}</h1>
                <h2 className="text-lg font-bold text-slate-800">{t('pdfTitle')}</h2>
              </div>
           </div>

           <section>
             <h3 className="text-lg font-bold mb-4 border-b border-slate-200 pb-2">{t('summaryTitle')}</h3>
             <div className="grid grid-cols-2 gap-y-4 text-sm">
               <div><span className="text-slate-500">{lang === 'ar' ? 'عدد الأبناء:' : 'Number of Sons:'}</span> <span className="font-bold">{formData.sonsCount}</span></div>
               <div><span className="text-slate-500">{lang === 'ar' ? 'عدد البنات:' : 'Number of Daughters:'}</span> <span className="font-bold">{formData.daughtersCount}</span></div>
               <div className="bg-slate-50 p-2"><span className="text-slate-500 font-bold">{t('netEstateLabel')}:</span> <span className="font-bold text-emerald-600">{results.netEstate.toLocaleString()} {results.currency}</span></div>
             </div>
           </section>

           <section>
             <h3 className="text-lg font-bold mb-4 border-b border-slate-200 pb-2">{lang === 'ar' ? 'جدول توزيع الأنصبة بالتفصيل' : 'Detailed Distribution Table'}</h3>
             <table className="w-full text-sm border-collapse">
               <thead>
                 <tr className="bg-slate-100 text-slate-600">
                   <th className="p-3 text-start border border-slate-200">{lang === 'ar' ? 'الوارث' : 'Heir'}</th>
                   <th className="p-3 text-center border border-slate-200">{lang === 'ar' ? 'النسبة' : 'Percentage'}</th>
                   <th className="p-3 text-end border border-slate-200">{lang === 'ar' ? 'المبلغ المستحق' : 'Due Amount'}</th>
                 </tr>
               </thead>
               <tbody>
                 {individualHeirs.map((heir, idx) => (
                   <tr key={idx}>
                     <td className="p-3 border border-slate-200 font-bold">{heir.name}</td>
                     <td className="p-3 border border-slate-200 text-center">{heir.percentage.toFixed(2)}%</td>
                     <td className="p-3 border border-slate-200 text-end font-bold">{heir.amount.toLocaleString()} {results.currency}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </section>
        </div>

        {/* عرض النتائج في الشاشة */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden no-print">
          <div className="bg-emerald-600 p-8 text-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {t('summaryTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase opacity-70 mb-1">{t('estateLabel')}</span>
                <span className="text-2xl font-black">{results.totalEstate.toLocaleString()} {results.currency}</span>
              </div>
              <div className="flex flex-col md:items-end">
                <span className="text-xs uppercase opacity-70 mb-1">{t('netEstateLabel')}</span>
                <span className="text-3xl font-black">{results.netEstate.toLocaleString()} {results.currency}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
              <Info className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-900 text-sm leading-relaxed">
                {t('distributionExplanation')}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {lang === 'ar' ? 'تفصيل الورثة والأنصبة' : 'Detailed Heirs & Shares'}
              </h3>
              
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-sm text-start">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4 text-start">{lang === 'ar' ? 'الوارث' : 'Heir'}</th>
                      <th className="px-6 py-4 text-center">{lang === 'ar' ? 'النسبة المئوية' : 'Percentage'}</th>
                      <th className="px-6 py-4 text-end">{lang === 'ar' ? 'نصيب الفرد' : 'Individual Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {individualHeirs.map((heir, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-700">{heir.name}</td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold">
                            {heir.percentage.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-5 text-end">
                          <div className="flex flex-col items-end">
                            <span className="font-black text-slate-800 text-base">{heir.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{results.currency}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-emerald-50/30">
                    <tr className="font-bold">
                      <td colSpan={2} className="px-6 py-4 text-start text-emerald-800">{lang === 'ar' ? 'إجمالي الموزع' : 'Total Distributed'}</td>
                      <td className="px-6 py-4 text-end text-emerald-600 text-lg">{totalDistributed.toLocaleString()} {results.currency}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center no-print">
          <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex-1 md:flex-none">
            <Download className="w-5 h-5" />
            {t('downloadPDF')}
          </button>
          <button onClick={() => { setView('form'); setStep(1); }} className="flex items-center justify-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex-1 md:flex-none">
            <RefreshCw className="w-5 h-5" />
            {t('reset')}
          </button>
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">{t('about')}</h2>
      <div className="prose prose-slate bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <p className="mb-6">
          {lang === 'ar'
            ? "تطبيق حاسبة المواريث الإسلامية هو مشروع يهدف إلى تيسير فهم فقه المواريث للجمهور العام."
            : "The Islamic Inheritance Calculator is a project aimed at simplifying the understanding of inheritance jurisprudence."}
        </p>
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
          <strong>{t('disclaimerTitle')}:</strong> {t('disclaimerText')}
        </div>
      </div>
      <button onClick={() => setView('home')} className="mt-8 flex items-center gap-2 px-6 py-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-all">
        <Home className="w-5 h-5" />
        {t('home')}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 no-print">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <span className="hidden md:block text-xl font-bold tracking-tight text-slate-800">{t('appName')}</span>
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => setView('about')} className="text-slate-500 font-medium hover:text-emerald-600 transition-colors text-sm">
              {t('about')}
            </button>
            <LanguageToggle currentLang={lang} onToggle={setLang} />
          </nav>
        </div>
      </header>

      <main>
        {view === 'home' && renderHome()}
        {view === 'form' && renderForm()}
        {view === 'results' && renderResults()}
        {view === 'about' && renderAbout()}
      </main>

      {view === 'home' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden no-print">
          <button onClick={() => setView('form')} className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-2xl transition-all">
            {t('start')}
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center no-print">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 text-center max-w-xs">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <Scale className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900 mb-1">{lang === 'ar' ? 'جاري الحساب...' : 'Calculating...'}</p>
              <p className="text-sm text-slate-500">{lang === 'ar' ? 'نقوم بتحليل الحالة وتوزيع الأنصبة شرعاً' : 'Analyzing the case according to Sharia'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
