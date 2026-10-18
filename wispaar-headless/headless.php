<?php
/**
 * Plugin Name: Wispaar Headless CMS Engine
 * Plugin URI:  https://wispaar.ir
 * Description: Production-grade Headless REST API and Custom Post Types for WISPAAR Decoupled React Frontend.
 * Version:     2.1.0
 * Author:      WISPAAR Studio
 * Author URI:  https://wispaar.ir
 * License:     GPL-2.0+
 * Text Domain: wispaar-headless
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'WISPAAR_HEADLESS_VERSION', '2.1.0' );

/**
 * 1. Register Custom Post Types: wispaar_project & wispaar_brief
 */
add_action( 'init', function () {
    // Projects CPT
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

    // Register project_category Taxonomy (Categories for filtering)
    register_taxonomy( 'project_category', 'wispaar_project', array(
        'hierarchical'      => true,
        'labels'            => array(
            'name'          => 'دسته‌بندی‌های پروژه',
            'singular_name' => 'دسته‌بندی پروژه',
            'search_items'  => 'جستجوی دسته‌بندی‌ها',
            'all_items'     => 'همه دسته‌بندی‌های پروژه',
            'edit_item'     => 'ویرایش دسته‌بندی',
            'update_item'   => 'به‌روزرسانی دسته‌بندی',
            'add_new_item'  => 'افزودن دسته‌بندی تازه',
            'new_item_name' => 'نام دسته‌بندی تازه',
            'menu_name'     => 'دسته‌بندی‌های پروژه',
        ),
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'project-category' ),
        'show_in_rest'      => true,
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

    // Leads / Briefs CPT
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
        'supports'           => array( 'title', 'editor', 'custom-fields' ),
        'show_in_rest'       => false, // Controlled via /leads endpoint
    ) );

    // 3. Direct Contact Inquiries CPT (Separate from Project Briefs!)
    $contact_labels = array(
        'name'               => 'پیام‌های تماس مستقیم (Messages)',
        'singular_name'      => 'پیام تماس',
        'menu_name'          => 'پیام‌های تماس',
        'all_items'          => 'همه پیام‌های تماس',
        'edit_item'          => 'مشاهده پیام تماس',
        'search_items'       => 'جستجوی پیام‌ها',
        'not_found'          => 'هیچ پیامی یافت نشد',
        'not_found_in_trash' => 'زباله‌دان پیام‌ها خالی است',
    );

    register_post_type( 'wispaar_contact', array(
        'labels'             => $contact_labels,
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_position'      => 7,
        'menu_icon'          => 'dashicons-email-alt',
        'supports'           => array( 'title' ),
        'show_in_rest'       => false,
    ) );
} );

/**
 * 2. Safe CORS origin resolver
 */
function wispaar_resolve_cors_origin() {
    $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? esc_url_raw( wp_unslash( $_SERVER['HTTP_ORIGIN'] ) ) : '';
    if ( empty( $origin ) ) {
        return '*';
    }

    $parsed = parse_url( $origin );
    $host   = isset( $parsed['host'] ) ? strtolower( $parsed['host'] ) : '';

    if (
        'localhost' === $host ||
        '127.0.0.1' === $host ||
        substr( $host, -6 ) === '.local' ||
        substr( $host, -5 ) === '.test' ||
        $host === 'wispaar.ir' ||
        $host === 'www.wispaar.ir' ||
        $origin === get_site_url() ||
        $origin === home_url()
    ) {
        return $origin;
    }

    $allowed = apply_filters( 'wispaar_allowed_origins', array( $origin ) );
    if ( in_array( $origin, $allowed, true ) ) {
        return $origin;
    }

    return '*';
}

function wispaar_send_cors_headers() {
    if ( headers_sent() ) {
        return;
    }

    $origin = wispaar_resolve_cors_origin();

    header( "Access-Control-Allow-Origin: $origin" );
    header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
    header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Accept, Origin' );

    if ( '*' !== $origin ) {
        header( 'Access-Control-Allow-Credentials: true' );
    }
}

add_action( 'init', function() {
    if ( ! headers_sent() ) {
        wispaar_send_cors_headers();
    }

    if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
        status_header( 200 );
        exit;
    }
} );

add_filter( 'rest_pre_serve_request', function( $served, $result, $request, $server ) {
    wispaar_send_cors_headers();
    return $served;
}, 10, 4 );

/**
 * 3. Authorization helper
 */
function wispaar_check_rest_permissions( $request, $capability = 'edit_posts' ) {
    if ( current_user_can( $capability ) ) {
        return true;
    }

    $auth = $request->get_header( 'Authorization' );
    if ( ! empty( $auth ) && strpos( $auth, 'Basic ' ) === 0 ) {
        $credentials = base64_decode( substr( $auth, 6 ) );
        if ( false !== $credentials && strpos( $credentials, ':' ) !== false ) {
            list( $username, $password ) = explode( ':', $credentials, 2 );
            $user = wp_authenticate_application_password( null, $username, $password );
            if ( ! is_wp_error( $user ) && $user && user_can( $user, $capability ) ) {
                wp_set_current_user( $user->ID );
                return true;
            }
        }
    }

    if ( defined( 'WP_ENVIRONMENT_TYPE' ) && 'local' === WP_ENVIRONMENT_TYPE ) {
        return true;
    }

    return new WP_Error(
        'rest_forbidden',
        'انجام این عملیات نیازمند مجوز مدیریت وردپرس یا Application Password معتبر است.',
        array( 'status' => rest_authorization_required_code() )
    );
}

/**
 * 4. Register REST Routes under wispaar/v1
 */
add_action( 'rest_api_init', function () {
    $namespace = 'wispaar/v1';

    // Health check
    register_rest_route( $namespace, '/health', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_health_check',
        'permission_callback' => '__return_true',
    ) );

    // Projects (GET, POST)
    register_rest_route( $namespace, '/projects', array(
        array(
            'methods'             => 'GET',
            'callback'            => 'wispaar_rest_get_projects',
            'permission_callback' => '__return_true',
        ),
        array(
            'methods'             => 'POST',
            'callback'            => 'wispaar_rest_create_project',
            'permission_callback' => function( $request ) {
                return wispaar_check_rest_permissions( $request, 'publish_posts' );
            },
        ),
    ) );

    // Single Project (GET)
    register_rest_route( $namespace, '/projects/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_single_project',
        'permission_callback' => '__return_true',
    ) );

    // Articles (GET)
    register_rest_route( $namespace, '/articles', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_articles',
        'permission_callback' => '__return_true',
    ) );

    // Single Article (GET)
    register_rest_route( $namespace, '/articles/(?P<slug>[a-zA-Z0-9_-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_single_article',
        'permission_callback' => '__return_true',
    ) );

    // Submit Brief (POST - Public with spam protection)
    register_rest_route( $namespace, '/brief', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_submit_brief',
        'permission_callback' => '__return_true',
    ) );

    // Submit Direct Contact Message (POST - Public)
    register_rest_route( $namespace, '/contact', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_submit_contact',
        'permission_callback' => '__return_true',
    ) );

    // Leads Query (GET - Protected)
    register_rest_route( $namespace, '/leads', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_leads',
        'permission_callback' => function( $request ) {
            return wispaar_check_rest_permissions( $request, 'edit_posts' );
        },
    ) );

    // Seeder (POST - Protected)
    register_rest_route( $namespace, '/seed', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_seed_database',
        'permission_callback' => function( $request ) {
            return wispaar_check_rest_permissions( $request, 'manage_options' );
        },
    ) );
} );

/**
 * 5. Health Check Handler
 */
function wispaar_rest_health_check() {
    $projects_count = wp_count_posts( 'wispaar_project' );
    $posts_count    = wp_count_posts( 'post' );
    $leads_count    = wp_count_posts( 'wispaar_brief' );

    return rest_ensure_response( array(
        'success'        => true,
        'status'         => 'online',
        'site'           => get_bloginfo( 'name' ),
        'wp'             => get_bloginfo( 'version' ),
        'mode'           => 'headless-cms',
        'engine'         => 'WISPAAR Headless WordPress Engine',
        'wp_version'     => get_bloginfo( 'version' ),
        'site_name'      => get_bloginfo( 'name' ),
        'site_url'       => get_site_url(),
        'rest_url'       => rest_url( 'wispaar/v1' ),
        'cors_enabled'   => true,
        'timestamp'      => current_time( 'mysql' ),
        'timezone'       => wp_timezone_string(),
        'counts'         => array(
            'projects' => (int) ( $projects_count->publish ?? 0 ),
            'articles' => (int) ( $posts_count->publish ?? 0 ),
            'leads'    => (int) ( $leads_count->publish ?? 0 ),
        ),
        'features'       => array(
            'rest_projects' => true,
            'rest_articles' => true,
            'rest_brief'    => true,
            'auto_seeder'   => true,
        ),
    ) );
}

/**
 * 6. Format Project for API
 */
function wispaar_format_project( $post ) {
    $post_id   = $post->ID;
    $thumbnail = get_the_post_thumbnail_url( $post_id, 'full' );

    // Extract categories and industry terms
    $categories = wp_get_post_terms( $post_id, 'project_category', array( 'fields' => 'names' ) );
    $category_slugs = wp_get_post_terms( $post_id, 'project_category', array( 'fields' => 'slugs' ) );
    $industries = wp_get_post_terms( $post_id, 'project_industry', array( 'fields' => 'names' ) );

    $industry = ! empty( $industries ) && ! is_wp_error( $industries ) ? $industries[0] : ( get_post_meta( $post_id, '_wispaar_industry', true ) ?: 'فین‌تک و خدمات مالی' );
    $primary_category = ! empty( $categories ) && ! is_wp_error( $categories ) ? $categories[0] : $industry;

    $tech_meta = get_post_meta( $post_id, '_wispaar_tech', true );
    if ( is_string( $tech_meta ) && ! empty( $tech_meta ) ) {
        $technology = array_map( 'trim', explode( ',', $tech_meta ) );
    } elseif ( is_array( $tech_meta ) ) {
        $technology = $tech_meta;
    } else {
        $technology = array( 'WordPress Headless', 'React', 'Tailwind CSS', 'REST API' );
    }

    $srv_meta = get_post_meta( $post_id, '_wispaar_services', true );
    if ( is_string( $srv_meta ) && ! empty( $srv_meta ) ) {
        $services = array_map( 'trim', explode( ',', $srv_meta ) );
    } elseif ( is_array( $srv_meta ) ) {
        $services = $srv_meta;
    } else {
        $services = array( 'طراحی اختصاصی UI/UX', 'توسعه وردپرس مهندسی‌شده' );
    }

    $kpi1_lbl = get_post_meta( $post_id, '_wispaar_kpi1_lbl', true ) ?: 'شاخص عملکرد لایت‌هاوس';
    $kpi1_val = get_post_meta( $post_id, '_wispaar_kpi1_val', true ) ?: '۹۹/۱۰۰';
    $kpi2_lbl = get_post_meta( $post_id, '_wispaar_kpi2_lbl', true ) ?: 'نرخ تبدیل لندینگ';
    $kpi2_val = get_post_meta( $post_id, '_wispaar_kpi2_val', true ) ?: '+۷۵٪';

    $all_cats = array();
    if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
        $all_cats = array_merge( $all_cats, $categories );
    }
    if ( ! empty( $industry ) && ! in_array( $industry, $all_cats ) ) {
        $all_cats[] = $industry;
    }

    return array(
        'id'                    => (string) $post_id,
        'slug'                  => $post->post_name,
        'title'                 => $post->post_title,
        'titleEn'               => get_post_meta( $post_id, '_wispaar_title_en', true ) ?: $post->post_name,
        'client'                => get_post_meta( $post_id, '_wispaar_client', true ) ?: 'سفارشی ویسپار',
        'category'              => $primary_category,
        'categories'            => $all_cats,
        'category_slugs'        => ! empty( $category_slugs ) && ! is_wp_error( $category_slugs ) ? $category_slugs : array(),
        'industry'              => $industry,
        'services'              => $services,
        'technology'            => $technology,
        'year'                  => get_post_meta( $post_id, '_wispaar_year', true ) ?: '۱۴۰۴',
        'project_type'          => get_post_meta( $post_id, '_wispaar_ptype', true ) ?: 'وب‌سایت اختصاصی و سیستم هویت برند',
        'challenge'             => get_post_meta( $post_id, '_wispaar_challenge', true ) ?: ( $post->post_excerpt ?: 'طراحی و پیاده‌سازی سامانه وب اختصاصی با رعایت بالاترین استانداردهای پرفورمنس.' ),
        'solution'              => get_post_meta( $post_id, '_wispaar_solution', true ) ?: 'طراحی سیستم دیزاین مینیمال، معماری ماژولار و اتصال مستقیم به هسته وردپرس هدلس.',
        'results'               => array(
            array( 'label' => $kpi1_lbl, 'value' => $kpi1_val, 'detail' => 'شاخص پرفورمنس هسته' ),
            array( 'label' => $kpi2_lbl, 'value' => $kpi2_val, 'detail' => 'شاخص رشد سرنخ' ),
        ),
        'featured_image'        => $thumbnail ?: null,
        'coverImage'            => $thumbnail ?: null,
        'is_featured'           => get_post_meta( $post_id, '_wispaar_is_featured', true ) === '1',
        'is_demo'               => get_post_meta( $post_id, '_wispaar_is_demo', true ) === '1',
        'related_service'       => get_post_meta( $post_id, '_wispaar_service', true ) ?: '',
        'quote'                 => get_post_meta( $post_id, '_wispaar_quote', true ) ?: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
        'demo_url'              => get_post_meta( $post_id, '_wispaar_demo_url', true ) ?: get_permalink( $post_id ),
        'link'                  => get_permalink( $post_id ),
        'date'                  => get_the_date( 'c', $post ),
        'content'               => apply_filters( 'the_content', $post->post_content ),
        'excerpt'               => get_the_excerpt( $post ),
    );
}

/**
 * 7. GET /projects
 */
function wispaar_rest_get_projects( WP_REST_Request $request ) {
    $page     = max( 1, (int) $request->get_param( 'page' ) );
    $per_page = max( 1, min( 50, (int) ( $request->get_param( 'per_page' ) ?: 12 ) ) );

    $args = array(
        'post_type'      => 'wispaar_project',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $query = new WP_Query( $args );
    $items = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $items[] = wispaar_format_project( $query->post );
        }
        wp_reset_postdata();
    }

    $total       = (int) $query->found_posts;
    $total_pages = (int) $query->max_num_pages;

    return rest_ensure_response( array(
        'items'       => $items,
        'total'       => $total,
        'total_pages' => $total_pages,
        'page'        => $page,
        // Compatibility keys
        'projects'    => $items,
        'count'       => count( $items ),
        'success'     => true,
    ) );
}

/**
 * 8. GET /projects/{slug}
 */
function wispaar_rest_get_single_project( WP_REST_Request $request ) {
    $slug = sanitize_title( $request->get_param( 'slug' ) );

    $args = array(
        'name'           => $slug,
        'post_type'      => 'wispaar_project',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
    );

    $posts = get_posts( $args );

    if ( empty( $posts ) ) {
        return new WP_Error( 'not_found', 'پروژه مورد نظر یافت نشد.', array( 'status' => 404 ) );
    }

    return rest_ensure_response( array(
        'success' => true,
        'project' => wispaar_format_project( $posts[0] ),
        'item'    => wispaar_format_project( $posts[0] ),
    ) );
}

/**
 * 9. POST /projects (Create Project)
 */
function wispaar_rest_create_project( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $title    = sanitize_text_field( $params['title'] ?? '' );
    $client   = sanitize_text_field( $params['client'] ?? '' );
    $industry = sanitize_text_field( $params['industry'] ?? 'فین‌تک و خدمات مالی' );
    $year     = sanitize_text_field( $params['year'] ?? '۱۴۰۴' );
    $ptype    = sanitize_text_field( $params['projectType'] ?? 'وب‌سایت اختصاصی' );
    $challenge= sanitize_textarea_field( $params['challenge'] ?? '' );
    $solution = sanitize_textarea_field( $params['solution'] ?? '' );

    if ( empty( $title ) ) {
        return new WP_Error( 'missing_title', 'عنوان پروژه الزامی است.', array( 'status' => 400 ) );
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $title,
        'post_content' => $solution,
        'post_excerpt' => $challenge,
        'post_type'    => 'wispaar_project',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'insert_failed', 'خطا در ثبت پروژه در دیتابیس.', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, '_wispaar_client', $client );
    update_post_meta( $post_id, '_wispaar_industry', $industry );
    update_post_meta( $post_id, '_wispaar_year', $year );
    update_post_meta( $post_id, '_wispaar_ptype', $ptype );
    update_post_meta( $post_id, '_wispaar_challenge', $challenge );
    update_post_meta( $post_id, '_wispaar_solution', $solution );
    update_post_meta( $post_id, '_wispaar_is_demo', ! empty( $params['isDemo'] ) ? '1' : '0' );

    $created_post = get_post( $post_id );

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'پروژه با موفقیت در وردپرس منتشر گردید.',
        'id'      => $post_id,
        'project' => wispaar_format_project( $created_post ),
    ) );
}

/**
 * 10. Format Article
 */
function wispaar_format_article( $post ) {
    $post_id = $post->ID;

    // Categories extraction: prioritize user-assigned custom category
    $categories = get_the_category( $post_id );
    $category_names = array();
    $category_slugs = array();
    $chosen_category = '';

    if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) {
        foreach ( $categories as $cat ) {
            $slug_lower = strtolower( $cat->slug );
            $name_trim  = trim( $cat->name );
            // Skip default unassigned categories if any custom category is chosen
            if ( ! in_array( $slug_lower, array( 'uncategorized', 'dasteh-bandi-nashodeh', 'uncat' ) ) &&
                 ! in_array( $name_trim, array( 'دسته‌بندی نشده', 'Uncategorized', 'عمومی' ) ) ) {
                $category_names[] = $name_trim;
                $category_slugs[] = $cat->slug;
                if ( empty( $chosen_category ) ) {
                    $chosen_category = $name_trim;
                }
            }
        }
        // Fall back to first category if only uncategorized was attached
        if ( empty( $chosen_category ) && ! empty( $categories[0] ) ) {
            $chosen_category = $categories[0]->name;
            $category_names[] = $categories[0]->name;
            $category_slugs[] = $categories[0]->slug;
        }
    }

    if ( empty( $chosen_category ) ) {
        $chosen_category = 'یادداشت‌های استودیو';
    }

    // Featured image or first image embedded in post content
    $thumbnail = get_the_post_thumbnail_url( $post_id, 'full' );
    if ( empty( $thumbnail ) ) {
        if ( preg_match( '/<img[^>]+src=[\'"]([^\'"]+)[\'"]/i', $post->post_content, $img_matches ) ) {
            $thumbnail = $img_matches[1];
        }
    }

    // Read time calculation based on word count
    $clean_content = strip_tags( $post->post_content );
    $word_count = mb_strlen( $clean_content, 'UTF-8' ) > 0 ? count( preg_split( '/\s+/u', trim( $clean_content ) ) ) : 0;
    $read_minutes = max( 3, ceil( $word_count / 180 ) );
    $read_time = $read_minutes . ' دقیقه';

    // Tags
    $post_tags = wp_get_post_tags( $post_id, array( 'fields' => 'names' ) );
    $tags = ! empty( $post_tags ) && ! is_wp_error( $post_tags ) ? $post_tags : array( $chosen_category, 'معماری وب' );

    return array(
        'id'             => (string) $post_id,
        'slug'           => $post->post_name,
        'title'          => $post->post_title,
        'excerpt'        => get_the_excerpt( $post ) ?: wp_trim_words( $post->post_content, 35 ),
        'content'        => apply_filters( 'the_content', $post->post_content ),
        'category'       => $chosen_category,
        'categories'     => $category_names,
        'category_slugs' => $category_slugs,
        'tags'           => $tags,
        'read_time'      => $read_time,
        'featured_image' => $thumbnail ?: null,
        'date'           => get_the_date( 'c', $post ),
        'link'           => get_permalink( $post_id ),
        'author_name'    => get_the_author_meta( 'display_name', $post->post_author ) ?: 'تیم فنی ویسپار',
        'author_role'    => 'استودیو دیجیتال ویسپار',
    );
}

/**
 * 11. GET /articles
 */
function wispaar_rest_get_articles( WP_REST_Request $request ) {
    $page     = max( 1, (int) $request->get_param( 'page' ) );
    $per_page = max( 1, min( 50, (int) ( $request->get_param( 'per_page' ) ?: 12 ) ) );

    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $query = new WP_Query( $args );
    $items = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $items[] = wispaar_format_article( $query->post );
        }
        wp_reset_postdata();
    }

    $total       = (int) $query->found_posts;
    $total_pages = (int) $query->max_num_pages;

    return rest_ensure_response( array(
        'items'       => $items,
        'total'       => $total,
        'total_pages' => $total_pages,
        'page'        => $page,
        // Compatibility keys
        'articles'    => $items,
        'count'       => count( $items ),
        'success'     => true,
    ) );
}

/**
 * 12. GET /articles/{slug}
 */
function wispaar_rest_get_single_article( WP_REST_Request $request ) {
    $slug = sanitize_title( $request->get_param( 'slug' ) );

    $args = array(
        'name'           => $slug,
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
    );

    $posts = get_posts( $args );

    if ( empty( $posts ) ) {
        return new WP_Error( 'not_found', 'مقاله مورد نظر یافت نشد.', array( 'status' => 404 ) );
    }

    return rest_ensure_response( array(
        'success' => true,
        'article' => wispaar_format_article( $posts[0] ),
        'item'    => wispaar_format_article( $posts[0] ),
    ) );
}

/**
 * 13. POST /brief (Submit Project Brief / Lead)
 */
function wispaar_rest_submit_brief( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $name     = sanitize_text_field( $params['name'] ?? '' );
    $phone    = sanitize_text_field( $params['phone'] ?? '' );
    $email    = sanitize_email( $params['email'] ?? '' );
    $honeypot = sanitize_text_field( $params['_hp'] ?? ( $params['company_trap'] ?? '' ) );

    if ( ! empty( $honeypot ) ) {
        return rest_ensure_response( array(
            'success' => true,
            'message' => 'درخواست شما ثبت شد.',
        ) );
    }

    $remote_ip = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1' );
    $rate_key  = 'wispaar_rate_' . md5( $remote_ip );
    $attempts  = (int) get_transient( $rate_key );
    if ( $attempts >= 5 ) {
        return new WP_Error(
            'rate_limit_exceeded',
            'تعداد درخواست‌های ارسالی از سمت شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر مجدداً تلاش فرمایید.',
            array( 'status' => 429 )
        );
    }
    set_transient( $rate_key, $attempts + 1, 10 * MINUTE_IN_SECONDS );

    $services    = isset( $params['services'] ) && is_array( $params['services'] ) ? array_map( 'sanitize_text_field', $params['services'] ) : array();
    $goals       = isset( $params['goals'] ) && is_array( $params['goals'] ) ? array_map( 'sanitize_text_field', $params['goals'] ) : array();
    $platform    = sanitize_text_field( $params['platform'] ?? '' );
    $website     = sanitize_text_field( $params['website'] ?? '' );
    $budget      = sanitize_text_field( $params['budget'] ?? '' );
    $timeline    = sanitize_text_field( $params['timeline'] ?? '' );
    $description = sanitize_textarea_field( $params['description'] ?? '' );

    if ( empty( $name ) || empty( $phone ) ) {
        return new WP_Error( 'missing_fields', 'لطفاً نام و شماره تماس را وارد فرمایید.', array( 'status' => 400 ) );
    $services_str = ! empty( $services ) ? implode( '، ', $services ) : 'خدمات عمومی';
    $goals_str    = ! empty( $goals ) ? implode( '، ', $goals ) : 'اهداف استاندارد کسب‌وکار';

    $formatted_content = "<div class='wispaar-brief-summary' style='font-family:Tahoma, sans-serif; line-height:1.8;'>"
        . "<h3 style='color:#1769FF;'>اطلاعات متقاضی بریف:</h3>"
        . "<ul>"
        . "<li><strong>نام متقاضی:</strong> " . esc_html( $name ) . "</li>"
        . "<li><strong>شماره تماس:</strong> <a href='tel:" . esc_attr( $phone ) . "' style='font-weight:bold; color:#0073aa;'>" . esc_html( $phone ) . "</a> (<a href='https://wa.me/" . preg_replace( '/[^0-9]/', '', $phone ) . "' target='_blank' style='color:#25D366;'>ارسال پیام در واتساپ</a>)</li>"
        . "<li><strong>ایمیل:</strong> <a href='mailto:" . esc_attr( $email ) . "'>" . esc_html( $email ?: 'ثبت نشده' ) . "</a></li>"
        . "<li><strong>وب‌سایت فعلی:</strong> " . ( $website ? "<a href='" . esc_url( $website ) . "' target='_blank'>" . esc_html( $website ) . "</a>" : 'ثبت نشده' ) . "</li>"
        . "<li><strong>پلتفرم فعلی:</strong> " . esc_html( $platform ?: 'مشخص نشده' ) . "</li>"
        . "<li><strong>بازه بودجه:</strong> " . esc_html( $budget ?: 'تعیین نشده' ) . "</li>"
        . "<li><strong>زمان‌بندی تحویل:</strong> " . esc_html( $timeline ?: 'تعیین نشده' ) . "</li>"
        . "</ul>"
        . "<h3 style='color:#1769FF;'>خدمات درخواستی:</h3>"
        . "<p>" . esc_html( $services_str ) . "</p>"
        . "<h3 style='color:#1769FF;'>اهداف پروژه:</h3>"
        . "<p>" . esc_html( $goals_str ) . "</p>"
        . "<h3 style='color:#1769FF;'>شرح و توضیحات نیازمندی‌ها:</h3>"
        . "<blockquote style='background:#f9f9f9; padding:12px; border-right:4px solid #1769FF; margin:0;'>" . nl2br( esc_html( $description ?: 'توضیحات تکمیلی ثبت نشده است.' ) ) . "</blockquote>"
        . "</div>";

    $post_title = $name . ' — ' . ( ! empty( $services ) ? implode( '، ', array_slice( $services, 0, 2 ) ) : 'درخواست پروژه' ) . ' — ' . date_i18n( 'Y/m/d H:i' );

    $post_id = wp_insert_post( array(
        'post_title'   => $post_title,
        'post_content' => $formatted_content,
        'post_type'    => 'wispaar_brief',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_failed', 'خطا در ثبت بریف در وردپرس.', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, '_wispaar_lead_name', $name );
    update_post_meta( $post_id, '_wispaar_lead_phone', $phone );
    update_post_meta( $post_id, '_wispaar_lead_email', $email );
    update_post_meta( $post_id, '_wispaar_lead_services', $services );
    update_post_meta( $post_id, '_wispaar_lead_goals', $goals );
    update_post_meta( $post_id, '_wispaar_lead_platform', $platform );
    update_post_meta( $post_id, '_wispaar_lead_website', $website );
    update_post_meta( $post_id, '_wispaar_lead_budget', $budget );
    update_post_meta( $post_id, '_wispaar_lead_timeline', $timeline );
    update_post_meta( $post_id, '_wispaar_lead_desc', $description );
    update_post_meta( $post_id, '_wispaar_lead_status', 'جدید' );

    $admin_email = get_option( 'admin_email' );
    if ( $admin_email ) {
        @wp_mail(
            $admin_email,
            'درخواست پروژه جدید: ' . $name,
            "یک بریف جدید از فرانت‌اند هدلس ویسپار دریافت شد:\nنام: $name\nشماره تماس: $phone\nایمیل: $email\nخدمات: $services_str\nبودجه: $budget\nشرح: $description"
        );
    }

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'بریف پروژه شما با موفقیت در پیشخوان وردپرس ثبت شد.',
        'lead_id' => $post_id,
        'id'      => $post_id,
    ) );
}

/**
 * 14. GET /leads (Protected Admin Route)
 */
function wispaar_rest_get_leads() {
    $args = array(
        'post_type'      => 'wispaar_brief',
        'post_status'    => 'publish',
        'posts_per_page' => 100,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $posts = get_posts( $args );
    $leads = array();

    foreach ( $posts as $p ) {
        $leads[] = array(
            'id'          => (string) $p->ID,
            'title'       => $p->post_title,
            'name'        => get_post_meta( $p->ID, '_wispaar_lead_phone', true ) ? explode( ' — ', $p->post_title )[0] : $p->post_title,
            'phone'       => get_post_meta( $p->ID, '_wispaar_lead_phone', true ),
            'email'       => get_post_meta( $p->ID, '_wispaar_lead_email', true ),
            'services'    => get_post_meta( $p->ID, '_wispaar_lead_services', true ) ?: array(),
            'goals'       => get_post_meta( $p->ID, '_wispaar_lead_goals', true ) ?: array(),
            'platform'    => get_post_meta( $p->ID, '_wispaar_lead_platform', true ),
            'website'     => get_post_meta( $p->ID, '_wispaar_lead_website', true ),
            'budget'      => get_post_meta( $p->ID, '_wispaar_lead_budget', true ),
            'timeline'    => get_post_meta( $p->ID, '_wispaar_lead_timeline', true ),
            'description' => get_post_meta( $p->ID, '_wispaar_lead_desc', true ),
            'status'      => get_post_meta( $p->ID, '_wispaar_lead_status', true ) ?: 'new',
            'created_at'  => get_the_date( 'c', $p ),
            'date'        => get_the_date( 'c', $p ),
        );
    }

    return rest_ensure_response( array(
        'success' => true,
        'items'   => $leads,
        'leads'   => $leads,
        'count'   => count( $leads ),
    ) );
}

/**
 * 15. POST /seed (Protected Admin Seeder)
 */
function wispaar_rest_seed_database() {
    $demo_projects = array(
        array(
            'title'     => 'آریا کاپیتال',
            'title_en'  => 'Arya Capital',
            'slug'      => 'arya-capital',
            'client'    => 'هلدینگ مدیریت سرمایه و ثروت آریا',
            'industry'  => 'فین‌تک و خدمات مالی بین‌المللی',
            'year'      => '۱۴۰۴',
            'ptype'     => 'وب‌سایت اختصاصی و پورتال سازمانی',
            'challenge' => 'سامانه‌ای مدرن و سریع با لود زیر ۱ ثانیه برای گزارش‌های مالی تحلیلی.',
            'solution'  => 'طراحی نظام بصری دارک و مینی‌مال با معماری ماژولار.',
            'kpi1_val'  => '۹۹/۱۰۰',
            'kpi1_lbl'  => 'شاخص پرفورمنس لایت‌هاوس',
            'kpi2_val'  => '+۶۴٪',
            'kpi2_lbl'  => 'نرخ تبدیل سرنخ',
        ),
        array(
            'title'     => 'ژنوم لبز',
            'title_en'  => 'Genome Labs',
            'slug'      => 'genome-labs',
            'client'    => 'مرکز تحقیقاتی بیوتکنولوژی و ژنتیک ژنوم',
            'industry'  => 'سلامت، علوم زیستی و آزمایشگاهی',
            'year'      => '۱۴۰۳',
            'ptype'     => 'وب‌سایت علمی و سامانه پذیرش آزمون',
            'challenge' => 'ارائه بیش از ۳۰۰ نوع تست ژنتیک بدون سردرگمی کاربر.',
            'solution'  => 'سیستم فیلترینگ چندلایه و قالب فوق‌العاده سبک.',
            'kpi1_val'  => '-۷۵٪',
            'kpi1_lbl'  => 'سرعت دسترسی به نتایج',
            'kpi2_val'  => '۱۰۰٪',
            'kpi2_lbl'  => 'پایداری سرور در بار ترافیکی',
        ),
        array(
            'title'     => 'آتلیه معماری هور',
            'title_en'  => 'Hoor Atelier',
            'slug'      => 'hoor-atelier',
            'client'    => 'استودیو معماری و طراحی پایدار هور',
            'industry'  => 'معماری، ساخت‌وساز لوکس و طراحی داخلی',
            'year'      => '۱۴۰۳',
            'ptype'     => 'وب‌سایت تعاملی مونوکروم و شوروم آنلاین',
            'challenge' => 'نمایش گالری‌های تصویری با رزولوشن فوق‌العاده بالا بدون افت پرفورمنس.',
            'solution'  => 'بارگذاری پیش‌بینانه تصاویر، انیمیشن‌های مینیمال با شتاب سخت‌افزاری.',
            'kpi1_val'  => '+۱۲۰٪',
            'kpi1_lbl'  => 'زمان ماندگاری کاربر',
            'kpi2_val'  => '۰.۳ ثانیه',
            'kpi2_lbl'  => 'زمان پاسخگویی تعاملی',
        ),
        array(
            'title'     => 'سیناپس کلود',
            'title_en'  => 'Synapse Cloud',
            'slug'      => 'synapse-cloud',
            'client'    => 'شرکت فناوری‌های پردازش ابری و شبکه سیناپس',
            'industry'  => 'زیرساخت ابری، هوش مصنوعی و مراکز داده',
            'year'      => '۱۴۰۴',
            'ptype'     => 'پورتال یکپارچه ابری و مستندات فنی API',
            'challenge' => 'مستندات پیچیده چندزبانه با رابط کاربری روان برای توسعه‌دهندگان.',
            'solution'  => 'طراحی داشبورد مهندسی با تایپوگرافی مونو، دارک مود مطلق و جستجوی لحظه‌ای.',
            'kpi1_val'  => '۹۹.۹۹٪',
            'kpi1_lbl'  => 'شاخص دسترسی آپ‌تایم',
            'kpi2_val'  => '+۸۵٪',
            'kpi2_lbl'  => 'نرخ ثبت‌نام برنامه‌نویسان',
        ),
    );

    $seeded_count  = 0;
    $skipped_count = 0;

    foreach ( $demo_projects as $p ) {
        $existing = get_posts( array(
            'name'        => $p['slug'],
            'post_type'   => 'wispaar_project',
            'post_status' => 'any',
        ) );

        if ( ! empty( $existing ) ) {
            $skipped_count++;
            continue;
        }

        $post_id = wp_insert_post( array(
            'post_title'   => $p['title'],
            'post_name'    => $p['slug'],
            'post_content' => $p['solution'],
            'post_excerpt' => $p['challenge'],
            'post_type'    => 'wispaar_project',
            'post_status'  => 'publish',
        ) );

        if ( ! is_wp_error( $post_id ) ) {
            update_post_meta( $post_id, '_wispaar_title_en', $p['title_en'] );
            update_post_meta( $post_id, '_wispaar_client', $p['client'] );
            update_post_meta( $post_id, '_wispaar_industry', $p['industry'] );
            update_post_meta( $post_id, '_wispaar_year', $p['year'] );
            update_post_meta( $post_id, '_wispaar_ptype', $p['ptype'] );
            update_post_meta( $post_id, '_wispaar_challenge', $p['challenge'] );
            update_post_meta( $post_id, '_wispaar_solution', $p['solution'] );
            update_post_meta( $post_id, '_wispaar_kpi1_val', $p['kpi1_val'] );
            update_post_meta( $post_id, '_wispaar_kpi1_lbl', $p['kpi1_lbl'] );
            update_post_meta( $post_id, '_wispaar_kpi2_val', $p['kpi2_val'] );
            update_post_meta( $post_id, '_wispaar_kpi2_lbl', $p['kpi2_lbl'] );
            update_post_meta( $post_id, '_wispaar_is_demo', '1' );
            $seeded_count++;
        }
    }

    return rest_ensure_response( array(
        'success'       => true,
        'message'       => "عملیات درون‌ریزی انجام شد: $seeded_count پروژه افزوده شد و $skipped_count پروژه از قبل موجود بود.",
        'seeded_count'  => $seeded_count,
        'skipped_count' => $skipped_count,
    ) );
}

/**
 * -----------------------------------------------------------------------------
 * 16. WordPress Admin Customizations: Columns, Meta Boxes & Dashboard
 * -----------------------------------------------------------------------------
 */

// A. Custom Columns for Project Briefs (wispaar_brief)
add_filter( 'manage_wispaar_brief_posts_columns', function( $columns ) {
    $new_cols = array();
    $new_cols['cb']             = $columns['cb'] ?? '<input type="checkbox" />';
    $new_cols['title']          = 'نام متقاضی و عنوان';
    $new_cols['lead_contact']   = 'اطلاعات تماس';
    $new_cols['lead_services']  = 'خدمات درخواستی';
    $new_cols['lead_budget']    = 'بودجه و زمان';
    $new_cols['lead_status']    = 'وضعیت رسیدگی';
    $new_cols['date']           = 'تاریخ و زمان ثبت';
    return $new_cols;
} );

add_action( 'manage_wispaar_brief_posts_custom_column', function( $column, $post_id ) {
    if ( 'lead_contact' === $column ) {
        $phone = get_post_meta( $post_id, '_wispaar_lead_phone', true );
        $email = get_post_meta( $post_id, '_wispaar_lead_email', true );
        $clean_phone = preg_replace( '/[^0-9]/', '', $phone );
        echo '<div style="line-height:1.6;">';
        if ( $phone ) {
            echo '<div style="font-weight:bold;"><a href="tel:' . esc_attr( $phone ) . '" dir="ltr">📞 ' . esc_html( $phone ) . '</a></div>';
            echo '<div style="margin-top:2px;"><a href="https://wa.me/' . esc_attr( $clean_phone ) . '" target="_blank" style="color:#25D366; text-decoration:none; font-size:11px;">💬 پیام در واتساپ</a></div>';
        }
        if ( $email ) {
            echo '<div style="color:#666; font-size:11px;"><a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></div>';
        }
        echo '</div>';
    } elseif ( 'lead_services' === $column ) {
        $services = get_post_meta( $post_id, '_wispaar_lead_services', true );
        if ( is_array( $services ) && ! empty( $services ) ) {
            foreach ( $services as $s ) {
                echo '<span style="display:inline-block; background:#e0f2fe; color:#0369a1; padding:2px 7px; border-radius:4px; font-size:11px; margin:2px 2px 2px 0;">' . esc_html( $s ) . '</span>';
            }
        } else {
            echo '<span style="color:#999; font-size:11px;">خدمات عمومی</span>';
        }
    } elseif ( 'lead_budget' === $column ) {
        $budget   = get_post_meta( $post_id, '_wispaar_lead_budget', true );
        $timeline = get_post_meta( $post_id, '_wispaar_lead_timeline', true );
        echo '<div style="font-size:12px;">';
        if ( $budget ) echo '<div><strong>بودجه:</strong> ' . esc_html( $budget ) . '</div>';
        if ( $timeline ) echo '<div style="color:#666;"><strong>زمان:</strong> ' . esc_html( $timeline ) . '</div>';
        if ( ! $budget && ! $timeline ) echo '<span style="color:#999;">مشخص نشده</span>';
        echo '</div>';
    } elseif ( 'lead_status' === $column ) {
        $status = get_post_meta( $post_id, '_wispaar_lead_status', true ) ?: 'جدید';
        $color_map = array(
            'جدید'                  => array( 'bg' => '#dbeafe', 'text' => '#1e40af' ),
            'در حال بررسی'           => array( 'bg' => '#fef3c7', 'text' => '#92400e' ),
            'تماس برقرار شد'         => array( 'bg' => '#dcfce7', 'text' => '#166534' ),
            'در حال تنظیم پروپوزال'  => array( 'bg' => '#f3e8ff', 'text' => '#6b21a8' ),
            'قرارداد منعقد شد'       => array( 'bg' => '#bbf7d0', 'text' => '#14532d' ),
            'بایگانی'               => array( 'bg' => '#f3f4f6', 'text' => '#4b5563' ),
        );
        $style = $color_map[$status] ?? array( 'bg' => '#e2e8f0', 'text' => '#334155' );
        echo '<span style="display:inline-block; font-weight:bold; padding:3px 8px; border-radius:12px; font-size:11px; background:' . $style['bg'] . '; color:' . $style['text'] . ';">' . esc_html( $status ) . '</span>';
    }
}, 10, 2 );

// B. Rich Meta Box for Project Briefs (wispaar_brief)
add_action( 'add_meta_boxes', function() {
    add_meta_box(
        'wispaar_brief_details_box',
        '⚡ اطلاعات و نیازمندی‌های کامل بریف ارسالی مشتری',
        'wispaar_render_brief_metabox',
        'wispaar_brief',
        'normal',
        'high'
    );

    add_meta_box(
        'wispaar_project_meta_box',
        '✨ مشخصات اختصاصی و فیلدهای پروژه ویسپار (WISPAAR Custom Fields)',
        'wispaar_render_project_metabox',
        'wispaar_project',
        'normal',
        'high'
    );
} );

function wispaar_render_brief_metabox( $post ) {
    wp_nonce_field( 'wispaar_brief_meta_nonce_action', 'wispaar_brief_meta_nonce' );
    $post_id  = $post->ID;
    $name     = get_post_meta( $post_id, '_wispaar_lead_name', true ) ?: $post->post_title;
    $phone    = get_post_meta( $post_id, '_wispaar_lead_phone', true );
    $email    = get_post_meta( $post_id, '_wispaar_lead_email', true );
    $website  = get_post_meta( $post_id, '_wispaar_lead_website', true );
    $platform = get_post_meta( $post_id, '_wispaar_lead_platform', true );
    $budget   = get_post_meta( $post_id, '_wispaar_lead_budget', true );
    $timeline = get_post_meta( $post_id, '_wispaar_lead_timeline', true );
    $services = get_post_meta( $post_id, '_wispaar_lead_services', true ) ?: array();
    $goals    = get_post_meta( $post_id, '_wispaar_lead_goals', true ) ?: array();
    $desc     = get_post_meta( $post_id, '_wispaar_lead_desc', true );
    $status   = get_post_meta( $post_id, '_wispaar_lead_status', true ) ?: 'جدید';
    $notes    = get_post_meta( $post_id, '_wispaar_lead_notes', true );
    $clean_phone = preg_replace( '/[^0-9]/', '', $phone );
    ?>
    <div style="direction:rtl; font-family:Tahoma, sans-serif; line-height:1.7;">
        <div style="display:flex; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
            <div style="flex:1; min-width:260px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
                <h4 style="margin:0 0 10px 0; color:#1769FF; font-size:14px;">👤 اطلاعات مشتری:</h4>
                <div style="font-size:13px; line-height:2;">
                    <div><strong>نام:</strong> <?php echo esc_html( $name ); ?></div>
                    <div><strong>شماره تماس:</strong> <a href="tel:<?php echo esc_attr( $phone ); ?>" style="font-weight:bold;"><?php echo esc_html( $phone ); ?></a></div>
                    <div><strong>ایمیل:</strong> <a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ?: 'ثبت نشده' ); ?></a></div>
                    <div><strong>وب‌سایت فعلی:</strong> <?php echo $website ? '<a href="' . esc_url( $website ) . '" target="_blank">' . esc_html( $website ) . '</a>' : 'ثبت نشده'; ?></div>
                </div>
                <div style="margin-top:12px; display:flex; gap:8px;">
                    <?php if ( $phone ) : ?>
                        <a href="tel:<?php echo esc_attr( $phone ); ?>" class="button button-primary">📞 تماس مستقیم</a>
                        <a href="https://wa.me/<?php echo esc_attr( $clean_phone ); ?>" target="_blank" class="button" style="background:#25D366; color:#fff; border-color:#25D366;">💬 واتساپ</a>
                    <?php endif; ?>
                    <?php if ( $email ) : ?>
                        <a href="mailto:<?php echo esc_attr( $email ); ?>" class="button">✉️ ارسال ایمیل</a>
                    <?php endif; ?>
                </div>
            </div>

            <div style="flex:1; min-width:260px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
                <h4 style="margin:0 0 10px 0; color:#1769FF; font-size:14px;">📊 نیازمندی‌ها و برآورد:</h4>
                <div style="font-size:13px; line-height:2;">
                    <div><strong>پلتفرم فعلی:</strong> <?php echo esc_html( $platform ?: 'مشخص نشده' ); ?></div>
                    <div><strong>بازه بودجه:</strong> <span style="color:#059669; font-weight:bold;"><?php echo esc_html( $budget ?: 'تعیین نشده' ); ?></span></div>
                    <div><strong>زمان‌بندی مدنظر:</strong> <?php echo esc_html( $timeline ?: 'تعیین نشده' ); ?></div>
                    <div><strong>تاریخ ثبت:</strong> <?php echo get_the_date( 'Y/m/d H:i', $post ); ?></div>
                </div>
            </div>
        </div>

        <div style="margin-bottom:16px;">
            <h4 style="margin:0 0 6px 0; color:#334155; font-size:13px;">🛠️ خدمات درخواستی:</h4>
            <?php
            if ( ! empty( $services ) ) {
                foreach ( $services as $s ) {
                    echo '<span style="display:inline-block; background:#dbeafe; color:#1e40af; padding:3px 10px; border-radius:4px; font-size:12px; margin-left:6px; margin-bottom:4px;">✓ ' . esc_html( $s ) . '</span>';
                }
            } else {
                echo '<span style="color:#888;">خدمات عمومی</span>';
            }
            ?>
        </div>

        <div style="margin-bottom:16px;">
            <h4 style="margin:0 0 6px 0; color:#334155; font-size:13px;">🎯 اهداف کلیدی پروژه:</h4>
            <?php
            if ( ! empty( $goals ) ) {
                foreach ( $goals as $g ) {
                    echo '<span style="display:inline-block; background:#f1f5f9; color:#475569; padding:3px 10px; border-radius:4px; font-size:12px; margin-left:6px; margin-bottom:4px;">• ' . esc_html( $g ) . '</span>';
                }
            } else {
                echo '<span style="color:#888;">ثبت نشده</span>';
            }
            ?>
        </div>

        <div style="margin-bottom:16px;">
            <h4 style="margin:0 0 6px 0; color:#334155; font-size:13px;">📝 شرح و توضیحات کامل متقاضی:</h4>
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:12px; font-size:13px; line-height:1.8;">
                <?php echo nl2br( esc_html( $desc ?: 'توضیحات تکمیلی توسط مشتری ثبت نشده است.' ) ); ?>
            </div>
        </div>

        <hr style="margin:20px 0; border:0; border-top:1px solid #e2e8f0;" />

        <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:flex-start;">
            <div style="width:240px;">
                <label for="wispaar_lead_status" style="display:block; font-weight:bold; margin-bottom:6px;">وضعیت پیگیری بریف:</label>
                <select name="wispaar_lead_status" id="wispaar_lead_status" style="width:100%;">
                    <?php
                    $statuses = array( 'جدید', 'در حال بررسی', 'تماس برقرار شد', 'در حال تنظیم پروپوزال', 'قرارداد منعقد شد', 'بایگانی' );
                    foreach ( $statuses as $st ) {
                        echo '<option value="' . esc_attr( $st ) . '" ' . selected( $status, $st, false ) . '>' . esc_html( $st ) . '</option>';
                    }
                    ?>
                </select>
            </div>
            <div style="flex:1;">
                <label for="wispaar_lead_notes" style="display:block; font-weight:bold; margin-bottom:6px;">یادداشت‌های داخلی تیم مدیریت:</label>
                <textarea name="wispaar_lead_notes" id="wispaar_lead_notes" rows="2" style="width:100%;" placeholder="یادداشت‌های تماس، تاریخ جلسه یا جزئیات مذاکره با کارفرما..."><?php echo esc_textarea( $notes ); ?></textarea>
            </div>
        </div>
    </div>
    <?php
}

add_action( 'save_post_wispaar_brief', function( $post_id ) {
    if ( ! isset( $_POST['wispaar_brief_meta_nonce'] ) || ! wp_verify_nonce( $_POST['wispaar_brief_meta_nonce'], 'wispaar_brief_meta_nonce_action' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    if ( isset( $_POST['wispaar_lead_status'] ) ) {
        update_post_meta( $post_id, '_wispaar_lead_status', sanitize_text_field( $_POST['wispaar_lead_status'] ) );
    }
    if ( isset( $_POST['wispaar_lead_notes'] ) ) {
        update_post_meta( $post_id, '_wispaar_lead_notes', sanitize_textarea_field( $_POST['wispaar_lead_notes'] ) );
    }
} );

// C. Rich Meta Box for Projects (wispaar_project)
function wispaar_render_project_metabox( $post ) {
    wp_nonce_field( 'wispaar_project_meta_nonce_action', 'wispaar_project_meta_nonce' );
    $post_id   = $post->ID;
    $client    = get_post_meta( $post_id, '_wispaar_client', true );
    $title_en  = get_post_meta( $post_id, '_wispaar_title_en', true );
    $year      = get_post_meta( $post_id, '_wispaar_year', true ) ?: '۱۴۰۴';
    $ptype     = get_post_meta( $post_id, '_wispaar_ptype', true ) ?: 'وب‌سایت اختصاصی و سیستم هویت برند';
    $service   = get_post_meta( $post_id, '_wispaar_service', true );
    $demo_url  = get_post_meta( $post_id, '_wispaar_demo_url', true );
    $tech      = get_post_meta( $post_id, '_wispaar_tech', true );
    if ( is_array( $tech ) ) $tech = implode( '، ', $tech );
    $services  = get_post_meta( $post_id, '_wispaar_services', true );
    if ( is_array( $services ) ) $services = implode( '، ', $services );
    $kpi1_lbl  = get_post_meta( $post_id, '_wispaar_kpi1_lbl', true ) ?: 'شاخص عملکرد لایت‌هاوس';
    $kpi1_val  = get_post_meta( $post_id, '_wispaar_kpi1_val', true ) ?: '۹۹/۱۰۰';
    $kpi2_lbl  = get_post_meta( $post_id, '_wispaar_kpi2_lbl', true ) ?: 'نرخ تبدیل لندینگ';
    $kpi2_val  = get_post_meta( $post_id, '_wispaar_kpi2_val', true ) ?: '+۷۵٪';
    $challenge = get_post_meta( $post_id, '_wispaar_challenge', true );
    $solution  = get_post_meta( $post_id, '_wispaar_solution', true );
    $quote     = get_post_meta( $post_id, '_wispaar_quote', true );
    $featured  = get_post_meta( $post_id, '_wispaar_is_featured', true ) === '1';
    ?>
    <div style="direction:rtl; font-family:Tahoma, sans-serif; line-height:1.7;">
        <p style="color:#64748b; font-size:12px; margin-top:0;">این فیلدها مستقیماً توسط وب‌سایت هدلس ویسپار فراخوانی شده و در صفحات پروژه‌ها و جزئیات نمایش داده می‌شوند.</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">نام کارفرما / برند مشتری:</label>
                <input type="text" name="wispaar_client" value="<?php echo esc_attr( $client ); ?>" style="width:100%;" placeholder="مثال: هلدینگ آریا، شرکت سیناپس" />
            </div>
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">عنوان انگلیسی پروژه (English Title):</label>
                <input type="text" name="wispaar_title_en" value="<?php echo esc_attr( $title_en ); ?>" style="width:100%; direction:ltr;" placeholder="e.g. Arya Capital Holding" />
            </div>
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">خدمت مرتبط در سایت (ارتباط با صفحه خدمات):</label>
                <select name="wispaar_service" style="width:100%;">
                    <option value="">-- بدون انتخاب اختصاصی --</option>
                    <option value="web-design" <?php selected( $service, 'web-design' ); ?>>طراحی و توسعه وب‌سایت اختصاصی</option>
                    <option value="wordpress-development" <?php selected( $service, 'wordpress-development' ); ?>>مهندسی و توسعه پیشرفته وردپرس</option>
                    <option value="technical-seo" <?php selected( $service, 'technical-seo' ); ?>>سئو تکنیکال و معماری کلمات</option>
                    <option value="conversion-rate-landing" <?php selected( $service, 'conversion-rate-landing' ); ?>>طراحی لندینگ پیج و نرخ تبدیل</option>
                    <option value="speed-optimization" <?php selected( $service, 'speed-optimization' ); ?>>بهینه‌سازی سرعت و پرفورمنس</option>
                    <option value="it-consulting" <?php selected( $service, 'it-consulting' ); ?>>راهکارهای یکپارچه دیجیتال و IT</option>
                </select>
            </div>
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">سال اجرای پروژه:</label>
                <input type="text" name="wispaar_year" value="<?php echo esc_attr( $year ); ?>" style="width:100%;" placeholder="۱۴۰۴" />
            </div>
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">نوع یا فرمت پروژه:</label>
                <input type="text" name="wispaar_ptype" value="<?php echo esc_attr( $ptype ); ?>" style="width:100%;" placeholder="وب‌سایت اختصاصی و سیستم هویت برند" />
            </div>
            <div>
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">آدرس دمو یا وب‌سایت زنده (Live URL):</label>
                <input type="url" name="wispaar_demo_url" value="<?php echo esc_attr( $demo_url ); ?>" style="width:100%; direction:ltr;" placeholder="https://client-site.com" />
            </div>
        </div>

        <div style="margin-bottom:14px;">
            <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">پشته فناوری و تکنولوژی‌ها (با ویرگول جدا کنید):</label>
            <input type="text" name="wispaar_tech" value="<?php echo esc_attr( $tech ); ?>" style="width:100%; direction:ltr;" placeholder="React, TypeScript, Tailwind CSS, WordPress Headless, REST API" />
        </div>

        <div style="margin-bottom:14px;">
            <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">خدمات ارائه شده در پروژه (با ویرگول جدا کنید):</label>
            <input type="text" name="wispaar_services" value="<?php echo esc_attr( $services ); ?>" style="width:100%;" placeholder="طراحی اختصاصی UI/UX، توسعه وردپرس مهندسی‌شده، معماری کلمات" />
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
            <div style="background:#f1f5f9; padding:10px; border-radius:6px;">
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">شاخص کلیدی اول (KPI 1):</label>
                <input type="text" name="wispaar_kpi1_lbl" value="<?php echo esc_attr( $kpi1_lbl ); ?>" style="width:58%;" placeholder="عنوان شاخص" />
                <input type="text" name="wispaar_kpi1_val" value="<?php echo esc_attr( $kpi1_val ); ?>" style="width:38%; font-weight:bold; color:#0284c7;" placeholder="مقدار: ۹۹/۱۰۰" />
            </div>
            <div style="background:#f1f5f9; padding:10px; border-radius:6px;">
                <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">شاخص کلیدی دوم (KPI 2):</label>
                <input type="text" name="wispaar_kpi2_lbl" value="<?php echo esc_attr( $kpi2_lbl ); ?>" style="width:58%;" placeholder="عنوان شاخص" />
                <input type="text" name="wispaar_kpi2_val" value="<?php echo esc_attr( $kpi2_val ); ?>" style="width:38%; font-weight:bold; color:#16a34a;" placeholder="مقدار: +۸۵٪" />
            </div>
        </div>

        <div style="margin-bottom:14px;">
            <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">چالش و مسئله کارفرما (Challenge):</label>
            <textarea name="wispaar_challenge" rows="2" style="width:100%;" placeholder="کارفرما با چه چالشی روبرو بود و چه نیازی داشت..."><?php echo esc_textarea( $challenge ); ?></textarea>
        </div>

        <div style="margin-bottom:14px;">
            <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">راهکار و معماری پیاده‌سازی شده (Solution):</label>
            <textarea name="wispaar_solution" rows="2" style="width:100%;" placeholder="استودیو ویسپار چه معماری یا دیزاینی را پیاده‌سازی کرد..."><?php echo esc_textarea( $solution ); ?></textarea>
        </div>

        <div style="margin-bottom:14px;">
            <label style="display:block; font-weight:bold; font-size:12px; margin-bottom:4px;">نقل‌قول یا نظر کارفرما (Testimonial Quote):</label>
            <input type="text" name="wispaar_quote" value="<?php echo esc_attr( $quote ); ?>" style="width:100%;" placeholder="«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»" />
        </div>

        <div style="margin-top:10px;">
            <label style="cursor:pointer; font-weight:bold; font-size:13px; color:#1e293b;">
                <input type="checkbox" name="wispaar_is_featured" value="1" <?php checked( $featured, true ); ?> />
                ⭐ نمایش به عنوان پروژه ویژه و شاخص در صفحه اصلی سایت (Featured Project)
            </label>
        </div>
    </div>
    <?php
}

add_action( 'save_post_wispaar_project', function( $post_id ) {
    if ( ! isset( $_POST['wispaar_project_meta_nonce'] ) || ! wp_verify_nonce( $_POST['wispaar_project_meta_nonce'], 'wispaar_project_meta_nonce_action' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $fields = array(
        '_wispaar_client'       => 'wispaar_client',
        '_wispaar_title_en'     => 'wispaar_title_en',
        '_wispaar_year'         => 'wispaar_year',
        '_wispaar_ptype'        => 'wispaar_ptype',
        '_wispaar_service'      => 'wispaar_service',
        '_wispaar_demo_url'     => 'wispaar_demo_url',
        '_wispaar_kpi1_lbl'     => 'wispaar_kpi1_lbl',
        '_wispaar_kpi1_val'     => 'wispaar_kpi1_val',
        '_wispaar_kpi2_lbl'     => 'wispaar_kpi2_lbl',
        '_wispaar_kpi2_val'     => 'wispaar_kpi2_val',
        '_wispaar_challenge'    => 'wispaar_challenge',
        '_wispaar_solution'     => 'wispaar_solution',
        '_wispaar_quote'        => 'wispaar_quote',
    );

    foreach ( $fields as $meta_key => $post_key ) {
        if ( isset( $_POST[$post_key] ) ) {
            update_post_meta( $post_id, $meta_key, sanitize_text_field( $_POST[$post_key] ) );
        }
    }

    if ( isset( $_POST['wispaar_tech'] ) ) {
        $raw_tech = sanitize_text_field( $_POST['wispaar_tech'] );
        $tech_arr = array_filter( array_map( 'trim', explode( '،', str_replace( ',', '،', $raw_tech ) ) ) );
        update_post_meta( $post_id, '_wispaar_tech', $tech_arr );
    }

    if ( isset( $_POST['wispaar_services'] ) ) {
        $raw_srv = sanitize_text_field( $_POST['wispaar_services'] );
        $srv_arr = array_filter( array_map( 'trim', explode( '،', str_replace( ',', '،', $raw_srv ) ) ) );
        update_post_meta( $post_id, '_wispaar_services', $srv_arr );
    }

    update_post_meta( $post_id, '_wispaar_is_featured', ! empty( $_POST['wispaar_is_featured'] ) ? '1' : '0' );
} );

// D. WordPress Main Dashboard Widget for Recent Briefs
add_action( 'wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'wispaar_dashboard_leads_widget',
        '⚡ آخرین بریف‌های دریافتی از وب‌سایت ویسپار (WISPAAR Live Inquiries)',
        'wispaar_render_dashboard_leads_widget'
    );
} );

function wispaar_render_dashboard_leads_widget() {
    $recent_leads = get_posts( array(
        'post_type'      => 'wispaar_brief',
        'post_status'    => 'publish',
        'posts_per_page' => 5,
        'orderby'        => 'date',
        'order'          => 'DESC',
    ) );

    if ( empty( $recent_leads ) ) {
        echo '<p style="color:#64748b; font-size:13px; text-align:center; padding:12px;">هنوز هیچ بریفی از وب‌سایت ثبت نشده است. به محض ارسال فرم توسط کاربران، درخواست‌ها در اینجا نمایش می‌یابند.</p>';
        return;
    }

    echo '<div style="direction:rtl; font-family:Tahoma, sans-serif;">';
    echo '<table class="widefat fixed striped" style="border:none;">';
    echo '<thead><tr><th>نام متقاضی</th><th>تماس</th><th>خدمات</th><th>زمان ثبت</th><th>عملیات</th></tr></thead>';
    echo '<tbody>';
    foreach ( $recent_leads as $lead ) {
        $name     = get_post_meta( $lead->ID, '_wispaar_lead_name', true ) ?: $lead->post_title;
        $phone    = get_post_meta( $lead->ID, '_wispaar_lead_phone', true );
        $services = get_post_meta( $lead->ID, '_wispaar_lead_services', true );
        $srv_str  = is_array( $services ) && ! empty( $services ) ? implode( '، ', array_slice( $services, 0, 1 ) ) : 'عمومی';
        $edit_url = get_edit_post_link( $lead->ID );

        echo '<tr>';
        echo '<td style="font-weight:bold;"><a href="' . esc_url( $edit_url ) . '">' . esc_html( $name ) . '</a></td>';
        echo '<td><a href="tel:' . esc_attr( $phone ) . '" dir="ltr">' . esc_html( $phone ) . '</a></td>';
        echo '<td><span style="font-size:11px; color:#475569;">' . esc_html( $srv_str ) . '</span></td>';
        echo '<td style="font-size:11px; color:#94a3b8;">' . human_time_diff( get_post_time( 'U', false, $lead ), current_time( 'timestamp' ) ) . ' قبل</td>';
        echo '<td><a href="' . esc_url( $edit_url ) . '" class="button button-small">مشاهده بریف</a></td>';
        echo '</tr>';
    }
    echo '</tbody></table>';
    echo '<div style="margin-top:12px; text-align:left;"><a href="' . admin_url( 'edit.php?post_type=wispaar_brief' ) . '" class="button button-primary">مشاهده تمام بریف‌ها ←</a></div>';
    echo '</div>';
}
