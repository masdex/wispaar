<?php
/**
 * Elementor Widget: Wispaar Brief Form
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wispaar_Elementor_Brief_Form_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'wispaar_brief_form';
    }

    public function get_title() {
        return esc_html__( 'فرم هوشمند بریف پروژه (Wispaar Brief Form)', 'wispaar' );
    }

    public function get_icon() {
        return 'eicon-form-horizontal';
    }

    public function get_categories() {
        return array( 'wispaar-elements' );
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__( 'تنظیمات فرم', 'wispaar' ),
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'form_title',
            array(
                'label'   => esc_html__( 'عنوان فرم', 'wispaar' ),
                'type'    => \Elementor\Controls_Manager::TEXT,
                'default' => 'آغاز فرآیند همکاری: تنظیم بریف پروژه',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        ?>
        <div id="wispaar-brief-section" class="bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-10 text-right">
            <div class="mb-8">
                <span class="badge-code mb-2">&lt;INTERACTIVE BRIEF CONFIGURATOR&gt;</span>
                <h2 class="text-2xl sm:text-3xl font-bold text-[#F5F8FC] mt-2">
                    <?php echo esc_html( $settings['form_title'] ); ?>
                </h2>
                <p class="text-sm text-[#8C9BAD] mt-1">
                    پاسخ‌های شما مستقیماً در پنل مدیریت وردپرس ذخیره شده و تیم فنی پس از تحلیل ساختار با شما تماس خواهد گرفت.
                </p>
            </div>

            <div id="brief-result-msg" style="display:none; padding:12px; margin-bottom:16px; border-radius:8px; font-weight:500; font-size:14px; background:#0A1626; border:1px solid #172638;"></div>

            <form id="wispaar-brief-form" class="space-y-6">
                <!-- مرحله ۱: نیازهای اصلی -->
                <div id="brief-step-1">
                    <h3 class="text-base font-bold text-[#00D9FF] mb-4">۱. به چه خدماتی نیاز دارید؟</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;">
                            <input type="checkbox" name="services[]" value="طراحی وب‌سایت اختصاصی">
                            <span style="font-size:13px; color:#F5F8FC;">طراحی وب‌سایت اختصاصی</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;">
                            <input type="checkbox" name="services[]" value="توسعه و مهندسی وردپرس">
                            <span style="font-size:13px; color:#F5F8FC;">توسعه و مهندسی وردپرس</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;">
                            <input type="checkbox" name="services[]" value="صفحه فرود و نرخ تبدیل (CRO)">
                            <span style="font-size:13px; color:#F5F8FC;">صفحه فرود و نرخ تبدیل (CRO)</span>
                        </label>
                        <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;">
                            <input type="checkbox" name="services[]" value="سئو تکنیکال و استراتژی رشد">
                            <span style="font-size:13px; color:#F5F8FC;">سئو تکنیکال و استراتژی رشد</span>
                        </label>
                    </div>
                </div>

                <!-- مرحله ۲: وضعیت و بستر فعلی -->
                <div id="brief-step-2" style="display:none;">
                    <h3 class="text-base font-bold text-[#00D9FF] mb-4">۲. بستر و اهداف فعلی</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">سیستم مدیریت محتوا یا فریم‌ورک فعلی:</label>
                            <input type="text" name="platform" placeholder="مثلاً: وردپرس، لاراول، سایت جدید..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">آدرس وب‌سایت فعلی (در صورت وجود):</label>
                            <input type="url" name="website" placeholder="https://example.com" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;">
                        </div>
                    </div>
                </div>

                <!-- مرحله ۳: بودجه و زمان‌بندی -->
                <div id="brief-step-3" style="display:none;">
                    <h3 class="text-base font-bold text-[#00D9FF] mb-4">۳. برآورد بودجه و زمان‌بندی</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">محدوده بودجه سرمایه‌گذاری:</label>
                            <select name="budget" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;">
                                <option value="زیر ۵۰ میلیون تومان">زیر ۵۰ میلیون تومان (پروژه‌های چابک)</option>
                                <option value="۵۰ تا ۱۰۰ میلیون تومان" selected>۵۰ تا ۱۰۰ میلیون تومان (استاندارد شرکتی)</option>
                                <option value="۱۰۰ تا ۲۰۰ میلیون تومان">۱۰۰ تا ۲۰۰ میلیون تومان (پلتفرم‌های جامع)</option>
                                <option value="بالای ۲۰۰ میلیون تومان">بالای ۲۰۰ میلیون تومان (سازمانی و مقیاس بزرگ)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">زمان‌بندی ایده‌آل برای تحویل:</label>
                            <select name="timeline" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;">
                                <option value="فوری (زیر ۳ هفته)">فوری (زیر ۳ هفته)</option>
                                <option value="۱ تا ۲ ماه" selected>۱ تا ۲ ماه (روال مهندسی متعارف)</option>
                                <option value="۳ ماه به بالا">۳ ماه به بالا (پروژه‌های عمیق پژوهشی)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- مرحله ۴: اطلاعات تماس -->
                <div id="brief-step-4" style="display:none;">
                    <h3 class="text-base font-bold text-[#00D9FF] mb-4">۴. مشخصات تماس و توضیحات تکمیلی</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">نام و نام خانوادگی / نام برند *</label>
                            <input type="text" name="name" required placeholder="مثال: علی احمدی / گروه آریا" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">شماره تماس همراه *</label>
                            <input type="tel" name="phone" required placeholder="۰۹۱۲..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">پست الکترونیکی (ایمیل) *</label>
                            <input type="email" name="email" required placeholder="info@brand.com" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">توضیحات تکمیلی، چالش‌ها یا نیازمندی‌های اختصاصی:</label>
                        <textarea name="description" rows="3" placeholder="مختصری درباره چشم‌انداز یا چالش اصلی پروژه بنویسید..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"></textarea>
                    </div>
                </div>

                <!-- کنترل دکمه‌های فرم -->
                <div style="display:flex; items-center; justify-content:space-between; padding-top:16px; border-top:1px solid #172638;">
                    <button type="button" id="brief-prev-step" class="btn-secondary" style="display:none;">
                        → مرحله قبل
                    </button>
                    <div></div>
                    <button type="button" id="brief-next-step" class="btn-primary">
                        مرحله بعد ←
                    </button>
                    <button type="submit" id="brief-submit-btn" class="btn-primary" style="display:none; background:#22C55E;">
                        ثبت نهایی بریف در سیستم وردپرس ✓
                    </button>
                </div>
            </form>
        </div>
        <?php
    }

    public function render_plain_content() {
        $this->render();
    }
}

function wispaar_render_brief_form( $title = 'آغاز فرآیند همکاری: تنظیم بریف پروژه' ) {
    ?>
    <div id="wispaar-brief-section" class="bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-10 text-right">
        <div class="mb-8">
            <span class="badge-code mb-2">&lt;INTERACTIVE BRIEF CONFIGURATOR&gt;</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#F5F8FC] mt-2"><?php echo esc_html( $title ); ?></h2>
            <p class="text-sm text-[#8C9BAD] mt-1">پاسخ‌های شما مستقیماً در پنل مدیریت وردپرس ذخیره شده و تیم فنی پس از تحلیل ساختار با شما تماس خواهد گرفت.</p>
        </div>
        <div id="brief-result-msg" style="display:none; padding:12px; margin-bottom:16px; border-radius:8px; font-weight:500; font-size:14px; background:#0A1626; border:1px solid #172638;"></div>
        <form id="wispaar-brief-form" class="space-y-6">
            <div id="brief-step-1">
                <h3 class="text-base font-bold text-[#00D9FF] mb-4">۱. به چه خدماتی نیاز دارید؟</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;"><input type="checkbox" name="services[]" value="طراحی وب‌سایت اختصاصی"><span style="font-size:13px; color:#F5F8FC;">طراحی وب‌سایت اختصاصی</span></label>
                    <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;"><input type="checkbox" name="services[]" value="توسعه و مهندسی وردپرس"><span style="font-size:13px; color:#F5F8FC;">توسعه و مهندسی وردپرس</span></label>
                    <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;"><input type="checkbox" name="services[]" value="صفحه فرود و نرخ تبدیل (CRO)"><span style="font-size:13px; color:#F5F8FC;">صفحه فرود و نرخ تبدیل (CRO)</span></label>
                    <label style="display:flex; align-items:center; gap:8px; padding:12px; background:#0A1626; border:1px solid #172638; border-radius:8px; cursor:pointer;"><input type="checkbox" name="services[]" value="سئو تکنیکال و استراتژی رشد"><span style="font-size:13px; color:#F5F8FC;">سئو تکنیکال و استراتژی رشد</span></label>
                </div>
            </div>
            <div id="brief-step-2" style="display:none;">
                <h3 class="text-base font-bold text-[#00D9FF] mb-4">۲. بستر و اهداف فعلی</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">سیستم مدیریت محتوا یا فریم‌ورک فعلی:</label><input type="text" name="platform" placeholder="مثلاً: وردپرس، لاراول، سایت جدید..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"></div>
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">آدرس وب‌سایت فعلی (در صورت وجود):</label><input type="url" name="website" placeholder="https://example.com" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;"></div>
                </div>
            </div>
            <div id="brief-step-3" style="display:none;">
                <h3 class="text-base font-bold text-[#00D9FF] mb-4">۳. برآورد بودجه و زمان‌بندی</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">محدوده بودجه سرمایه‌گذاری:</label><select name="budget" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"><option value="زیر ۵۰ میلیون تومان">زیر ۵۰ میلیون تومان</option><option value="۵۰ تا ۱۰۰ میلیون تومان" selected>۵۰ تا ۱۰۰ میلیون تومان</option><option value="۱۰۰ تا ۲۰۰ میلیون تومان">۱۰۰ تا ۲۰۰ میلیون تومان</option><option value="بالای ۲۰۰ میلیون تومان">بالای ۲۰۰ میلیون تومان</option></select></div>
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">زمان‌بندی تحویل:</label><select name="timeline" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"><option value="فوری (زیر ۳ هفته)">فوری (زیر ۳ هفته)</option><option value="۱ تا ۲ ماه" selected>۱ تا ۲ ماه</option><option value="۳ ماه به بالا">۳ ماه به بالا</option></select></div>
                </div>
            </div>
            <div id="brief-step-4" style="display:none;">
                <h3 class="text-base font-bold text-[#00D9FF] mb-4">۴. مشخصات تماس و توضیحات تکمیلی</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">نام و نام خانوادگی / نام برند *</label><input type="text" name="name" required placeholder="مثال: علی احمدی" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"></div>
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">شماره تماس همراه *</label><input type="tel" name="phone" required placeholder="۰۹۱۲..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;"></div>
                    <div><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">پست الکترونیکی (ایمیل) *</label><input type="email" name="email" required placeholder="info@brand.com" style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px; direction:ltr;"></div>
                </div>
                <div class="mb-4"><label style="display:block; font-size:12px; color:#8C9BAD; margin-bottom:6px;">توضیحات تکمیلی:</label><textarea name="description" rows="3" placeholder="مختصری درباره چشم‌انداز یا چالش اصلی پروژه بنویسید..." style="width:100%; padding:10px 14px; background:#0A1626; border:1px solid #172638; border-radius:8px; color:#F5F8FC; font-size:14px;"></textarea></div>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:16px; border-top:1px solid #172638;">
                <button type="button" id="brief-prev-step" class="btn-secondary" style="display:none;">→ مرحله قبل</button>
                <div></div>
                <button type="button" id="brief-next-step" class="btn-primary">مرحله بعد ←</button>
                <button type="submit" id="brief-submit-btn" class="btn-primary" style="display:none; background:#22C55E;">ثبت نهایی بریف در سیستم وردپرس ✓</button>
            </div>
        </form>
    </div>
    <?php
}
