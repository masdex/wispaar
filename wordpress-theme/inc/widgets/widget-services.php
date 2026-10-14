<?php
/**
 * Elementor Widget: Wispaar Services
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wispaar_Elementor_Services_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'wispaar_services';
    }

    public function get_title() {
        return esc_html__( 'خدمات ویسپار (Wispaar Services)', 'wispaar' );
    }

    public function get_icon() {
        return 'eicon-bullet-list';
    }

    public function get_categories() {
        return array( 'wispaar-elements' );
    }

    protected function render() {
        $services = array(
            array(
                'num'   => '01',
                'title' => 'طراحی و توسعه وب‌سایت‌های اختصاصی',
                'desc'  => 'معماری مدرن، سرعت لود زیر ۱ ثانیه، رابط کاربری اختصاصی بدون قالب‌های سنگین آماده، هماهنگ با هویت برند شما.',
                'link'  => home_url( '/services/web-design' ),
            ),
            array(
                'num'   => '02',
                'title' => 'توسعه و مهندسی پیشرفته وردپرس',
                'desc'  => 'قالب‌های سفارشی تمیز، کوئری‌های بهینه، امنیت بالا، و انطباق کامل با انواع صفحه‌سازها و سیستم‌های سفارشی.',
                'link'  => home_url( '/services/wordpress' ),
            ),
            array(
                'num'   => '03',
                'title' => 'طراحی صفحات فرود با نرخ تبدیل بالا (CRO)',
                'desc'  => 'تحلیل رفتار مخاطب، ساختاربندی پیام بر اساس درد مشتری، طراحی هدلاین‌های گیرا و تبدیل ترافیک به مشتری وفادار.',
                'link'  => home_url( '/services/landing-page' ),
            ),
            array(
                'num'   => '04',
                'title' => 'سئو تکنیکال و استراتژی ساختاریافته',
                'desc'  => 'بهینه‌سازی Core Web Vitals، ساختار داده Schema، استراتژی محتوای خوشه‌ای و رشد ارگانیک و پایدار در گوگل.',
                'link'  => home_url( '/services/technical-seo' ),
            ),
        );
        ?>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            <?php foreach ( $services as $s ) : ?>
                <div class="wispaar-card p-6" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="font-family:monospace; font-size:12px; color:#00D9FF; margin-bottom:12px;">// SERVICE <?php echo esc_html($s['num']); ?></div>
                        <h3 style="font-size:1.15rem; font-weight:700; color:#F5F8FC; margin-bottom:8px;"><?php echo esc_html($s['title']); ?></h3>
                        <p style="font-size:13px; color:#8C9BAD; line-height:1.7;"><?php echo esc_html($s['desc']); ?></p>
                    </div>
                    <div style="margin-top:16px; padding-top:12px; border-top:1px solid #172638;">
                        <a href="<?php echo esc_url($s['link']); ?>" style="font-size:12px; color:#00D9FF; font-weight:600;">مشاهده جزئیات خدمت ←</a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <?php
    }
}
