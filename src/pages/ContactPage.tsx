import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { Mail, Phone, MapPin, Clock, Send, Check, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'طراحی اختصاصی وب‌سایت',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      <Breadcrumb items={[{ label: 'تماس با ویسپار' }]} onNavigate={onNavigate} />

      {/* Header */}
      <section className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>DIRECT CONTACT / ارتباط مستقیم و استعلام</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          بیایید درباره مأموریت دیجیتال برند شما صحبت کنیم.
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed">
          فرقی نمی‌کند پروژه جدیدی در سر دارید یا به دنبال بازمهندسی ساختار فنی
          وب‌سایت فعلی خود هستید؛ ما آماده پاسخگویی دقیق و بدون معطلی هستیم.
        </p>
      </section>

      {/* Grid: Contact Info & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#F5F8FC] pb-3 border-b border-[#172638]">
              کانال‌های رسمی ارتباط با استودیو
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#00D9FF] shrink-0 mt-1" />
                <div>
                  <span className="text-[#536174] block text-xs">ایمیل رسمی مکاتبات:</span>
                  <a
                    href="mailto:contact@wispaar.com"
                    className="font-mono text-[#F5F8FC] hover:text-[#00D9FF] transition-colors"
                  >
                    contact@wispaar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#00D9FF] shrink-0 mt-1" />
                <div>
                  <span className="text-[#536174] block text-xs">زمان پاسخگویی:</span>
                  <span className="text-[#F5F8FC]">شنبه تا چهارشنبه، ۹ الی ۱۸ (حداکثر ۲۴ ساعت کاری)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#00D9FF] shrink-0 mt-1" />
                <div>
                  <span className="text-[#536174] block text-xs">فرم بریف تفصیلی:</span>
                  <button
                    onClick={() => onNavigate('start-project')}
                    className="text-[#4AA3FF] hover:underline"
                  >
                    ورود به فرم بریف ۵ مرحله‌ای پروژه ←
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#172638] text-xs text-[#8C9BAD] leading-relaxed">
              <strong>تعهد ویسپار به حریم داده‌ها: </strong> اطلاعات ارسال‌شده توسط
              شما محرمانه تلقی شده و تحت هیچ شرایطی در اختیار طرف‌های ثالث قرار
              نخواهد گرفت.
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#06111F] border border-[#23364C] rounded-2xl p-8 sm:p-10">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E] text-[#22C55E] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F8FC]">پیام شما دریافت شد</h3>
              <p className="text-sm text-[#8C9BAD] max-w-md mx-auto">
                سپاس از حسن اعتماد شما. پیام شما در اولویت بررسی کارشناسان قرار گرفت
                و به زودی با شما تماس حاصل خواهد شد.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-[#F5F8FC] mb-2">
                ارسال پیام یا استعلام اولیه
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                    نام شما / نام برند *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سهراب حسینی"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                    ایمیل شما *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                    شماره تماس همراه *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="۰۹۱۲..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                    خدمت مورد نظر
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] px-4 py-3 rounded-xl text-xs sm:text-sm outline-none transition-colors cursor-pointer"
                  >
                    <option value="طراحی اختصاصی وب‌سایت">طراحی و توسعه وب‌سایت اختصاصی</option>
                    <option value="توسعه و بهینه‌سازی وردپرس">توسعه و بهینه‌سازی پیشرفته وردپرس</option>
                    <option value="سئو تکنیکال و معماری">سئو، استراتژی و معماری کلمات</option>
                    <option value="طراحی لندینگ پیج">طراحی صفحات فرود (Landing Pages)</option>
                    <option value="بهینه‌سازی سرعت و پرفورمنس">بهینه‌سازی پرفورمنس و Core Web Vitals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C9BAD] mb-1.5">
                  پیام شما / شرح مختصر نیازها:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="لطفاً شرح کوتاهی از اهداف یا چالش‌های وب‌سایت خود بنویسید..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-[#F5F8FC] p-4 rounded-xl text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all cursor-pointer shadow-md shadow-[#1769FF]/25 flex items-center justify-center gap-2"
              >
                {loading ? 'در حال ارسال...' : 'ارسال پیام به استودیو ویسپار'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
