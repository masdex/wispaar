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
        // Hero widget
        if ( file_exists( WISPAAR_DIR . '/inc/widgets/widget-hero.php' ) ) {
            require_once WISPAAR_DIR . '/inc/widgets/widget-hero.php';
            if ( class_exists( 'Wispaar_Elementor_Hero_Widget' ) ) {
                $widgets_manager->register( new \Wispaar_Elementor_Hero_Widget() );
            }
        }

        // Portfolio widget
        if ( file_exists( WISPAAR_DIR . '/inc/widgets/widget-portfolio.php' ) ) {
            require_once WISPAAR_DIR . '/inc/widgets/widget-portfolio.php';
            if ( class_exists( 'Wispaar_Elementor_Portfolio_Widget' ) ) {
                $widgets_manager->register( new \Wispaar_Elementor_Portfolio_Widget() );
            }
        }

        // Brief Form widget
        if ( file_exists( WISPAAR_DIR . '/inc/widgets/widget-brief-form.php' ) ) {
            require_once WISPAAR_DIR . '/inc/widgets/widget-brief-form.php';
            if ( class_exists( 'Wispaar_Elementor_Brief_Form_Widget' ) ) {
                $widgets_manager->register( new \Wispaar_Elementor_Brief_Form_Widget() );
            }
        }

        // Services widget
        if ( file_exists( WISPAAR_DIR . '/inc/widgets/widget-services.php' ) ) {
            require_once WISPAAR_DIR . '/inc/widgets/widget-services.php';
            if ( class_exists( 'Wispaar_Elementor_Services_Widget' ) ) {
                $widgets_manager->register( new \Wispaar_Elementor_Services_Widget() );
            }
        }
    }
}

/**
 * Universal Elementor Render Attribute Sanitizer
 * Solves: "Warning: Array to string conversion in elementor/includes/base/element-base.php on line 823"
 * Recursively flattens any nested array in render_attributes before Elementor calls implode()
 */
add_action( 'elementor/frontend/before_render', function( $element ) {
    if ( ! is_object( $element ) ) {
        return;
    }

    try {
        $reflector = new \ReflectionClass( $element );
        if ( $reflector->hasProperty( 'render_attributes' ) ) {
            $prop = $reflector->getProperty( 'render_attributes' );
            $prop->setAccessible( true );
            $raw_attrs = $prop->getValue( $element );

            if ( is_array( $raw_attrs ) && ! empty( $raw_attrs ) ) {
                $sanitized = array();
                foreach ( $raw_attrs as $el_key => $el_attributes ) {
                    if ( ! is_array( $el_attributes ) ) {
                        continue;
                    }
                    $sanitized[ $el_key ] = array();
                    foreach ( $el_attributes as $attr_name => $attr_values ) {
                        if ( is_array( $attr_values ) ) {
                            $flat_strings = array();
                            array_walk_recursive( $attr_values, function( $item ) use ( &$flat_strings ) {
                                if ( is_scalar( $item ) ) {
                                    $flat_strings[] = (string) $item;
                                } elseif ( is_object( $item ) && method_exists( $item, '__toString' ) ) {
                                    $flat_strings[] = (string) $item;
                                }
                            } );
                            $sanitized[ $el_key ][ $attr_name ] = $flat_strings;
                        } elseif ( is_scalar( $attr_values ) ) {
                            $sanitized[ $el_key ][ $attr_name ] = array( (string) $attr_values );
                        }
                    }
                }
                $prop->setValue( $element, $sanitized );
            }
        }
    } catch ( \Throwable $th ) {
        // Safe failover
    }
}, 0 );

add_action( 'init', function() {
    if ( did_action( 'elementor/loaded' ) ) {
        Wispaar_Elementor_Extension::instance();
    }
} );
