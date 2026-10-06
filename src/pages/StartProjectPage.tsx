import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Check, CheckCircle2, ArrowRight, ArrowLeft, Send, Sparkles } from 'lucide-react';

interface StartProjectPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const StartProjectPage: React.FC<StartProjectPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const servicesList = [
    'طراحی و توسعه وب‌سایت اختصاصی',
    'مهندسی و توسعه پیشرفته وردپرس',
    'سئو تکنیکال و معماری کلمات',
    'طراحی لندینگ پیج و افزایش نرخ تبدیل',
    'بهینه‌سازی سرعت و پرفورمنس Core Web Vitals',
    'راهکارهای یکپارچه دیجیتال و IT'
  ];

  const goalsList = [
    'ساخت هویت و اعتبار متمایز برند',
    'افزایش نرخ تبدیل سرنخ و فروش آنلاین',
    'افزایش ترافیک ارگانیک از موتورهای جستجو',
    'حل کُندی سرعت و باگ‌های فنی فعلی',
    'بازطراحی کامل ساختار و مهاجرت پلتفرم'
  ];

  const budgetOptions = [
    'پروژه متمرکز (شروع مناسب برای لندینگ یا بهینه‌سازی فنی)',
    'پروژه جامع شرکتی / پورتال اختصاصی استاندارد',
    'پروژه سطح یک سازمانی با معماری سفارشی و سئو بلندمدت',
    'نیاز به مشاوره جهت برآورد بودجه دقیق دارم'
  ];

  const timelineOptions = [
    'فوری (طی ۲ الی ۳ هفته)',
    'استاندارد (طی ۱ الی ۲ ماه)',
    'انعطاف‌پذیر / در مرحله برنامه‌ریزی استراتژیک'
  ];

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <Breadcrumb items={[{ label: 'شروع یک پروژه (Project Brief)' }]} onNavigate={onNavigate} />

      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>START A PROJECT / بریف هوشمند پروژه</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F8FC]">
          سند نیازمندی‌های پروژه خود را در ۵ گام شفاف کنید.
        </h1>
        <p className="text-sm sm:text-base text-[#8C9BAD] leading-relaxed">
          این فرم یک تماس ساده نیست؛ یک ابزار دقیق برای درک اهداف کسب‌وکار شماست
          تا پیش از نخستین جلسه مشاوره، نقشه ذهنی پروژه شفاف شده باشد.
        </p>
      </section>

      {/* Progress Stepper */}
      <div className="bg-[#06111F] border border-[#172638] rounded-xl p-4 flex items-center justify-between text-xs font-mono text-[#8C9BAD]">
        {[
          { num: 1, label: 'خدمات' },
          { num: 2, label: 'اهداف' },
          { num: 3, label: 'پلتفرم' },
          { num: 4, label: 'بودجه و زمان' },
          { num: 5, label: 'اطلاعات تماس' }
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-1.5 ${
              currentStep === s.num
                ? 'text-[#00D9FF] font-bold'
                : currentStep > s.num
                ? 'text-[#22C55E]'
                : 'text-[#536174]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              currentStep === s.num
                ? 'bg-[#1769FF] text-white'
                : currentStep > s.num
                ? 'bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-[#0A1626] text-[#536174]'
            }`}>
              {currentStep > s.num ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline font-sans">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-[#06111F] border border-[#23364C] rounded-2xl p-6 sm:p-10 shadow-2xl">
        {isSubmitted ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E] text-[#22C55E] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#F5F8FC]">
              بریف پروژه شما با موفقیت در ویسپار ثبت شد!
            </h2>
            <p className="text-sm text-[#8C9BAD] max-w-lg mx-auto leading-relaxed">
              کارشناسان ارشد استودیو ویسپار اطلاعات ورودی را بررسی کرده و ظرف
              حداکثر ۲۴ ساعت کاری جهت هماهنگی جلسه ارزیابی استراتژیک با شما
              تماس خواهند گرفت.
            </p>
            {/* Success state buttons */}
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1769FF] rounded-xl hover:bg-[#155bd8] transition-colors cursor-pointer"
              >
                بازگشت به صفحه اصلی
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setSelectedServices([]);
                  setSelectedGoals([]);
                  setCurrentPlatform('');
                  setWebsiteUrl('');
                  setBudgetRange('');
                  setTimeline('');
                  setClientName('');
                  setClientEmail('');
                  setClientPhone('');
                  setProjectDescription('');
                }}
                className="px-6 py-2.5 text-xs font-medium text-[#00D9FF] bg-[#0A1626] border border-[#23364C] rounded-xl hover:bg-[#0F2035] transition-colors cursor-pointer"
              >
                ثبت بریف پروژه جدید
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-2.5 text-xs font-medium text-[#C5D0DD] bg-[#0A1626] border border-[#172638] rounded-xl hover:text-white cursor-pointer"
              >
                مرور نمونه‌کارها
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: SERVICES */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F8FC] mb-1">
                    گام ۱: به چه خدماتی برای پروژه خود نیاز دارید؟
                  </h3>
                  <p className="text-xs text-[#8C9BAD]">
                    می‌توانید یک یا چند مورد از حوزه‌های زیر را انتخاب نمایید:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map((srv, idx) => {
                    const isSelected = selectedServices.includes(srv);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleService(srv)}
                        className={`p-4 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC] shadow-sm'
                            : 'bg-[#03070D] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-medium">{srv}</span>
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-bold text-xs' : 'border-[#23364C]'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: GOALS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F8FC] mb-1">
                    گام ۲: اصلی‌ترین هدف یا دستاورد مورد انتظار چیست؟
                  </h3>
                  <p className="text-xs text-[#8C9BAD]">
                    رسیدن به چه مقصدی این پروژه را برای شما به یک موفقیت واقعی تبدیل می‌کند؟
                  </p>
                </div>

                <div className="space-y-3">
                  {goalsList.map((g, idx) => {
                    const isSelected = selectedGoals.includes(g);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleGoal(g)}
                        className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC]'
                            : 'bg-[#03070D] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{g}</span>
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-bold text-xs' : 'border-[#23364C]'
                        }`}>
                          {isSelected && '✓'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: CURRENT PLATFORM */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F8FC] mb-1">
                    گام ۳: بستر و آدرس وب‌سایت فعلی (در صورت وجود)
                  </h3>
                  <p className="text-xs text-[#8C9BAD]">
                    اگر پروژه جدید است، فیلد آدرس را خالی بگذارید.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                      آدرس وب‌سایت فعلی:
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                      وضعیت یا بستر فنی فعلی:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['پروژه جدید (از ابتدا)', 'سایت وردپرسی موجود', 'سیستم یا پلتفرم اختصاصی'].map((plat) => (
                        <button
                          type="button"
                          key={plat}
                          onClick={() => setCurrentPlatform(plat)}
                          className={`p-3.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                            currentPlatform === plat
                              ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC]'
                              : 'bg-[#03070D] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                          }`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BUDGET & TIMELINE */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F8FC] mb-1">
                    گام ۴: محدوده بودجه و زمان‌بندی مورد نظر
                  </h3>
                  <p className="text-xs text-[#8C9BAD]">
                    تعیین این بازه‌ها به ما کمک می‌کند واقع‌بینانه‌ترین پکیج فنی را پیشنهاد دهیم.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                      محدوده سطح سرمایه‌گذاری:
                    </label>
                    <div className="space-y-2">
                      {budgetOptions.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setBudgetRange(opt)}
                          className={`w-full p-3.5 rounded-xl border text-right text-xs transition-all cursor-pointer ${
                            budgetRange === opt
                              ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC]'
                              : 'bg-[#03070D] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                      زمان‌بندی مد نظر برای تحویل:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {timelineOptions.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setTimeline(time)}
                          className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                            timeline === time
                              ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC]'
                              : 'bg-[#03070D] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT LEAD CAPTURE */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F5F8FC] mb-1">
                    گام ۵: اطلاعات ارتباطی و شرح مختصر پروژه
                  </h3>
                  <p className="text-xs text-[#8C9BAD]">
                    این اطلاعات صرفاً برای هماهنگی مستقیم جلسه ارزیابی استفاده می‌شود.
                  </p>
                </div>

                {/* Selected Brief Summary Badge */}
                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl text-xs space-y-2">
                  <div className="font-semibold text-[#00D9FF] flex items-center justify-between">
                    <span>خلاصه انتخاب‌های شما در گام‌های پیشین:</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-[#4AA3FF] hover:underline"
                    >
                      ویرایش انتخاب‌ها
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#C5D0DD]">
                    <div>
                      <span className="text-[#536174]">خدمات: </span>
                      {selectedServices.length > 0 ? selectedServices.join('، ') : 'انتخاب نشده'}
                    </div>
                    <div>
                      <span className="text-[#536174]">اهداف: </span>
                      {selectedGoals.length > 0 ? selectedGoals.join('، ') : 'انتخاب نشده'}
                    </div>
                    <div>
                      <span className="text-[#536174]">بستر فعلی: </span>
                      {currentPlatform || websiteUrl || 'پروژه جدید'}
                    </div>
                    <div>
                      <span className="text-[#536174]">بودجه و زمان: </span>
                      {budgetRange ? budgetRange.split('(')[0] : 'مشاوره'} / {timeline || 'استاندارد'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                      نام و نام خانوادگی / نام سازمان *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: علیرضا محمدی (شرکت آریا)"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                      ایمیل معتبر سازمانی / شخصی *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                      شماره تماس همراه (جهت هماهنگی جلسه) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                      dir="ltr"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                      توضیحات تکمیلی یا چشم‌انداز کلی شما:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="نکات مهم، نیازمندی‌های خاص یا انتظاراتی که برای شما حیاتی است..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] p-4 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="pt-6 border-t border-[#172638] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 text-xs font-medium text-[#8C9BAD] hover:text-white bg-[#03070D] border border-[#172638] rounded-xl transition-colors cursor-pointer"
                >
                  ← مرحله قبلی
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  مرحله بعدی →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !clientName || !clientEmail || !clientPhone}
                  className="px-7 py-3 text-xs sm:text-sm font-semibold text-white bg-[#22C55E] hover:bg-[#1ea850] disabled:opacity-40 disabled:hover:bg-[#22C55E] rounded-xl transition-all cursor-pointer shadow-lg shadow-[#22C55E]/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>در حال ارسال بریف...</span>
                  ) : (
                    <>
                      <span>ثبت نهایی بریف پروژه ویسپار</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
