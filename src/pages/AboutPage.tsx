import React from 'react';
import { PageRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Compass, ShieldCheck, Cpu, Lightbulb, CheckCircle2, ArrowUpLeft } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-20">
      <Breadcrumb items={[{ label: 'درباره ویسپار' }]} onNavigate={onNavigate} />

      {/* Hero Statement */}
      <section className="max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-4">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>ABOUT WISPAAR / هویت و رسالت ویسپار</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight mb-8">
          ترکیب خرد انسانی و مهندسی فناوری؛ برای آفریدن آثاری فراتر از زمان.
        </h1>
        <p className="text-lg text-[#C5D0DD] leading-relaxed max-w-3xl">
          نام <strong className="text-white">ویسپار (WISPAAR)</strong> بر مبنای پیوند
          معنادار دو کلیدواژه بنیادین شکل گرفت: <strong className="text-[#00D9FF]">Wisdom</strong> (خرد،
          استراتژی، درک موقعیت و ژرف‌اندیشی) و <strong className="text-[#1769FF]">Technology</strong> (فناوری،
          توسعه نرم‌افزار، طراحی سیستماتیک و کدنویسی پاک).
        </p>
      </section>

      {/* Philosophy Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-b border-[#172638] py-14">
        <div className="space-y-4">
          <div className="text-xs font-mono text-[#00D9FF]">فلسفه برند</div>
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            آفرینش با خرد؛ پاسخی به آشفتگی وب مدرن
          </h2>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            امروزه ساختن یک وب‌سایت در دسترس همگان قرار گرفته است؛ اما دقیقاً به
            همین دلیل، ۹۰ درصد وب‌سایت‌های جدید شبیه یکدیگرند. قالب‌های یکسان،
            کدهای کپی‌شده، افکت‌های بصری تصادفی و متونی که هیچ ارزشی منتقل
            نمی‌کنند.
          </p>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            ویسپار به‌عنوان یک استودیو دیزاین و فناوری دیجیتال متولد شد تا این چرخه
            سطحی‌نگری را متوقف کند. برای ما، «آفرینش با خرد» یعنی هر خط کد، هر
            فاصله‌گذاری (Padding)، هر ساختار داده و هر تایپوگرافی، دارای هدف،
            منطق و وزن مشخصی باشد.
          </p>
        </div>

        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-6">
          <div className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider">
            اصول چهارگانه تفکر ویسپار
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="font-mono text-[#00D9FF] text-xs mt-1">۰۱.</span>
              <div>
                <strong className="text-[#F5F8FC] block mb-1">انضباط ساختاری و هندسی:</strong>
                <span className="text-[#8C9BAD]">
                  نظم در گرید، آرامش در فضای خالی و عدم شلوغی‌های بصری غیرکاربردی.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-mono text-[#00D9FF] text-xs mt-1">۰۲.</span>
              <div>
                <strong className="text-[#F5F8FC] block mb-1">کدنویسی پاک و بدون بار اضافه:</strong>
                <span className="text-[#8C9BAD]">
                  حذف پلاگین‌های زائد و توسعه اختصاصی بر پایه بالاترین استانداردهای پرفورمنس وب.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-mono text-[#00D9FF] text-xs mt-1">۰۳.</span>
              <div>
                <strong className="text-[#F5F8FC] block mb-1">سئو از بطن معماری، نه بزک ظاهری:</strong>
                <span className="text-[#8C9BAD]">
                  طراحی ساختار URLها، اسکیما و متاتگ‌ها از نخستین گام‌های کدنویسی فرانت‌اند.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="font-mono text-[#00D9FF] text-xs mt-1">۰۴.</span>
              <div>
                <strong className="text-[#F5F8FC] block mb-1">صداقت حرفه‌ای و واقع‌گرایی:</strong>
                <span className="text-[#8C9BAD]">
                  ما آمارهای ساختگی نمی‌فروشیم؛ با کار باکیفیت و نتایج سنجش‌پذیر اعتماد می‌سازیم.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Think & How We Build */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
            HOW WE THINK & BUILD
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC]">
            چگونه با خرد خلق می‌کنیم؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#06111F] border border-[#172638] rounded-xl p-6 space-y-3">
            <Cpu className="w-6 h-6 text-[#00D9FF]" />
            <h3 className="text-base font-bold text-[#F5F8FC]">مهندسی فرانت‌اند تمیز</h3>
            <p className="text-xs text-[#8C9BAD] leading-relaxed">
              ما اسکریپت‌ها را ماژولار می‌سازیم. عدم استفاده از بسته‌های حجیم بلااستفاده و
              رعایت کامل معیارهای Core Web Vitals گوگل برای دستیابی به سرعت زیر ۱ ثانیه.
            </p>
          </div>

          <div className="bg-[#06111F] border border-[#172638] rounded-xl p-6 space-y-3">
            <Compass className="w-6 h-6 text-[#1769FF]" />
            <h3 className="text-base font-bold text-[#F5F8FC]">طراحی تجربه کاربری اصیل</h3>
            <p className="text-xs text-[#8C9BAD] leading-relaxed">
              طراحی برای چشم‌های انسانی و تصمیم‌گیرندگان هوشمند. ایجاد سلسله‌مراتب بصری،
              تایپوگرافی چشم‌نواز فارسی و مسیرهای روان برای انجام اقدام مورد نظر.
            </p>
          </div>

          <div className="bg-[#06111F] border border-[#172638] rounded-xl p-6 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
            <h3 className="text-base font-bold text-[#F5F8FC]">پایداری، امنیت و مقیاس‌پذیری</h3>
            <p className="text-xs text-[#8C9BAD] leading-relaxed">
              وب‌سایتی که ساخته می‌شود در روزهای اوج ترافیک پایدار می‌ماند، در برابر نفوذ
              امن است و با رشد کسب‌وکار شما در آینده، نیازی به بازنویسی کامل ندارد.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#06111F] border border-[#23364C] rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-right">
          <h3 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
            می‌خواهید اثر دیجیتال برند شما را با هم آغاز کنیم؟
          </h3>
          <p className="text-sm text-[#8C9BAD]">
            مشتاقیم درباره چالش‌ها و چشم‌انداز آینده وب‌سایت شما هم‌فکری کنیم.
          </p>
        </div>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-3 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] transition-colors rounded-xl whitespace-nowrap cursor-pointer shadow-md"
        >
          شروع گفت‌وگوی پروژه ←
        </button>
      </section>
    </div>
  );
};
