<?php
/**
 * Elementor Widget: Wispaar Portfolio Grid
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wispaar_Elementor_Portfolio_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'wispaar_portfolio';
    }

    public function get_title() {
        return esc_html__( 'گرید پروژه‌ها (Wispaar Portfolio Grid)', 'wispaar' );
    }

    public function get_icon() {
        return 'eicon-gallery-grid';
    }

    public function get_categories() {
        return array( 'wispaar-elements' );
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_query',
            array(
                'label' => esc_html__( 'تنظیمات نمایش', 'wispaar' ),
                'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'posts_per_page',
            array(
                'label'   => esc_html__( 'تعداد پروژه‌ها', 'wispaar' ),
                'type'    => \Elementor\Controls_Manager::NUMBER,
                'default' => 4,
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();

        $args = array(
            'post_type'      => 'wispaar_project',
            'posts_per_page' => $settings['posts_per_page'],
            'post_status'    => 'publish',
        );

        $query = new WP_Query( $args );
        ?>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
            <?php
            if ( $query->have_posts() ) :
                while ( $query->have_posts() ) : $query->the_post();
                    $id       = get_the_ID();
                    $title_en = get_post_meta( $id, '_wispaar_title_en', true );
                    $client   = get_post_meta( $id, '_wispaar_client', true );
                    $year     = get_post_meta( $id, '_wispaar_year', true );
                    $ptype    = get_post_meta( $id, '_wispaar_ptype', true );
                    $is_demo  = get_post_meta( $id, '_wispaar_is_demo', true ) === '1';
                    $kpi1_val = get_post_meta( $id, '_wispaar_kpi1_val', true );
                    $kpi1_lbl = get_post_meta( $id, '_wispaar_kpi1_lbl', true );
                    $kpi2_val = get_post_meta( $id, '_wispaar_kpi2_val', true );
                    $kpi2_lbl = get_post_meta( $id, '_wispaar_kpi2_lbl', true );
                    ?>
                    <article class="project-card">
                        <div class="card-media">
                            <?php if ( $is_demo ) : ?>
                                <div style="position:absolute; top:12px; right:12px; z-index:10;">
                                    <span class="badge-demo">CONCEPT / DEMO</span>
                                </div>
                            <?php endif; ?>

                            <a href="<?php the_permalink(); ?>">
                                <?php if ( has_post_thumbnail() ) : ?>
                                    <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                                <?php else : ?>
                                    <div style="width:100%; height:220px; background:#0A1626; display:flex; align-items:center; justify-content:center; color:#536174; font-family:monospace; font-size:12px;">
                                        &lt;PREVIEW FRAME&gt;
                                    </div>
                                <?php endif; ?>
                            </a>
                        </div>

                        <div class="card-content">
                            <div>
                                <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#8C9BAD; margin-bottom:8px;">
                                    <span><?php echo esc_html( $client ?: 'اختصاصی ویسپار' ); ?></span>
                                    <span>·</span>
                                    <span><?php echo esc_html( $ptype ?: 'وب‌سایت اختصاصی' ); ?></span>
                                    <span>·</span>
                                    <span><?php echo esc_html( $year ?: '۱۴۰۴' ); ?></span>
                                </div>

                                <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:8px;">
                                    <a href="<?php the_permalink(); ?>" style="color:#F5F8FC;">
                                        <?php the_title(); ?>
                                        <?php if ( $title_en ) : ?>
                                            <span style="display:block; font-size:12px; font-weight:normal; color:#8C9BAD; direction:ltr; text-align:right;">
                                                <?php echo esc_html( $title_en ); ?>
                                            </span>
                                        <?php endif; ?>
                                    </a>
                                </h3>

                                <div style="font-size:13px; color:#8C9BAD; margin-bottom:16px;">
                                    <?php the_excerpt(); ?>
                                </div>
                            </div>

                            <?php if ( $kpi1_val || $kpi2_val ) : ?>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-top:12px; border-top:1px solid #172638; font-size:12px;">
                                    <?php if ( $kpi1_val ) : ?>
                                        <div>
                                            <div style="font-size:16px; font-weight:700; color:#00D9FF; font-family:monospace;"><?php echo esc_html( $kpi1_val ); ?></div>
                                            <div style="color:#8C9BAD; font-size:11px;"><?php echo esc_html( $kpi1_lbl ?: 'شاخص عملکرد' ); ?></div>
                                        </div>
                                    <?php endif; ?>
                                    <?php if ( $kpi2_val ) : ?>
                                        <div>
                                            <div style="font-size:16px; font-weight:700; color:#22C55E; font-family:monospace;"><?php echo esc_html( $kpi2_val ); ?></div>
                                            <div style="color:#8C9BAD; font-size:11px;"><?php echo esc_html( $kpi2_lbl ?: 'نرخ تبدیل' ); ?></div>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </article>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                ?>
                <p style="color:#8C9BAD;">پروژه‌ای برای نمایش یافت نشد. می‌توانید از منوی پیشخوان وردپرس پروژه جدید ثبت کنید.</p>
                <?php
            endif;
            ?>
        </div>
        <?php
    }
}
