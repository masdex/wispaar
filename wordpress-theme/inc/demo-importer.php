<?php
/**
 * One-Click Demo Content Importer for WISPAAR
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function wispaar_admin_menu_demo() {
    add_theme_page(
        __( 'تنظیمات و داده‌های نمونه ویسپار', 'wispaar' ),
        __( 'پوسته ویسپار (داده‌های نمونه)', 'wispaar' ),
        'manage_options',
        'wispaar-demo-setup',
        'wispaar_render_demo_setup_page'
    );
}
add_action( 'admin_menu', 'wispaar_admin_menu_demo' );

function wispaar_render_demo_setup_page() {
    $imported = false;
    if ( isset( $_POST['wispaar_import_demo_action'] ) && check_admin_referer( 'wispaar_demo_nonce' ) ) {
        wispaar_run_demo_import();
        $imported = true;
    }
    ?>
    <div class="wrap" style="max-width:850px; direction:rtl; text-align:right;">
        <h1>پیکربندی و راه‌اندازی پوسته ویسپار (WISPAAR)</h1>
        
        <?php if ( $imported ) : ?>
            <div class="notice notice-success is-dismissible" style="padding:12px; margin:16px 0;">
                <p><strong>✓ نمونه‌کارهای اولیه با موفقیت در سیستم وردپرس ثبت شدند!</strong> اکنون می‌توانید آن‌ها را در منوی «پروژه‌های ویسپار» مشاهده یا ویرایش نمایید.</p>
            </div>
        <?php endif; ?>

        <div style="background:#fff; border:1px solid #ccd0d4; padding:24px; border-radius:8px; margin-top:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <h2 style="margin-top:0;">درون‌ریزی خودکار پروژه‌های نمونه (۱ کلیک)</h2>
            <p style="color:#555; line-height:1.7;">
                برای اینکه سایت شما پس از نصب قالب بلافاصله با تمام نمونه‌کارهای طراحی‌شده، مشخصات کارفرماها، چالش‌ها، راهکارها و شاخص‌های لایت‌هاوس بالا بیاید، دکمه زیر را فشار دهید:
            </p>

            <form method="post" style="margin-top:20px;">
                <?php wp_nonce_field( 'wispaar_demo_nonce' ); ?>
                <input type="hidden" name="wispaar_import_demo_action" value="1">
                <button type="submit" class="button button-primary button-hero" style="background:#1769FF; border-color:#155bd8;">
                    درون‌ریزی نمونه‌کارهای ویسپار در پیشخوان وردپرس
                </button>
            </form>
        </div>

        <div style="background:#fff; border:1px solid #ccd0d4; padding:24px; border-radius:8px; margin-top:20px;">
            <h3 style="margin-top:0;">راهنمای استفاده از المنتور با قالب ویسپار:</h3>
            <ol style="line-height:2; color:#444;">
                <li>وارد برگه <strong>«خانه»</strong> شوید و روی <strong>«ویرایش با المنتور»</strong> کلیک کنید.</li>
                <li>در پنل ابزارک‌های المنتور، به دسته جدید <strong>«المان‌های اختصاصی ویسپار (WISPAAR)»</strong> بروید.</li>
                <li>ابزارک‌های <strong>هیرو اختصاصی</strong>، <strong>گرید پروژه‌ها</strong> و <strong>فرم بریف</strong> را بکشید و رها کنید.</li>
                <li>تمام استایل‌های دارک، واکنش‌گرا و مدرن به صورت خودکار اعمال خواهند شد.</li>
            </ol>
        </div>
    </div>
    <?php
}

function wispaar_run_demo_import() {
    $demo_projects = array(
        array(
            'title'     => 'آریا کاپیتال',
            'title_en'  => 'Arya Capital',
            'client'    => 'هلدینگ مدیریت سرمایه و ثروت آریا',
            'industry'  => 'فین‌تک و خدمات مالی بین‌المللی',
            'year'      => '۱۴۰۴',
            'ptype'     => 'وب‌سایت اختصاصی و پورتال سازمانی',
            'challenge' => 'نیاز به سامانه‌ای مدرن، بدون پیچیدگی‌های گیج‌کننده و با سرعت بارگذاری زیر ۱ ثانیه که بتواند گزارش‌های مالی تحلیلی را به مخاطبان نخبه تجاری عرضه کند.',
            'solution'  => 'طراحی یک نظام بصری دارک و مینی‌مال مبتنی بر گرید هندسی دقیق، حذف المان‌های مازاد و بهینه‌سازی کدهای کلاینت.',
            'kpi1_val'  => '۹۹/۱۰۰',
            'kpi1_lbl'  => 'شاخص لایت‌هاوس',
            'kpi2_val'  => '+۶۴٪',
            'kpi2_lbl'  => 'نرخ تبدیل سرنخ',
            'is_demo'   => '1',
            'demo_url'  => 'https://demo-arya.wispaar.com',
        ),
        array(
            'title'     => 'ژنوم لبز',
            'title_en'  => 'Genome Labs',
            'client'    => 'مرکز تحقیقاتی بیوتکنولوژی و ژنتیک ژنوم',
            'industry'  => 'سلامت و علوم زیستی',
            'year'      => '۱۴۰۳',
            'ptype'     => 'وب‌سایت علمی و سامانه پذیرش آزمون',
            'challenge' => 'ارائه بیش از ۳۰۰ نوع تست ژنتیک و مقالات بالینی در قالب یک ساختار ساده بدون سردرگمی کاربر.',
            'solution'  => 'ایجاد سیستم جستجو و فیلترینگ چندلایه، قالب وردپرس فوق‌العاده سبک با زمان اجرای بهینه کوئری‌ها.',
            'kpi1_val'  => '-۷۵٪',
            'kpi1_lbl'  => 'سرعت دسترسی به نتایج',
            'kpi2_val'  => '۱۰۰٪',
            'kpi2_lbl'  => 'پایداری سرور در ترافیک',
            'is_demo'   => '1',
            'demo_url'  => 'https://demo-genome.wispaar.com',
        ),
        array(
            'title'     => 'آتلیه معماری هور',
            'title_en'  => 'Hoor Atelier',
            'client'    => 'استودیو معماری منظر و طراحی داخلی هور',
            'industry'  => 'معماری و دکوراسیون لوکس',
            'year'      => '۱۴۰۴',
            'ptype'     => 'سایت پورتفولیو و آتلیه برند',
            'challenge' => 'نمایش تصاویر پروژه‌های ساختمانی با رزولوشن ۴K بدون افت وحشتناک سرعت لود در اینترنت همراه.',
            'solution'  => 'سیستم بارگذاری تطبیقی، فریم‌های ادیتوریال مینیمال و بهینه‌سازی خودکار فرمت‌های نسل جدید.',
            'kpi1_val'  => '۸۲۰KB',
            'kpi1_lbl'  => 'حجم کلی صفحه نخست',
            'kpi2_val'  => '+۸۸٪',
            'kpi2_lbl'  => 'رشد فرم‌های مشاوره',
            'is_demo'   => '1',
            'demo_url'  => 'https://demo-hoor.wispaar.com',
        ),
        array(
            'title'     => 'سیناپس کلود',
            'title_en'  => 'Synapse Cloud',
            'client'    => 'ارائه‌دهنده راهکارهای یکپارچه‌سازی سرور و دیتا سنتر',
            'industry'  => 'فناوری اطلاعات و زیرساخت ابری',
            'year'      => '۱۴۰۳',
            'ptype'     => 'لندینگ پیج سازمانی و خدمات ابری',
            'challenge' => 'مشتریان سازمانی در نگاه اول ارزش فنی زیرساخت ابری را متوجه نمی‌شدند و نرخ پرش بالا بود.',
            'solution'  => 'بازطراحی کامل روایت صفحه فرود از درد مشتری به راهکار مهندسی و کال‌تواکشن‌های هدفمند.',
            'kpi1_val'  => '۴.۸٪',
            'kpi1_lbl'  => 'نرخ تبدیل لندینگ',
            'kpi2_val'  => '-۳۸٪',
            'kpi2_lbl'  => 'کاهش بانس ریت',
            'is_demo'   => '1',
            'demo_url'  => 'https://demo-synapse.wispaar.com',
        )
    );

    foreach ( $demo_projects as $item ) {
        // بررسی عدم تکرار
        $existing = get_page_by_title( $item['title'], OBJECT, 'wispaar_project' );
        if ( ! $existing ) {
            $post_id = wp_insert_post( array(
                'post_title'   => $item['title'],
                'post_type'    => 'wispaar_project',
                'post_status'  => 'publish',
                'post_content' => '<p>' . esc_html( $item['solution'] ) . '</p>',
                'post_excerpt' => $item['challenge'],
            ) );

            if ( $post_id && ! is_wp_error( $post_id ) ) {
                update_post_meta( $post_id, '_wispaar_title_en', $item['title_en'] );
                update_post_meta( $post_id, '_wispaar_client', $item['client'] );
                update_post_meta( $post_id, '_wispaar_year', $item['year'] );
                update_post_meta( $post_id, '_wispaar_ptype', $item['ptype'] );
                update_post_meta( $post_id, '_wispaar_challenge', $item['challenge'] );
                update_post_meta( $post_id, '_wispaar_solution', $item['solution'] );
                update_post_meta( $post_id, '_wispaar_kpi1_val', $item['kpi1_val'] );
                update_post_meta( $post_id, '_wispaar_kpi1_lbl', $item['kpi1_lbl'] );
                update_post_meta( $post_id, '_wispaar_kpi2_val', $item['kpi2_val'] );
                update_post_meta( $post_id, '_wispaar_kpi2_lbl', $item['kpi2_lbl'] );
                update_post_meta( $post_id, '_wispaar_is_demo', $item['is_demo'] );
                update_post_meta( $post_id, '_wispaar_demo_url', $item['demo_url'] );

                // اختصاص تاکسونومی صنعت
                wp_set_object_terms( $post_id, $item['industry'], 'project_industry', true );
            }
        }
    }
}
