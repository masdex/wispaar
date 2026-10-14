<?php
/**
 * Front Page Template for WISPAAR
 * 
 * کاملاً سازگار با المنتور (Elementor):
 * اگر صفحه با المنتور ساخته شده باشد، مستقیماً کانتنت المنتور رندر می‌شود.
 * در غیر این صورت، بخش‌های استانداردی از نمونه‌کارها، خدمات و فرم بریف ویسپار نمایش داده می‌شوند.
 * 
 * @package Wispaar
 */

get_header();

// اگر صفحه در وردپرس با المنتور ساخته شده باشد:
$is_elementor_page = false;
if ( class_exists( '\Elementor\Plugin' ) ) {
    $is_elementor_page = \Elementor\Plugin::$instance->documents->get( get_the_ID() ) && \Elementor\Plugin::$instance->documents->get( get_the_ID() )->is_built_with_elementor();
}

$post_has_content = false;
if ( have_posts() ) {
    while ( have_posts() ) {
        the_post();
        if ( trim( get_the_content() ) !== '' ) {
            $post_has_content = true;
        }
    }
    rewind_posts();
}

if ( $is_elementor_page || $post_has_content ) :
    while ( have_posts() ) : the_post();
        the_content();
    endwhile;
else :
    // چیدمان پیش‌فرض کامل ویسپار در صورت عدم ویرایش با صفحه‌ساز
    ?>
    <div class="space-y-24 pb-20">
        <!-- 01. هیرو سکشن -->
        <section class="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="max-w-4xl text-right">
                <div class="flex items-center gap-2 font-mono text-xs text-[#00D9FF] mb-6">
                    <span class="badge-code">&lt;/&gt;</span>
                    <span>WISDOM + TECHNOLOGY / آفرینش با خرد</span>
                </div>

                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F8FC] leading-tight mb-6">
                    ایده‌ها را فقط اجرا نمی‌کنیم؛<br>
                    آن‌ها را به <span style="color:#00D9FF;">تجربه‌های دیجیتال ماندگار</span> تبدیل می‌کنیم.
                </h1>

                <p class="text-base sm:text-lg text-[#8C9BAD] max-w-2xl mb-8 leading-relaxed">
                    استودیو فناوری و طراحی دیجیتال ویسپار. ما وب‌سایت‌های اختصاصی، مهندسی پیشرفته وردپرس، صفحات فرود با نرخ تبدیل بالا و سئو تکنیکال را بر پایه استانداردهای جهانی خلق می‌کنیم.
                </p>

                <div class="flex flex-wrap items-center gap-4">
                    <a href="#wispaar-brief-section" class="btn-primary">
                        شروع یک پروژه ←
                    </a>
                    <a href="#portfolio" class="btn-secondary">
                        مشاهده نمونه‌کارها
                    </a>
                </div>
            </div>
        </section>

        <!-- 02. مانیفست برند -->
        <section class="border-t border-b border-[#172638] bg-[#06111F] py-16 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                <div>
                    <span class="badge-code mb-2">// 01. PHILOSOPHY</span>
                    <h3 class="text-lg font-bold text-[#F5F8FC] mb-2">خرد پیش از خط کد</h3>
                    <p class="text-xs text-[#8C9BAD] leading-relaxed">پیش از دست‌زدن به دیزاین یا کدنویسی، منطق کسب‌وکار، مدل سودآوری و رفتار ذهنی مخاطب شما را مهندسی می‌کنیم.</p>
                </div>
                <div>
                    <span class="badge-code mb-2">// 02. PERFORMANCE</span>
                    <h3 class="text-lg font-bold text-[#F5F8FC] mb-2">سرعت زیر ۱ ثانیه</h3>
                    <p class="text-xs text-[#8C9BAD] leading-relaxed">حذف کدهای سنگین مازاد، بهینه‌سازی دیتابیس و رعایت سخت‌گیرانه‌ترین شاخص‌های Core Web Vitals گوگل.</p>
                </div>
                <div>
                    <span class="badge-code mb-2">// 03. ARCHITECTURE</span>
                    <h3 class="text-lg font-bold text-[#F5F8FC] mb-2">سازه مقیاس‌پذیر</h3>
                    <p class="text-xs text-[#8C9BAD] leading-relaxed">توسعه ماژولار و تمیز که وب‌سایت شما را در گذر زمان از بازنویسی‌های پرهزینه بی‌نیاز نگاه می‌دارد.</p>
                </div>
            </div>
        </section>

        <!-- 03. پروژه‌ها و نمونه‌کارها -->
        <section id="portfolio" class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-8 text-right">
                <div>
                    <span class="badge-code mb-1">&lt;SELECTED WORK&gt;</span>
                    <h2 class="text-2xl sm:text-3xl font-bold text-[#F5F8FC] mt-2">منتخب پروژه‌ها و آثار دیجیتال</h2>
                </div>
                <div>
                    <a href="<?php echo esc_url( get_post_type_archive_link( 'wispaar_project' ) ?: home_url( '/portfolio' ) ); ?>" class="btn-secondary" style="font-size:12px; padding:8px 16px;">
                        مشاهده همه آثار ←
                    </a>
                </div>
            </div>

            <?php
            // کوئری نمایش ۴ پروژه برتر در صفحه نخست
            $query = new WP_Query( array(
                'post_type'      => 'wispaar_project',
                'posts_per_page' => 4,
                'post_status'    => 'publish',
            ) );
            ?>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <?php
                if ( $query->have_posts() ) :
                    while ( $query->have_posts() ) : $query->the_post();
                        $pid      = get_the_ID();
                        $client   = get_post_meta( $pid, '_wispaar_client', true );
                        $year     = get_post_meta( $pid, '_wispaar_year', true );
                        $ptype    = get_post_meta( $pid, '_wispaar_ptype', true );
                        $is_demo  = get_post_meta( $pid, '_wispaar_is_demo', true ) === '1';
                        $kpi1_val = get_post_meta( $pid, '_wispaar_kpi1_val', true );
                        $kpi1_lbl = get_post_meta( $pid, '_wispaar_kpi1_lbl', true );
                        $kpi2_val = get_post_meta( $pid, '_wispaar_kpi2_val', true );
                        $kpi2_lbl = get_post_meta( $pid, '_wispaar_kpi2_lbl', true );
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
                                        <div style="width:100%; height:240px; background:#0A1626; display:flex; align-items:center; justify-content:center; color:#536174; font-family:monospace; font-size:12px;">
                                            &lt;CASE STUDY FRAME&gt;
                                        </div>
                                    <?php endif; ?>
                                </a>
                            </div>

                            <div class="card-content">
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
                                    </a>
                                </h3>

                                <div style="font-size:13px; color:#8C9BAD; margin-bottom:16px;">
                                    <?php the_excerpt(); ?>
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
                    <div class="col-span-2 p-8 bg-[#06111F] border border-[#172638] rounded-xl text-center">
                        <p style="color:#8C9BAD;">هنوز پروژه‌ای ثبت نشده است. مدیر سایت می‌تواند از طریق منوی پیشخوان <a href="<?php echo admin_url('themes.php?page=wispaar-demo-setup'); ?>" style="color:#00D9FF; text-decoration:underline;">«پوسته ویسپار -> درون‌ریزی داده‌های نمونه»</a> پروژه‌های اولیه را با یک کلیک اضافه کند.</p>
                    </div>
                    <?php
                endif;
                ?>
            </div>
        </section>

        <!-- 04. فرم بریف هوشمند پروژه -->
        <section class="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <?php
            if ( function_exists( 'wispaar_render_brief_form' ) ) {
                wispaar_render_brief_form();
            } elseif ( file_exists( WISPAAR_DIR . '/inc/widgets/widget-brief-form.php' ) ) {
                include_once WISPAAR_DIR . '/inc/widgets/widget-brief-form.php';
                if ( function_exists( 'wispaar_render_brief_form' ) ) {
                    wispaar_render_brief_form();
                }
            }
            ?>
        </section>
    </div>
    <?php
endif;

get_footer();
