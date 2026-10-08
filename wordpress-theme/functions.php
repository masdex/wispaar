<?php
/**
 * WISPAAR Theme Functions & Definitions
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
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

    // Elementor Theme Support
    add_theme_support( 'elementor' );
}
add_action( 'after_setup_theme', 'wispaar_setup' );

/**
 * 2. Enqueue Styles & Scripts
 */
function wispaar_scripts() {
    wp_enqueue_style( 'wispaar-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Vazirmatn:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap', array(), null );
    wp_enqueue_style( 'wispaar-style', get_stylesheet_uri(), array(), WISPAAR_VERSION );
    wp_enqueue_script( 'wispaar-tailwind', 'https://cdn.tailwindcss.com', array(), '3.4.0', false );

    wp_localize_script( 'wispaar-tailwind', 'wispaarSettings', array(
        'restUrl'  => esc_url_raw( rest_url( 'wispaar/v1/' ) ),
        'nonce'    => wp_create_nonce( 'wp_rest' ),
        'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'wispaar_scripts' );

/**
 * 3. Include Custom Modules
 */
require_once WISPAAR_DIR . '/inc/cpt-projects.php';
require_once WISPAAR_DIR . '/inc/cpt-inquiries.php';
require_once WISPAAR_DIR . '/inc/rest-api.php';
require_once WISPAAR_DIR . '/inc/elementor-widgets.php';

function wispaar_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'wispaar_content_width', 1280 );
}
add_action( 'after_setup_theme', 'wispaar_content_width', 0 );
