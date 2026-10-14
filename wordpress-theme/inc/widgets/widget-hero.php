<?php
/**
 * Elementor Widget: Wispaar Hero
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wispaar_Elementor_Hero_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'wispaar_hero';
    }

    public function get_title() {
        return esc_html__( 'هیرو اختصاصی ویسپار (Wispaar Hero)', 'wispaar' );
    }

    public function get_icon() {
        return 'eicon-banner';
    }

    public function get_categories() {
        return array( 'wispaar-elements' );
    }

    protected function register_controls() {
        $this->start_controls_section(
            'content_section',
            array(
                'label' => esc_html__( 'تنظیمات محتوا', 'wispaar' ),
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'subtitle',
            array(
                'label'       => esc_html__( 'پیش‌عنوان / امضا', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => 'WISDOM + TECHNOLOGY / آفرینش با خرد',
            )
        );

        $this->add_control(
            'headline',
            array(
                'label'       => esc_html__( 'عنوان اصلی', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::TEXTAREA,
                'default'     => 'ایده‌ها را فقط اجرا نمی‌کنیم؛ آن‌ها را به تجربه‌های دیجیتال ماندگار تبدیل می‌کنیم.',
            )
        );

        $this->add_control(
            'description',
            array(
                'label'       => esc_html__( 'توضیحات معرفی', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::TEXTAREA,
                'default'     => 'ویسپار یک استودیو فناوری و طراحی دیجیتال است. ما وب‌سایت‌های اختصاصی، زیرساخت مهندسی وردپرس، لندینگ‌پیج‌های پرتبدیل و سئو تکنیکال را با استانداردهای بین‌المللی خلق می‌کنیم.',
            )
        );

        $this->add_control(
            'cta_text_1',
            array(
                'label'       => esc_html__( 'متن دکمه اول', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => 'شروع یک پروژه ←',
            )
        );

        $this->add_control(
            'cta_link_1',
            array(
                'label'       => esc_html__( 'لینک دکمه اول', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::URL,
                'placeholder' => '#wispaar-brief-section',
                'default'     => array(
                    'url'               => '#wispaar-brief-section',
                    'is_external'       => false,
                    'nofollow'          => false,
                    'custom_attributes' => '',
                ),
            )
        );

        $this->add_control(
            'cta_text_2',
            array(
                'label'       => esc_html__( 'متن دکمه دوم', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::TEXT,
                'default'     => 'مشاهده نمونه‌کارها',
            )
        );

        $this->add_control(
            'cta_link_2',
            array(
                'label'       => esc_html__( 'لینک دکمه دوم', 'wispaar' ),
                'type'        => \Elementor\Controls_Manager::URL,
                'placeholder' => '#portfolio',
                'default'     => array(
                    'url'               => '#portfolio',
                    'is_external'       => false,
                    'nofollow'          => false,
                    'custom_attributes' => '',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();

        $cta_1_url = '#wispaar-brief-section';
        if ( ! empty( $settings['cta_link_1'] ) ) {
            if ( is_array( $settings['cta_link_1'] ) && ! empty( $settings['cta_link_1']['url'] ) ) {
                $cta_1_url = $settings['cta_link_1']['url'];
            } elseif ( is_string( $settings['cta_link_1'] ) ) {
                $cta_1_url = $settings['cta_link_1'];
            }
        }

        $cta_2_url = '#portfolio';
        if ( ! empty( $settings['cta_link_2'] ) ) {
            if ( is_array( $settings['cta_link_2'] ) && ! empty( $settings['cta_link_2']['url'] ) ) {
                $cta_2_url = $settings['cta_link_2']['url'];
            } elseif ( is_string( $settings['cta_link_2'] ) ) {
                $cta_2_url = $settings['cta_link_2'];
            }
        }
        ?>
        <div class="py-12 md:py-20 text-right">
            <div class="flex items-center gap-2 mb-6 font-mono text-xs text-[#00D9FF]">
                <span class="badge-code">&lt;/&gt;</span>
                <span><?php echo esc_html( $settings['subtitle'] ); ?></span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F8FC] mb-6 leading-tight">
                <?php echo nl2br( esc_html( $settings['headline'] ) ); ?>
            </h1>

            <p class="text-base sm:text-lg text-[#8C9BAD] max-w-2xl mb-8 leading-relaxed">
                <?php echo nl2br( esc_html( $settings['description'] ) ); ?>
            </p>

            <div class="flex flex-wrap items-center gap-4">
                <a href="<?php echo esc_url( $cta_1_url ); ?>" class="btn-primary">
                    <?php echo esc_html( $settings['cta_text_1'] ); ?>
                </a>

                <a href="<?php echo esc_url( $cta_2_url ); ?>" class="btn-secondary">
                    <?php echo esc_html( $settings['cta_text_2'] ); ?>
                </a>
            </div>
        </div>
        <?php
    }
}
