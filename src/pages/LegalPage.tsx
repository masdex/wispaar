import React from 'react';
import { PageRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'حریم خصوصی و حفاظت از داده‌ها' : 'شرایط و ضوابط همکاری حرفه‌ای';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      <Breadcrumb items={[{ label: title }]} onNavigate={onNavigate} />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>LEGAL STANDARDS / قوانین و شفافیت حقوقی</span>
        </div>
        <h1 className="text-3xl font-bold text-[#F5F8FC]">{title}</h1>
        <p className="text-sm text-[#8C9BAD]">آخرین به‌روزرسانی: مهرماه ۱۴۰۴</p>
      </header>

      <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 sm:p-10 space-y-8 text-sm text-[#C5D0DD] leading-relaxed">
        {isPrivacy ? (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۱. تعهد بنیادین به حفظ محرمانگی</h2>
              <p>
                استودیو ویسپار به عنوان یک مجموعه مهندسی دیجیتال، امنیت اطلاعات کارفرمایان را
                اولویت درجه یک خود می‌داند. تمامی داده‌های وارد شده در فرم‌های بریف، دسترسی‌های
                سرور و اسناد تجاری کارفرما تحت پیمان‌نامه رازداری (NDA) تلقی می‌شوند.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۲. نوع داده‌های دریافتی</h2>
              <p>
                ما صرفاً داده‌های فنی و ارتباطی ضروری را دریافت می‌کنیم: نام و نام خانوادگی،
                شماره تماس، آدرس ایمیل و مستندات پروژه جهت برآورد دقیق بریف. ما از هیچ ابزار
                ردیابی غیرمجاز یا فروش اطلاعات به اشخاص ثالث استفاده نمی‌کنیم.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۳. امنیت در سرورها و محیط تست</h2>
              <p>
                کلیه محیط‌های استیجینگ و توسعه تحت پروتکل‌های رمزنگاری پیشرفته و با دسترسی‌های
                محدود محافظت می‌گردند.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۱. شفافیت در اقلام تحویلی (Deliverables)</h2>
              <p>
                هر پروژه در استودیو ویسپار بر اساس قرارداد رسمی مشخص با پیوست دقیق اقلام
                تحویلی، وایرفریم‌ها، متدهای پرفورمنس و گارانتی کارکرد توسعه می‌یابد.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۲. مالکیت معنوی و کدهای پروژه</h2>
              <p>
                پس از تسویه حساب نهایی، کلیه کدهای اختصاصی، دارایی‌های گرافیکی و دسترسی‌های
                کامل پنل مدیریت و هاست به کارفرما تحویل داده می‌شود و کارفرما مالک کامل اثر خواهد بود.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[#F5F8FC]">۳. گارانتی عملکرد و پشتیبانی</h2>
              <p>
                تمام پروژه‌ها دارای دوره تست و گارانتی رفع عیوب فنی بدون هزینه اضافی هستند تا
                اطمینان حاصل شود پروژه با بالاترین پایداری در دسترس عموم قرار گرفته است.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
