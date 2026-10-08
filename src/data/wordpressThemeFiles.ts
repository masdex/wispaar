/**
 * Complete WordPress Theme Files & Architecture for WISPAAR
 * Fully compatible with Elementor, Elementor Pro, Gutenberg, and classic editors.
 */

export interface WPThemeFile {
  name: string;
  path: string;
  description: string;
  content: string;
}

export const wpThemeFiles: WPThemeFile[] = [
  {
    name: 'style.css',
    path: 'style.css',
    description: 'فایل هدر مشخصات قالب وردپرس با سازگاری المنتور و پشتیبانی کامل RTL',
    content: `/*
Theme Name: WISPAAR - Creative Technology & Digital Agency
Theme URI: https://wispaar.com
Author: WISPAAR Studio
Author URI: https://wispaar.com
Description: قالب فوق‌العاده مدرن، سریع و اختصاصی استودیو ویسپار بر پایه هویت «آفرینش با خرد». کاملاً سازگار با تمامی صفحه‌سازها به‌ویژه المنتور (Elementor)، گوتنبرگ و سیستم پیشرفته مدیریت بریف و پروژه‌ها.
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: wispaar
Domain Path: /languages
Tags: dark-theme, portfolio, agency, elementor, rtl-language-support, custom-post-types, translation-ready
*/

/* CSS Variables matching Wispaar Brand System */
:root {
  --wispaar-primary: #1769FF;
  --wispaar-cyan: #00D9FF;
  --wispaar-indigo: #6366F1;
  --wispaar-bg: #03070D;
  --wispaar-secondary-bg: #06111F;
  --wispaar-surface: #0A1626;
  --wispaar-surface-hover: #0F2035;
  --wispaar-heading: #F5F8FC;
  --wispaar-body: #C5D0DD;
  --wispaar-secondary-text: #8C9BAD;
  --wispaar-border: #172638;
  --wispaar-border-light: #23364C;
  --wispaar-success: #22C55E;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--wispaar-bg);
  color: var(--wispaar-body);
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  direction: rtl;
  text-align: right;
  overflow-x: hidden;
}
`
  },
  {
    name: 'functions.php',
    path: 'functions.php',
    description: 'هسته اصلی قالب: ثبت قابلیت‌ها، سازگاری با المنتور، ثبت منوها، انکیو اسکریپت‌ها و فراخوانی ماژول‌ها',
    content: `<?php
/**
 * WISPAAR Theme Functions & Definitions
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'WISPAAR_VERSION', '1.0.0' );
define( 'WISPAAR_DIR', get_template_directory() );
define( 'WISPAAR_URI', get_template_directory_uri() );

/**
 * 1. Theme Setup & Page Builder Compatibility
 */
function wispaar_setup() {
    load_theme_textdomain( 'wispaar', WISPAAR_DIR . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Register Navigation Menus
    register_nav_menus( array(
        'primary-menu' => esc_html__( 'منوی اصلی هدر', 'wispaar' ),
        'footer-services' => esc_html__( 'منوی خدمات فوتر', 'wispaar' ),
        'footer-company' => esc_html__( 'منوی درباره و استودیو فوتر', 'wispaar' ),
    ) );

    // ELEMENTOR THEME SUPPORT
    add_theme_support( 'elementor' );
}
add_action( 'after_setup_theme', 'wispaar_setup' );

/**
 * 2. Enqueue Styles & Scripts
 */
function wispaar_scripts() {
    // Google Fonts (Vazirmatn + Plus Jakarta Sans + JetBrains Mono)
    wp_enqueue_style( 'wispaar-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Vazirmatn:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap', array(), null );

    // Theme Main Stylesheet
    wp_enqueue_style( 'wispaar-style', get_stylesheet_uri(), array(), WISPAAR_VERSION );
    
    // Tailwind Runtime or Compiled CSS for standalone views
    wp_enqueue_script( 'wispaar-tailwind', 'https://cdn.tailwindcss.com', array(), '3.4.0', false );

    // Main JavaScript
    wp_enqueue_script( 'wispaar-main', WISPAAR_URI . '/assets/js/main.js', array( 'jquery' ), WISPAAR_VERSION, true );

    // Localize Script for AJAX / REST API
    wp_localize_script( 'wispaar-main', 'wispaarSettings', array(
        'restUrl'  => esc_url_raw( rest_url( 'wispaar/v1/' ) ),
        'nonce'    => wp_create_nonce( 'wp_rest' ),
        'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'wispaar_scripts' );

/**
 * 3. Include Custom Modules
 */
require_once WISPAAR_DIR . '/inc/cpt-projects.php';    // مدیریت نمونه‌کارها
require_once WISPAAR_DIR . '/inc/cpt-services.php';    // مدیریت خدمات
require_once WISPAAR_DIR . '/inc/cpt-inquiries.php';   // مدیریت بریف‌ها و پیام‌های دریافتی
require_once WISPAAR_DIR . '/inc/rest-api.php';        // اندپوینت‌های REST API
require_once WISPAAR_DIR . '/inc/elementor-widgets.php'; // ویجت‌های اختصاصی المنتور

/**
 * 4. Content Width
 */
function wispaar_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'wispaar_content_width', 1280 );
}
add_action( 'after_setup_theme', 'wispaar_content_width', 0 );
`
  },
  {
    name: 'inc/cpt-projects.php',
    path: 'inc/cpt-projects.php',
    description: 'مدیریت و ثبت نوع پست سفارشی پروژه‌ها و نمونه‌کارها با فیلدهای متای اختصاصی، ستون‌های سفارشی و تاکسونومی‌ها',
    content: `<?php
/**
 * Custom Post Type: Projects (نمونه‌کارها و پروژه‌های ویسپار)
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function wispaar_register_project_cpt() {
    $labels = array(
        'name'                  => _x( 'پروژه‌ها و نمونه‌کارها', 'Post type general name', 'wispaar' ),
        'singular_name'         => _x( 'پروژه', 'Post type singular name', 'wispaar' ),
        'menu_name'             => _x( 'پروژه‌های ویسپار', 'Admin Menu text', 'wispaar' ),
        'name_admin_bar'        => _x( 'پروژه جدید', 'Add New on Toolbar', 'wispaar' ),
        'add_new'               => __( 'افزودن پروژه جدید', 'wispaar' ),
        'add_new_item'          => __( 'افزودن پروژه جدید به ویسپار', 'wispaar' ),
        'new_item'              => __( 'پروژه تازه', 'wispaar' ),
        'edit_item'             => __( 'ویرایش پروژه', 'wispaar' ),
        'view_item'             => __( 'مشاهده پروژه', 'wispaar' ),
        'all_items'             => __( 'همه پروژه‌ها', 'wispaar' ),
        'search_items'          => __( 'جستجوی پروژه‌ها', 'wispaar' ),
        'not_found'             => __( 'پروژه‌ای یافت نشد.', 'wispaar' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'projects' ),
        'capability_type'    => 'post',
        'has_archive'        => 'portfolio',
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
        'show_in_rest'       => true, // کاملاً در دسترس برای ویرایشگر بلوک، المنتور و فرانت‌اند React
    );

    register_post_type( 'wispaar_project', $args );

    // تاکسونومی صنعت / Industry
    register_taxonomy( 'project_industry', array( 'wispaar_project' ), array(
        'hierarchical'      => true,
        'labels'            => array(
            'name'          => 'صنعت‌ها (Industries)',
            'singular_name' => 'صنعت',
        ),
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'show_in_rest'      => true,
        'rewrite'           => array( 'slug' => 'industry' ),
    ) );

    // تاکسونومی پشته فناوری / Technology
    register_taxonomy( 'project_tech', array( 'wispaar_project' ), array(
        'hierarchical'      => false,
        'labels'            => array(
            'name'          => 'فناوری‌ها (Tech Stack)',
            'singular_name' => 'فناوری',
        ),
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'rewrite'           => array( 'slug' => 'tech' ),
    ) );
}
add_action( 'init', 'wispaar_register_project_cpt' );

/**
 * افزودن جعبه متای اختصاصی (Meta Box) برای فیلدهای پیشرفته پروژه
 */
function wispaar_add_project_metaboxes() {
    add_meta_box(
        'wispaar_project_meta',
        __( 'مشخصات اختصاصی پروژه (Wispaar Project Details)', 'wispaar' ),
        'wispaar_render_project_metabox',
        'wispaar_project',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'wispaar_add_project_metaboxes' );

function wispaar_render_project_metabox( $post ) {
    wp_nonce_field( 'wispaar_save_project_meta', 'wispaar_project_nonce' );

    $client    = get_post_meta( $post->ID, '_wispaar_client', true );
    $title_en  = get_post_meta( $post->ID, '_wispaar_title_en', true );
    $year      = get_post_meta( $post->ID, '_wispaar_year', true );
    $ptype     = get_post_meta( $post->ID, '_wispaar_ptype', true );
    $challenge = get_post_meta( $post->ID, '_wispaar_challenge', true );
    $solution  = get_post_meta( $post->ID, '_wispaar_solution', true );
    $kpi1_val  = get_post_meta( $post->ID, '_wispaar_kpi1_val', true );
    $kpi1_lbl  = get_post_meta( $post->ID, '_wispaar_kpi1_lbl', true );
    $kpi2_val  = get_post_meta( $post->ID, '_wispaar_kpi2_val', true );
    $kpi2_lbl  = get_post_meta( $post->ID, '_wispaar_kpi2_lbl', true );
    $is_demo   = get_post_meta( $post->ID, '_wispaar_is_demo', true );
    $demo_url  = get_post_meta( $post->ID, '_wispaar_demo_url', true );
    ?>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px;">
        <p>
            <label><strong>نام انگلیسی پروژه (English Title):</strong></label><br>
            <input type="text" name="wispaar_title_en" value="<?php echo esc_attr( $title_en ); ?>" style="width:100%; direction:ltr;" placeholder="e.g. Arya Capital">
        </p>
        <p>
            <label><strong>نام مشتری یا کارفرما (Client):</strong></label><br>
            <input type="text" name="wispaar_client" value="<?php echo esc_attr( $client ); ?>" style="width:100%;" placeholder="مثال: هلدینگ مدیریت سرمایه آریا">
        </p>
        <p>
            <label><strong>سال اجرا (Year):</strong></label><br>
            <input type="text" name="wispaar_year" value="<?php echo esc_attr( $year ); ?>" style="width:100%;" placeholder="۱۴۰۴">
        </p>
        <p>
            <label><strong>نوع پروژه (Project Type):</strong></label><br>
            <input type="text" name="wispaar_ptype" value="<?php echo esc_attr( $ptype ); ?>" style="width:100%;" placeholder="وب‌سایت اختصاصی و پورتال سازمانی">
        </p>
    </div>

    <p>
        <label><strong>چالش اصلی پروژه (The Challenge):</strong></label><br>
        <textarea name="wispaar_challenge" rows="3" style="width:100%;"><?php echo esc_textarea( $challenge ); ?></textarea>
    </p>

    <p>
        <label><strong>راهکار مهندسی ویسپار (The Solution):</strong></label><br>
        <textarea name="wispaar_solution" rows="3" style="width:100%;"><?php echo esc_textarea( $solution ); ?></textarea>
    </p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; background:#f9f9f9; padding:12px; border:1px solid #ddd; border-radius:6px;">
        <div>
            <label><strong>شاخص اول (مقدار / برچسب):</strong></label><br>
            <input type="text" name="wispaar_kpi1_val" value="<?php echo esc_attr( $kpi1_val ); ?>" placeholder="۹۹/۱۰۰" style="width:45%; margin-left:5%;">
            <input type="text" name="wispaar_kpi1_lbl" value="<?php echo esc_attr( $kpi1_lbl ); ?>" placeholder="شاخص لایت‌هاوس" style="width:48%;">
        </div>
        <div>
            <label><strong>شاخص دوم (مقدار / برچسب):</strong></label><br>
            <input type="text" name="wispaar_kpi2_val" value="<?php echo esc_attr( $kpi2_val ); ?>" placeholder="+۶۴٪" style="width:45%; margin-left:5%;">
            <input type="text" name="wispaar_kpi2_lbl" value="<?php echo esc_attr( $kpi2_lbl ); ?>" placeholder="نرخ تبدیل سرنخ" style="width:48%;">
        </div>
    </div>

    <p style="margin-top:14px;">
        <label>
            <input type="checkbox" name="wispaar_is_demo" value="1" <?php checked( $is_demo, '1' ); ?>>
            <strong>نمونه کانسپت استودیو است (Concept / Demo)</strong>
        </label>
        <span style="display:block; color:#666; font-size:12px;">با زدن این تیک، برچسب شفاف CONCEPT / DEMO روی اثر قرار می‌گیرد تا صداقت حرفه‌ای حفظ شود.</span>
    </p>

    <p>
        <label><strong>آدرس پیش‌نمایش سایت (Demo / Live URL):</strong></label><br>
        <input type="url" name="wispaar_demo_url" value="<?php echo esc_attr( $demo_url ); ?>" style="width:100%; direction:ltr;" placeholder="https://demo-arya.wispaar.com">
    </p>
    <?php
}

function wispaar_save_project_meta( $post_id ) {
    if ( ! isset( $_POST['wispaar_project_nonce'] ) || ! wp_verify_nonce( $_POST['wispaar_project_nonce'], 'wispaar_save_project_meta' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    $fields = array(
        'wispaar_title_en'  => '_wispaar_title_en',
        'wispaar_client'    => '_wispaar_client',
        'wispaar_year'      => '_wispaar_year',
        'wispaar_ptype'     => '_wispaar_ptype',
        'wispaar_challenge' => '_wispaar_challenge',
        'wispaar_solution'  => '_wispaar_solution',
        'wispaar_kpi1_val'  => '_wispaar_kpi1_val',
        'wispaar_kpi1_lbl'  => '_wispaar_kpi1_lbl',
        'wispaar_kpi2_val'  => '_wispaar_kpi2_val',
        'wispaar_kpi2_lbl'  => '_wispaar_kpi2_lbl',
        'wispaar_demo_url'  => '_wispaar_demo_url',
    );

    foreach ( $fields as $input => $meta_key ) {
        if ( isset( $_POST[ $input ] ) ) {
            update_post_meta( $post_id, $meta_key, sanitize_text_field( $_POST[ $input ] ) );
        }
    }

    $is_demo = isset( $_POST['wispaar_is_demo'] ) ? '1' : '0';
    update_post_meta( $post_id, '_wispaar_is_demo', $is_demo );
}
add_action( 'save_post_wispaar_project', 'wispaar_save_project_meta' );

/**
 * ستون‌های سفارشی جدول پروژه‌ها در پیشخوان وردپرس
 */
function wispaar_set_project_columns( $columns ) {
    $new_cols = array();
    $new_cols['cb'] = $columns['cb'];
    $new_cols['thumbnail'] = 'تصویر کاور';
    $new_cols['title'] = $columns['title'];
    $new_cols['client'] = 'کارفرما';
    $new_cols['industry'] = 'صنعت';
    $new_cols['year'] = 'سال';
    $new_cols['is_demo'] = 'وضعیت دمو';
    $new_cols['date'] = $columns['date'];
    return $new_cols;
}
add_filter( 'manage_wispaar_project_posts_columns', 'wispaar_set_project_columns' );

function wispaar_render_project_columns( $column, $post_id ) {
    switch ( $column ) {
        case 'thumbnail':
            if ( has_post_thumbnail( $post_id ) ) {
                echo get_the_post_thumbnail( $post_id, array( 60, 40 ), array( 'style' => 'border-radius:4px; object-fit:cover;' ) );
            } else {
                echo '<span style="color:#aaa;">بدون تصویر</span>';
            }
            break;
        case 'client':
            echo esc_html( get_post_meta( $post_id, '_wispaar_client', true ) ?: '—' );
            break;
        case 'industry':
            $terms = get_the_term_list( $post_id, 'project_industry', '', '، ' );
            echo $terms ? $terms : '—';
            break;
        case 'year':
            echo esc_html( get_post_meta( $post_id, '_wispaar_year', true ) ?: '—' );
            break;
        case 'is_demo':
            $is_demo = get_post_meta( $post_id, '_wispaar_is_demo', true );
            echo $is_demo === '1' 
                ? '<span style="background:#00D9FF; color:#03070D; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">CONCEPT / DEMO</span>' 
                : '<span style="background:#22C55E; color:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">مشتری واقعی</span>';
            break;
    }
}
add_action( 'manage_wispaar_project_posts_custom_column', 'wispaar_render_project_columns', 10, 2 );
`
  },
  {
    name: 'inc/cpt-inquiries.php',
    path: 'inc/cpt-inquiries.php',
    description: 'مدیریت و ذخیره‌سازی بریف‌های پروژه و فرم‌های تماس در پیشخوان وردپرس با بج تعداد پیام‌های خوانده‌نشده و ایمیل نوتیفیکیشن',
    content: `<?php
/**
 * Custom Post Type: Project Briefs & Inquiries (دریافت و مدیریت لیدها در وردپرس)
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function wispaar_register_inquiries_cpt() {
    // 1. بریف‌های هوشمند پروژه (Project Briefs)
    $brief_labels = array(
        'name'               => _x( 'بریف‌های پروژه', 'Post type general name', 'wispaar' ),
        'singular_name'      => _x( 'بریف پروژه', 'Post type singular name', 'wispaar' ),
        'menu_name'          => _x( 'درخواست‌های پروژه (Leads)', 'Admin Menu text', 'wispaar' ),
        'all_items'          => __( 'همه درخواست‌های پروژه', 'wispaar' ),
        'view_item'          => __( 'مشاهده بریف', 'wispaar' ),
        'search_items'       => __( 'جستجوی بریف‌ها', 'wispaar' ),
        'not_found'          => __( 'هیچ درخواستی یافت نشد.', 'wispaar' ),
    );

    register_post_type( 'wispaar_brief', array(
        'labels'             => $brief_labels,
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-feedback',
        'supports'           => array( 'title' ),
        'capabilities'       => array(
            'create_posts' => false, // کاربران فقط از طریق فرم ثبت می‌کنند
        ),
        'map_meta_cap'       => true,
    ) );
}
add_action( 'init', 'wispaar_register_inquiries_cpt' );

/**
 * ستون‌های اختصاصی در جدول بریف‌های پیشخوان
 */
function wispaar_set_brief_columns( $columns ) {
    $new_cols = array();
    $new_cols['cb']       = $columns['cb'];
    $new_cols['title']    = 'نام متقاضی / سازمان';
    $new_cols['phone']    = 'شماره تماس';
    $new_cols['email']    = 'ایمیل';
    $new_cols['services'] = 'خدمات انتخابی';
    $new_cols['budget']   = 'بودجه';
    $new_cols['status']   = 'وضعیت پیگیری';
    $new_cols['date']     = 'تاریخ ثبت';
    return $new_cols;
}
add_filter( 'manage_wispaar_brief_posts_columns', 'wispaar_set_brief_columns' );

function wispaar_render_brief_columns( $column, $post_id ) {
    switch ( $column ) {
        case 'phone':
            $phone = get_post_meta( $post_id, '_wispaar_lead_phone', true );
            echo $phone ? '<a href="tel:' . esc_attr($phone) . '" style="direction:ltr; display:inline-block; font-family:monospace;">' . esc_html( $phone ) . '</a>' : '—';
            break;
        case 'email':
            $email = get_post_meta( $post_id, '_wispaar_lead_email', true );
            echo $email ? '<a href="mailto:' . esc_attr($email) . '">' . esc_html( $email ) . '</a>' : '—';
            break;
        case 'services':
            $services = get_post_meta( $post_id, '_wispaar_lead_services', true );
            if ( is_array( $services ) ) {
                echo esc_html( implode( '، ', $services ) );
            } else {
                echo esc_html( $services ?: '—' );
            }
            break;
        case 'budget':
            echo esc_html( get_post_meta( $post_id, '_wispaar_lead_budget', true ) ?: 'مشاوره' );
            break;
        case 'status':
            $status = get_post_meta( $post_id, '_wispaar_lead_status', true ) ?: 'new';
            $colors = array(
                'new'       => 'background:#EF4444; color:#fff;',
                'reviewed'  => 'background:#F59E0B; color:#000;',
                'contacted' => 'background:#22C55E; color:#fff;',
            );
            $titles = array(
                'new'       => 'جدید (بررسی نشده)',
                'reviewed'  => 'در حال بررسی',
                'contacted' => 'جلسه هماهنگ شد',
            );
            echo '<span style="display:inline-block; padding:3px 8px; border-radius:4px; font-size:11px; ' . ( $colors[$status] ?? '' ) . '">' . ( $titles[$status] ?? $status ) . '</span>';
            break;
    }
}
add_action( 'manage_wispaar_brief_posts_custom_column', 'wispaar_render_brief_columns', 10, 2 );

/**
 * متاباکس نمایش جزئیات کامل بریف در صفحه ویرایش نوشته
 */
function wispaar_add_brief_details_metabox() {
    add_meta_box(
        'wispaar_brief_details',
        __( 'جزئیات سند بریف ارسال‌شده توسط کاربر', 'wispaar' ),
        'wispaar_render_brief_details_metabox',
        'wispaar_brief',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'wispaar_add_brief_details_metabox' );

function wispaar_render_brief_details_metabox( $post ) {
    $name        = get_the_title( $post->ID );
    $phone       = get_post_meta( $post->ID, '_wispaar_lead_phone', true );
    $email       = get_post_meta( $post->ID, '_wispaar_lead_email', true );
    $services    = get_post_meta( $post->ID, '_wispaar_lead_services', true );
    $goals       = get_post_meta( $post->ID, '_wispaar_lead_goals', true );
    $platform    = get_post_meta( $post->ID, '_wispaar_lead_platform', true );
    $website_url = get_post_meta( $post->ID, '_wispaar_lead_website', true );
    $budget      = get_post_meta( $post->ID, '_wispaar_lead_budget', true );
    $timeline    = get_post_meta( $post->ID, '_wispaar_lead_timeline', true );
    $description = get_post_meta( $post->ID, '_wispaar_lead_desc', true );
    $status      = get_post_meta( $post->ID, '_wispaar_lead_status', true ) ?: 'new';
    ?>
    <table class="form-table" style="background:#fff; border:1px solid #ccd0d4; padding:15px; border-radius:6px;">
        <tr>
            <th style="width:200px;">نام مشتری / سازمان:</th>
            <td><strong><?php echo esc_html( $name ); ?></strong></td>
        </tr>
        <tr>
            <th>شماره تماس:</th>
            <td><a href="tel:<?php echo esc_attr($phone); ?>" style="font-size:16px; font-weight:bold; font-family:monospace;"><?php echo esc_html( $phone ); ?></a></td>
        </tr>
        <tr>
            <th>ایمیل:</th>
            <td><a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html( $email ); ?></a></td>
        </tr>
        <tr>
            <th>خدمات مد نظر:</th>
            <td><?php echo esc_html( is_array($services) ? implode(' | ', $services) : $services ); ?></td>
        </tr>
        <tr>
            <th>اهداف تجاری:</th>
            <td><?php echo esc_html( is_array($goals) ? implode(' | ', $goals) : $goals ); ?></td>
        </tr>
        <tr>
            <th>بستر فعلی / آدرس سایت:</th>
            <td>
                <?php echo esc_html( $platform ); ?>
                <?php if ( $website_url ) : ?>
                    (<a href="<?php echo esc_url( $website_url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $website_url ); ?></a>)
                <?php endif; ?>
            </td>
        </tr>
        <tr>
            <th>محدوده بودجه و زمان‌بندی:</th>
            <td><?php echo esc_html( $budget ); ?> / زمان‌بندی: <?php echo esc_html( $timeline ); ?></td>
        </tr>
        <tr>
            <th>توضیحات تکمیلی مشتری:</th>
            <td style="background:#f7f7f7; padding:10px; border-radius:4px;"><?php echo nl2br( esc_html( $description ) ); ?></td>
        </tr>
        <tr>
            <th>وضعیت پیگیری بریف:</th>
            <td>
                <select name="wispaar_lead_status">
                    <option value="new" <?php selected( $status, 'new' ); ?>>جدید (نیاز به تماس فوری)</option>
                    <option value="reviewed" <?php selected( $status, 'reviewed' ); ?>>در حال بررسی تیم فنی</option>
                    <option value="contacted" <?php selected( $status, 'contacted' ); ?>>جلسه هماهنگ شد</option>
                </select>
                <input type="hidden" name="wispaar_brief_nonce" value="<?php echo wp_create_nonce( 'wispaar_brief_status' ); ?>">
            </td>
        </tr>
    </table>
    <?php
}

function wispaar_save_brief_status( $post_id ) {
    if ( isset( $_POST['wispaar_brief_nonce'] ) && wp_verify_nonce( $_POST['wispaar_brief_nonce'], 'wispaar_brief_status' ) ) {
        if ( isset( $_POST['wispaar_lead_status'] ) ) {
            update_post_meta( $post_id, '_wispaar_lead_status', sanitize_text_field( $_POST['wispaar_lead_status'] ) );
        }
    }
}
add_action( 'save_post_wispaar_brief', 'wispaar_save_brief_status' );
`
  },
  {
    name: 'inc/rest-api.php',
    path: 'inc/rest-api.php',
    description: 'اندپوینت‌های امن REST API برای دریافت فرم‌های بریف و تماس از فرانت‌اند و برقراری ارتباط بین React و WordPress',
    content: `<?php
/**
 * REST API Endpoints for WISPAAR
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function () {
    // 1. ثبت بریف جدید از سمت فرانت‌اند (React یا فرم المنتور)
    register_rest_route( 'wispaar/v1', '/brief', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_submit_brief',
        'permission_callback' => '__return_true', // عمومی برای ثبت سرنخ‌ها
    ) );

    // 2. دریافت فهرست پروژه‌ها برای فرانت‌اند
    register_rest_route( 'wispaar/v1', '/projects', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_projects',
        'permission_callback' => '__return_true',
    ) );
} );

function wispaar_rest_submit_brief( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $name        = sanitize_text_field( $params['name'] ?? '' );
    $phone       = sanitize_text_field( $params['phone'] ?? '' );
    $email       = sanitize_email( $params['email'] ?? '' );
    $services    = isset( $params['services'] ) && is_array( $params['services'] ) ? array_map( 'sanitize_text_field', $params['services'] ) : array();
    $goals       = isset( $params['goals'] ) && is_array( $params['goals'] ) ? array_map( 'sanitize_text_field', $params['goals'] ) : array();
    $platform    = sanitize_text_field( $params['platform'] ?? '' );
    $website_url = esc_url_raw( $params['website'] ?? '' );
    $budget      = sanitize_text_field( $params['budget'] ?? '' );
    $timeline    = sanitize_text_field( $params['timeline'] ?? '' );
    $description = sanitize_textarea_field( $params['description'] ?? '' );

    if ( empty( $name ) || empty( $phone ) || empty( $email ) ) {
        return new WP_Error( 'missing_fields', 'لطفاً نام، شماره تماس و ایمیل را وارد فرمایید.', array( 'status' => 400 ) );
    }

    // ایجاد پست جدید در CPT wispaar_brief
    $post_id = wp_insert_post( array(
        'post_title'   => $name . ' — ' . date_i18n( 'Y/m/d H:i' ),
        'post_type'    => 'wispaar_brief',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_failed', 'خطا در ثبت بریف پروژه.', array( 'status' => 500 ) );
    }

    // ذخیره متادیتا
    update_post_meta( $post_id, '_wispaar_lead_phone', $phone );
    update_post_meta( $post_id, '_wispaar_lead_email', $email );
    update_post_meta( $post_id, '_wispaar_lead_services', $services );
    update_post_meta( $post_id, '_wispaar_lead_goals', $goals );
    update_post_meta( $post_id, '_wispaar_lead_platform', $platform );
    update_post_meta( $post_id, '_wispaar_lead_website', $website_url );
    update_post_meta( $post_id, '_wispaar_lead_budget', $budget );
    update_post_meta( $post_id, '_wispaar_lead_timeline', $timeline );
    update_post_meta( $post_id, '_wispaar_lead_desc', $description );
    update_post_meta( $post_id, '_wispaar_lead_status', 'new' );

    // ارسال نوتیفیکیشن ایمیل به مدیر سایت
    $admin_email = get_option( 'admin_email' );
    $subject = 'درخواست بریف پروژه جدید از طرف: ' . $name;
    $body = "یک بریف پروژه جدید در وب‌سایت ویسپار ثبت شد:\n\n"
          . "نام: $name\n"
          . "شماره تماس: $phone\n"
          . "ایمیل: $email\n"
          . "بودجه: $budget\n"
          . "زمان‌بندی: $timeline\n"
          . "توضیحات: $description\n\n"
          . "جهت مشاهده و مدیریت به پیشخوان وردپرس مراجعه نمایید:\n"
          . admin_url( 'post.php?post=' . $post_id . '&action=edit' );

    wp_mail( $admin_email, $subject, $body );

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'بریف پروژه شما با موفقیت در سیستم وردپرس ویسپار ثبت شد.',
        'lead_id' => $post_id,
    ) );
}

function wispaar_rest_get_projects( WP_REST_Request $request ) {
    $args = array(
        'post_type'      => 'wispaar_project',
        'posts_per_page' => 20,
        'post_status'    => 'publish',
    );

    $query = new WP_Query( $args );
    $projects = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $id = get_the_ID();

            $projects[] = array(
                'id'          => $id,
                'slug'        => get_post_field( 'post_name', $id ),
                'title'       => get_the_title(),
                'titleEn'     => get_post_meta( $id, '_wispaar_title_en', true ),
                'client'      => get_post_meta( $id, '_wispaar_client', true ),
                'year'        => get_post_meta( $id, '_wispaar_year', true ),
                'projectType' => get_post_meta( $id, '_wispaar_ptype', true ),
                'challenge'   => get_post_meta( $id, '_wispaar_challenge', true ),
                'solution'    => get_post_meta( $id, '_wispaar_solution', true ),
                'isDemo'      => get_post_meta( $id, '_wispaar_is_demo', true ) === '1',
                'coverImage'  => get_the_post_thumbnail_url( $id, 'large' ) ?: '',
                'results'     => array(
                    array(
                        'value' => get_post_meta( $id, '_wispaar_kpi1_val', true ),
                        'label' => get_post_meta( $id, '_wispaar_kpi1_lbl', true ),
                    ),
                    array(
                        'value' => get_post_meta( $id, '_wispaar_kpi2_val', true ),
                        'label' => get_post_meta( $id, '_wispaar_kpi2_lbl', true ),
                    )
                ),
            );
        }
        wp_reset_postdata();
    }

    return rest_ensure_response( $projects );
}
`
  },
  {
    name: 'inc/elementor-widgets.php',
    path: 'inc/elementor-widgets.php',
    description: 'ویجت‌های اختصاصی المنتور برای نمایش هیرو، گرید نمونه‌کارها، بریف فرم و ماژول قبل/بعد سئو مستقیماً در ویرایشگر المنتور',
    content: `<?php
/**
 * Elementor Custom Widgets Integration for WISPAAR
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wispaar_Elementor_Extension {
    private static $_instance = null;

    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct() {
        add_action( 'elementor/elements/categories_registered', array( $this, 'register_category' ) );
        add_action( 'elementor/widgets/register', array( $this, 'register_widgets' ) );
    }

    public function register_category( $elements_manager ) {
        $elements_manager->add_category(
            'wispaar-elements',
            array(
                'title' => esc_html__( 'المان‌های اختصاصی ویسپار (WISPAAR)', 'wispaar' ),
                'icon'  => 'fa fa-code',
            )
        );
    }

    public function register_widgets( $widgets_manager ) {
        // ثبت ویجت‌های سفارشی
        require_once WISPAAR_DIR . '/inc/widgets/widget-hero.php';
        require_once WISPAAR_DIR . '/inc/widgets/widget-portfolio.php';
        require_once WISPAAR_DIR . '/inc/widgets/widget-brief-form.php';

        $widgets_manager->register( new \\Wispaar_Elementor_Hero_Widget() );
        $widgets_manager->register( new \\Wispaar_Elementor_Portfolio_Widget() );
        $widgets_manager->register( new \\Wispaar_Elementor_Brief_Form_Widget() );
    }
}

add_action( 'init', function() {
    if ( did_action( 'elementor/loaded' ) ) {
        Wispaar_Elementor_Extension::instance();
    }
} );
`
  },
  {
    name: 'header.php',
    path: 'header.php',
    description: 'قالب هدر با پشتیبانی از هدر اختصاصی المنتور (Theme Builder) و هدر پیش‌فرض مدرن ویسپار',
    content: `<!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-[#03070D] text-[#C5D0DD] antialiased selection:bg-[#1769FF]/30 selection:text-white' ); ?>>
<?php wp_body_open(); ?>

<?php
// اگر کاربر از Elementor Theme Builder هدر ساخته بود، آن را لود کن
if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'header' ) ) {
    return;
}
?>

<header class="sticky top-0 z-50 bg-[#03070D]/95 border-b border-[#172638] backdrop-blur-md py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <!-- Logo -->
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2.5">
            <span class="text-2xl font-bold tracking-tight text-[#F5F8FC]">WISPAAR</span>
            <span class="text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded font-mono">&lt;/&gt;</span>
        </a>

        <!-- Menu -->
        <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-[#C5D0DD]">
            <?php
            if ( has_nav_menu( 'primary-menu' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary-menu',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'fallback_cb'    => false,
                ) );
            } else {
                echo '<a href="' . esc_url( home_url( '/' ) ) . '" class="text-[#00D9FF]">خانه</a>';
                echo '<a href="' . esc_url( home_url( '/portfolio' ) ) . '">پروژه‌ها</a>';
                echo '<a href="' . esc_url( home_url( '/services' ) ) . '">خدمات</a>';
                echo '<a href="' . esc_url( home_url( '/about' ) ) . '">درباره ویسپار</a>';
                echo '<a href="' . esc_url( home_url( '/contact' ) ) . '">تماس</a>';
            }
            ?>
        </nav>

        <!-- CTA Action -->
        <div class="flex items-center gap-3">
            <a href="<?php echo esc_url( home_url( '/start-project' ) ); ?>" class="px-4 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-lg transition-all shadow-sm">
                شروع یک پروژه ←
            </a>
        </div>
    </div>
</header>
`
  },
  {
    name: 'footer.php',
    path: 'footer.php',
    description: 'قالب فوتر با پشتیبانی از فوتر المنتور و ترکیب ادیتوریال ویسپار',
    content: `<?php
// اگر فوتر المنتور فعال بود
if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'footer' ) ) {
    wp_footer();
    return;
}
?>

<footer class="bg-[#02050A] border-t border-[#172638] text-[#8C9BAD] pt-16 pb-12 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-[#172638]/70">
            <div class="md:col-span-2 space-y-4">
                <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold tracking-tight text-[#F5F8FC]">WISPAAR</span>
                    <span class="text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded font-mono">&lt;/&gt;</span>
                </div>
                <div class="text-sm text-[#00D9FF]">آفرینش با خرد — Wisdom + Technology</div>
                <p class="text-sm text-[#8C9BAD] max-w-sm leading-relaxed">
                    استودیو فناوری و طراحی دیجیتال ویسپار. طراحی وب‌سایت‌های اختصاصی، مهندسی پیشرفته وردپرس و سئو تکنیکال.
                </p>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-4">پروژه‌ها و خدمات</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="<?php echo esc_url( home_url( '/portfolio' ) ); ?>" class="hover:text-white">منتخب پروژه‌ها</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/services' ) ); ?>" class="hover:text-white">طراحی اختصاصی وب</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/seo' ) ); ?>" class="hover:text-white">مطالعات موردی سئو</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-4">استودیو ویسپار</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="hover:text-white">درباره و مانیفست</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/start-project' ) ); ?>" class="text-[#00D9FF]">ثبت بریف پروژه</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/contact' ) ); ?>" class="hover:text-white">تماس مستقیم</a></li>
                </ul>
            </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>تمام حقوق محفوظ است © <?php echo date('Y'); ?> WISPAAR. قدرت گرفته از هسته مهندسی وردپرس.</div>
            <div class="font-mono text-[#00D9FF]">&lt;/&gt; Creation with Wisdom</div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
`
  },
  {
    name: 'front-page.php',
    path: 'front-page.php',
    description: 'صفحه اصلی سازگار با تمام صفحه‌سازها (Elementor Canvas / Elementor Full Width) و محتوای پیش‌فرض',
    content: `<?php
/**
 * Front Page Template
 * 
 * کاملاً سازگار با المنتور: اگر صفحه در المنتور ویرایش شود، المنتور خروجی را مدیریت می‌کند.
 * در غیر این صورت، بخش‌های استانداردی از نمونه‌کارها و خدمات لود می‌شوند.
 * 
 * @package Wispaar
 */

get_header();

// اگر صفحه با المنتور ساخته شده، مستقیماً کانتنت المنتور رندر می‌شود:
if ( have_posts() ) :
    while ( have_posts() ) : the_post();
        the_content();
    endwhile;
endif;

get_footer();
`
  },
  {
    name: 'single-wispaar_project.php',
    path: 'single-wispaar_project.php',
    description: 'قالب اختصاصی تک پروژه در وردپرس با تمام فیلدهای سفارشی (کارفرما، چالش، راهکار و نتایج)',
    content: `<?php
/**
 * Single Project Template
 * 
 * @package Wispaar
 */

get_header();

while ( have_posts() ) : the_post();
    $post_id   = get_the_ID();
    $client    = get_post_meta( $post_id, '_wispaar_client', true );
    $title_en  = get_post_meta( $post_id, '_wispaar_title_en', true );
    $year      = get_post_meta( $post_id, '_wispaar_year', true );
    $ptype     = get_post_meta( $post_id, '_wispaar_ptype', true );
    $challenge = get_post_meta( $post_id, '_wispaar_challenge', true );
    $solution  = get_post_meta( $post_id, '_wispaar_solution', true );
    $kpi1_val  = get_post_meta( $post_id, '_wispaar_kpi1_val', true );
    $kpi1_lbl  = get_post_meta( $post_id, '_wispaar_kpi1_lbl', true );
    $kpi2_val  = get_post_meta( $post_id, '_wispaar_kpi2_val', true );
    $kpi2_lbl  = get_post_meta( $post_id, '_wispaar_kpi2_lbl', true );
    $is_demo   = get_post_meta( $post_id, '_wispaar_is_demo', true ) === '1';
    $demo_url  = get_post_meta( $post_id, '_wispaar_demo_url', true );
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
            <span>&lt;/&gt;</span>
            <span>CASE STUDY / <?php echo esc_html( $title_en ?: get_the_title() ); ?></span>
            <?php if ( $is_demo ) : ?>
                <span class="bg-[#03070D] border border-[#23364C] px-2 py-0.5 rounded text-[#00D9FF]">CONCEPT / DEMO</span>
            <?php endif; ?>
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold text-[#F5F8FC]"><?php the_title(); ?></h1>
    </div>

    <!-- Cover Image -->
    <?php if ( has_post_thumbnail() ) : ?>
        <div class="rounded-2xl overflow-hidden border border-[#172638] max-h-[600px]">
            <?php the_post_thumbnail( 'full', array( 'class' => 'w-full object-cover' ) ); ?>
        </div>
    <?php endif; ?>

    <!-- Meta specs -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#06111F] border border-[#172638] rounded-xl p-6 text-xs">
        <div>
            <div class="text-[#536174] mb-1">کارفرما</div>
            <div class="text-[#F5F8FC] font-medium"><?php echo esc_html( $client ?: 'اختصاصی ویسپار' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">سال اجرا</div>
            <div class="text-[#F5F8FC] font-medium font-mono"><?php echo esc_html( $year ?: '۱۴۰۴' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">نوع اثر</div>
            <div class="text-[#F5F8FC] font-medium"><?php echo esc_html( $ptype ?: 'وب‌سایت اختصاصی' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">پیش‌نمایش آنلاین</div>
            <div>
                <?php if ( $demo_url ) : ?>
                    <a href="<?php echo esc_url($demo_url); ?>" target="_blank" class="text-[#00D9FF] hover:underline">مشاهده سایت دمو ←</a>
                <?php else : ?>
                    <span class="text-[#8C9BAD]">در دسترس در سرور استیجینگ</span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Challenge and Solution -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <h3 class="text-sm font-bold text-[#EF4444] uppercase tracking-wider">چالش اساسی پروژه</h3>
            <p class="text-sm text-[#8C9BAD] leading-relaxed"><?php echo esc_html( $challenge ); ?></p>
        </div>
        <div class="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <h3 class="text-sm font-bold text-[#00D9FF] uppercase tracking-wider">راهکار مهندسی ویسپار</h3>
            <p class="text-sm text-[#8C9BAD] leading-relaxed"><?php echo esc_html( $solution ); ?></p>
        </div>
    </div>

    <!-- Post Content if any -->
    <div class="prose prose-invert max-w-none text-base leading-relaxed text-[#C5D0DD]">
        <?php the_content(); ?>
    </div>
</div>

<?php
endwhile;

get_footer();
`
  },
  {
    name: 'README.md',
    path: 'README.md',
    description: 'راهنمای گام‌به‌گام نصب قالب در وردپرس و فعال‌سازی ویجت‌های المنتور',
    content: `# راهنمای نصب و راه‌اندازی قالب وردپرس WISPAAR (ویسپار)

این پکیج شامل قالب کامل وردپرس **WISPAAR** با پشتیبانی کامل از المنتور (Elementor)، انواع پست‌های سفارشی (Custom Post Types)، پنل مدیریت بریف‌ها و اندپوینت‌های REST API است.

## مراحل نصب در وردپرس:
1. فایل زیپ قالب (\`wispaar-theme.zip\`) را از دکمه تعبیه‌شده در سایت دانلود کنید.
2. وارد پیشخوان وردپرس خود شوید: \`wp-admin\`
3. از منوی سمت راست به مسیر **نمایش (Appearance) -> پوسته‌ها (Themes) -> افزودن پوسته تازه -> بارگذاری پوسته** بروید.
4. فایل زیپ را انتخاب و روی دکمه **«نصب»** و سپس **«فعال‌سازی»** کلیک کنید.

## افزونه‌های پیشنهادی و سازگار:
- **Elementor** (رایگان یا پرو): برای طراحی آسان صفحات با استفاده از ویجت‌های اختصاصی ویسپار.
- **Advanced Custom Fields (ACF)** (اختیاری): فیلدهای پروژه بدون نیاز به پلاگین به‌صورت بومی در کد قالب تعبیه شده‌اند، اما با ACF نیز کاملاً هماهنگ است.

## مدیریت بریف‌ها و درخواست‌های پروژه:
- پس از فعال‌سازی، منوی جدیدی به نام **«درخواست‌های پروژه (Leads)»** در پیشخوان وردپرس ظاهر می‌شود.
- به محض اینکه کاربری در سایت فرم بریف یا تماس را پر کند:
  1. درخواست مستقیماً در این جدول ثبت شده و وضعیت «جدید» می‌گیرد.
  2. ایمیل نوتیفیکیشن برای مدیر سایت ارسال می‌شود.
  3. مدیر می‌تواند وضعیت لید را به «در حال بررسی» یا «جلسه هماهنگ شد» تغییر دهد.

## ویرایش و افزودن نمونه‌کارها:
- از منوی **«پروژه‌های ویسپار»** می‌توانید پروژه‌های فعلی را ویرایش کرده یا با کلیک روی **«افزودن پروژه جدید»**، پروژه‌های جدید همراه با مشخصات کارفرما، سال، صنعت، تصاویر، چالش و راهکار را ثبت کنید.
`
  }
];
