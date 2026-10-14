<?php
/**
 * WISPAAR Theme Functions & Core Architecture
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'WISPAAR_VERSION', '1.0.2' );
define( 'WISPAAR_DIR', get_template_directory() );
define( 'WISPAAR_URI', get_template_directory_uri() );

/**
 * Suppress PHP display errors on frontend so notices/warnings never corrupt DOM structure
 */
if ( ! is_admin() && ! ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
    @ini_set( 'display_errors', '0' );
}

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
        'primary-menu'    => esc_html__( 'منوی اصلی هدر', 'wispaar' ),
        'footer-services' => esc_html__( 'منوی خدمات فوتر', 'wispaar' ),
        'footer-company'  => esc_html__( 'منوی درباره و استودیو فوتر', 'wispaar' ),
    ) );

    // ELEMENTOR THEME SUPPORT
    add_theme_support( 'elementor' );
}
add_action( 'after_setup_theme', 'wispaar_setup' );

/**
 * 2. Enqueue Styles & Scripts (Fully self-contained, no broken CDN dependencies)
 */
function wispaar_scripts() {
    // 1. Google Fonts / Persian Vazirmatn
    wp_enqueue_style( 'wispaar-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Vazirmatn:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap', array(), null );
    
    // 2. CDN Font fallback (Vazirmatn) for high availability
    wp_enqueue_style( 'wispaar-vazirmatn-cdn', 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css', array(), '33.003' );

    // 3. Theme Main Stylesheet
    wp_enqueue_style( 'wispaar-style', get_stylesheet_uri(), array(), WISPAAR_VERSION );

    // 4. Standalone Wispaar Design System CSS
    if ( file_exists( WISPAAR_DIR . '/assets/css/wispaar.css' ) ) {
        wp_enqueue_style( 'wispaar-core-css', WISPAAR_URI . '/assets/css/wispaar.css', array( 'wispaar-style' ), WISPAAR_VERSION );
    }

    // 5. Main JavaScript (Form AJAX, mobile drawer, interaction)
    wp_enqueue_script( 'wispaar-main', WISPAAR_URI . '/assets/js/main.js', array(), WISPAAR_VERSION, true );

    // 6. Localize Script for REST API / AJAX
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
require_once WISPAAR_DIR . '/inc/cpt-projects.php';       // مدیریت پروژه‌ها و نمونه‌کارها
require_once WISPAAR_DIR . '/inc/cpt-inquiries.php';      // مدیریت لیدها و بریف‌های دریافتی
require_once WISPAAR_DIR . '/inc/rest-api.php';           // اندپوینت‌های امن REST API
require_once WISPAAR_DIR . '/inc/elementor-widgets.php';  // ابزارک‌های اختصاصی المنتور
require_once WISPAAR_DIR . '/inc/demo-importer.php';      // درون‌ریزی ۱ کلیک پروژه‌های دمو

/**
 * 4. Content Width
 */
function wispaar_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'wispaar_content_width', 1280 );
}
add_action( 'after_setup_theme', 'wispaar_content_width', 0 );
