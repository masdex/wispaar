<?php
/**
 * Plugin Name: Wispaar Headless CMS Engine
 * Plugin URI:  https://wispaar.com
 * Description: Production-grade Headless REST API and Custom Post Types for WISPAAR Decoupled React Frontend. Works with ANY WordPress theme.
 * Version:     2.0.0
 * Author:      WISPAAR Studio
 * Author URI:  https://wispaar.com
 * License:     GPL-2.0+
 * Text Domain: wispaar-headless
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define Plugin Constants
define( 'WISPAAR_HEADLESS_VERSION', '2.0.0' );
define( 'WISPAAR_HEADLESS_DIR', plugin_dir_path( __FILE__ ) );

/**
 * 1. Register Custom Post Types: wispaar_project & wispaar_brief
 */
add_action( 'init', function () {
    // A. Projects CPT
    $project_labels = array(
        'name'               => 'پروژه‌های ویسپار',
        'singular_name'      => 'پروژه ویسپار',
        'menu_name'          => 'پروژه‌های ویسپار',
        'add_new'            => 'افزودن پروژه جدید',
        'add_new_item'       => 'افزودن پروژه جدید',
        'edit_item'          => 'ویرایش پروژه',
        'new_item'           => 'پروژه تازه',
        'view_item'          => 'مشاهده پروژه',
        'search_items'       => 'جستجوی پروژه‌ها',
        'not_found'          => 'پروژه‌ای یافت نشد',
        'not_found_in_trash' => 'پروژه‌ای در زباله‌دان یافت نشد',
    );

    register_post_type( 'wispaar_project', array(
        'labels'             => $project_labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'projects' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'       => true,
        'rest_base'          => 'projects',
    ) );

    // Register project_industry Taxonomy
    register_taxonomy( 'project_industry', 'wispaar_project', array(
        'hierarchical'      => true,
        'labels'            => array(
            'name'          => 'صنعت‌ها و حوزه‌ها',
            'singular_name' => 'صنعت',
            'search_items'  => 'جستجوی صنایع',
            'all_items'     => 'همه صنایع',
            'edit_item'     => 'ویرایش صنعت',
            'update_item'   => 'به‌روزرسانی صنعت',
            'add_new_item'  => 'افزودن صنعت تازه',
            'new_item_name' => 'نام صنعت تازه',
            'menu_name'     => 'صنعت‌ها',
        ),
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'industry' ),
        'show_in_rest'      => true,
    ) );

    // B. Leads / Briefs CPT
    $brief_labels = array(
        'name'               => 'درخواست‌های پروژه (Leads)',
        'singular_name'      => 'درخواست پروژه',
        'menu_name'          => 'درخواست‌های بریف',
        'all_items'          => 'همه درخواست‌ها',
        'edit_item'          => 'مشاهده جزئیات درخواست',
        'search_items'       => 'جستجوی درخواست‌ها',
        'not_found'          => 'هیچ درخواستی یافت نشد',
        'not_found_in_trash' => 'زباله‌دان خالی است',
    );

    register_post_type( 'wispaar_brief', array(
        'labels'             => $brief_labels,
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-feedback',
        'supports'           => array( 'title', 'custom-fields' ),
        'show_in_rest'       => false, // Access controlled via wispaar/v1/leads
    ) );
} );

/**
 * 2. Include REST API endpoints
 */
if ( file_exists( WISPAAR_HEADLESS_DIR . 'inc/rest-api.php' ) ) {
    require_once WISPAAR_HEADLESS_DIR . 'inc/rest-api.php';
} elseif ( file_exists( WISPAAR_HEADLESS_DIR . '../wordpress-theme/inc/rest-api.php' ) ) {
    require_once WISPAAR_HEADLESS_DIR . '../wordpress-theme/inc/rest-api.php';
}
