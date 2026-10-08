<?php
/**
 * REST API Endpoints for WISPAAR
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'wispaar/v1', '/brief', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_submit_brief',
        'permission_callback' => '__return_true',
    ) );
} );

function wispaar_rest_submit_brief( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $name        = sanitize_text_field( $params['name'] ?? '' );
    $phone       = sanitize_text_field( $params['phone'] ?? '' );
    $email       = sanitize_email( $params['email'] ?? '' );
    $services    = isset( $params['services'] ) && is_array( $params['services'] ) ? array_map( 'sanitize_text_field', $params['services'] ) : array();
    $budget      = sanitize_text_field( $params['budget'] ?? '' );
    $timeline    = sanitize_text_field( $params['timeline'] ?? '' );
    $description = sanitize_textarea_field( $params['description'] ?? '' );

    if ( empty( $name ) || empty( $phone ) ) {
        return new WP_Error( 'missing_fields', 'لطفاً نام و شماره تماس را وارد فرمایید.', array( 'status' => 400 ) );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $name . ' — ' . date_i18n( 'Y/m/d H:i' ),
        'post_type'    => 'wispaar_brief',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_failed', 'خطا در ثبت بریف پروژه.', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, '_wispaar_lead_phone', $phone );
    update_post_meta( $post_id, '_wispaar_lead_email', $email );
    update_post_meta( $post_id, '_wispaar_lead_services', $services );
    update_post_meta( $post_id, '_wispaar_lead_budget', $budget );
    update_post_meta( $post_id, '_wispaar_lead_timeline', $timeline );
    update_post_meta( $post_id, '_wispaar_lead_desc', $description );
    update_post_meta( $post_id, '_wispaar_lead_status', 'new' );

    $admin_email = get_option( 'admin_email' );
    wp_mail( $admin_email, 'درخواست پروژه جدید: ' . $name, "بریف جدید در وردپرس ثبت شد.\nنام: $name\nشماره: $phone" );

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'بریف پروژه شما با موفقیت در سیستم وردپرس ویسپار ثبت شد.',
        'lead_id' => $post_id,
    ) );
}
