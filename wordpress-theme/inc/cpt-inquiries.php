<?php
/**
 * Custom Post Type: Project Briefs & Inquiries (دریافت و مدیریت لیدها در وردپرس)
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function wispaar_register_inquiries_cpt() {
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
            'create_posts' => false,
        ),
        'map_meta_cap'       => true,
    ) );
}
add_action( 'init', 'wispaar_register_inquiries_cpt' );

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
            echo is_array( $services ) ? esc_html( implode( '، ', $services ) ) : esc_html( $services ?: '—' );
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
