<?php
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
}

add_action( 'init', function() {
    if ( did_action( 'elementor/loaded' ) ) {
        Wispaar_Elementor_Extension::instance();
    }
} );
