<?php
/**
 * WISPAAR Headless CMS REST API Core
 * 
 * Provides complete endpoints for decoupled React frontends,
 * including CORS headers, Health check, Projects CPT, Articles/Posts,
 * Briefs/Leads, and Auto-seeding.
 * 
 * @package Wispaar
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * 1. Safe, compliant CORS origin resolver
 */
function wispaar_resolve_cors_origin() {
    $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? esc_url_raw( wp_unslash( $_SERVER['HTTP_ORIGIN'] ) ) : '';
    if ( empty( $origin ) ) {
        return '*';
    }

    $parsed = parse_url( $origin );
    $host   = isset( $parsed['host'] ) ? strtolower( $parsed['host'] ) : '';

    // Permitted local development hosts and ports, plus production domain
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

    // IMPORTANT: Never combine credentials with wildcard '*' origin per browser specification
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
 * Authorization Helper for protected write actions
 */
function wispaar_check_rest_permissions( $request, $capability = 'edit_posts' ) {
    if ( current_user_can( $capability ) ) {
        return true;
    }

    // Support application password / basic auth headers if provided
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

    // In local development environment, permit write operations if explicitly configured
    if ( defined( 'WP_ENVIRONMENT_TYPE' ) && 'local' === WP_ENVIRONMENT_TYPE ) {
        return true;
    }

    // Return detailed WP_Error for non-authenticated clients
    return new WP_Error(
        'rest_forbidden',
        'انجام این عملیات نیازمند مجوز معتبر مدیریت یا Application Password وردپرس است.',
        array( 'status' => rest_authorization_required_code() )
    );
}

/**
 * 2. Register REST Routes under wispaar/v1
 */
add_action( 'rest_api_init', function () {
    $namespace = 'wispaar/v1';

    // Health & Diagnostic Endpoint
    register_rest_route( $namespace, '/health', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_health_check',
        'permission_callback' => '__return_true',
    ) );

    // Projects (Headless Portfolio)
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
                return wispaar_check_rest_permissions( $request, 'edit_posts' );
            },
        ),
    ) );

    register_rest_route( $namespace, '/projects/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_single_project',
        'permission_callback' => '__return_true',
    ) );

    // Articles / Blog (Headless Journal)
    register_rest_route( $namespace, '/articles', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_articles',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( $namespace, '/articles/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_single_article',
        'permission_callback' => '__return_true',
    ) );

    // Project Brief Submission (Public Lead Gen Form)
    register_rest_route( $namespace, '/brief', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_submit_brief',
        'permission_callback' => '__return_true',
    ) );

    // Leads / Briefs Query (Protected Admin Endpoint)
    register_rest_route( $namespace, '/leads', array(
        'methods'             => 'GET',
        'callback'            => 'wispaar_rest_get_leads',
        'permission_callback' => function( $request ) {
            return wispaar_check_rest_permissions( $request, 'edit_posts' );
        },
    ) );

    // Database Seeder (Protected Admin Action)
    register_rest_route( $namespace, '/seed', array(
        'methods'             => 'POST',
        'callback'            => 'wispaar_rest_seed_database',
        'permission_callback' => function( $request ) {
            return wispaar_check_rest_permissions( $request, 'manage_options' );
        },
    ) );
} );

/**
 * 3. Health Check
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
 * 4. Format Project Post Object to Match React Domain Model
 */
function wispaar_format_project( $post ) {
    $post_id   = $post->ID;
    $thumbnail = get_the_post_thumbnail_url( $post_id, 'full' );

    $industries = wp_get_post_terms( $post_id, 'project_industry', array( 'fields' => 'names' ) );
    $industry   = ! empty( $industries ) && ! is_wp_error( $industries ) ? $industries[0] : ( get_post_meta( $post_id, '_wispaar_industry', true ) ?: 'فین‌تک و خدمات مالی' );

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

    return array(
        'id'                    => (string) $post_id,
        'slug'                  => $post->post_name,
        'title'                 => $post->post_title,
        'titleEn'               => get_post_meta( $post_id, '_wispaar_title_en', true ) ?: $post->post_name,
        'client'                => get_post_meta( $post_id, '_wispaar_client', true ) ?: 'سفارشی ویسپار',
        'industry'              => $industry,
        'services'              => $services,
        'technology'            => $technology,
        'year'                  => get_post_meta( $post_id, '_wispaar_year', true ) ?: '۱۴۰۴',
        'projectType'           => get_post_meta( $post_id, '_wispaar_ptype', true ) ?: 'وب‌سایت اختصاصی و سیستم هویت برند',
        'featured_image'        => $thumbnail ?: null,
        'coverImage'            => $thumbnail ?: '/images/fintech.jpg',
        'isDemo'                => (bool) get_post_meta( $post_id, '_wispaar_is_demo', true ),
        'editorialQuote'        => get_post_meta( $post_id, '_wispaar_quote', true ) ?: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
        'challenge'             => get_post_meta( $post_id, '_wispaar_challenge', true ) ?: wp_trim_words( $post->post_excerpt ?: $post->post_content, 35 ),
        'solution'              => get_post_meta( $post_id, '_wispaar_solution', true ) ?: 'پیاده‌سازی دیزاین سیستم مینیمال، بهینه‌سازی کدهای فرانت‌اند و معماری دیتای سریع.',
        'results'               => array(
            array(
                'label'  => $kpi1_lbl,
                'value'  => $kpi1_val,
                'detail' => 'شاخص عملکرد',
            ),
            array(
                'label'  => $kpi2_lbl,
                'value'  => $kpi2_val,
                'detail' => 'شاخص رشد',
            ),
        ),
        'websiteUrlPlaceholder' => get_post_meta( $post_id, '_wispaar_demo_url', true ) ?: 'https://demo.wispaar.com',
        'link'                  => get_permalink( $post_id ),
        'date'                  => get_post_time( 'c', true, $post_id ),
        'tags'                  => array( $industry, 'وردپرس هدلس' ),
        'source'                => 'wordpress',
    );
}

/**
 * 5. GET /projects
 */
function wispaar_rest_get_projects( WP_REST_Request $request ) {
    $page     = max( 1, (int) $request->get_param( 'page' ) );
    $per_page = min( 100, max( 1, (int) ( $request->get_param( 'per_page' ) ?: 20 ) ) );

    $args = array(
        'post_type'      => 'wispaar_project',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $query = new WP_Query( $args );
    $projects = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $projects[] = wispaar_format_project( $query->post );
        }
        wp_reset_postdata();
    }

    $total       = (int) $query->found_posts;
    $total_pages = (int) $query->max_num_pages;

    // Returns verified items structure with compatibility aliases
    return rest_ensure_response( array(
        'items'       => $projects,
        'total'       => $total,
        'total_pages' => $total_pages ?: 1,
        'page'        => $page,
        // Compatibility aliases
        'success'     => true,
        'count'       => count( $projects ),
        'projects'    => $projects,
    ) );
}

/**
 * 6. GET /projects/{slug}
 */
function wispaar_rest_get_single_project( WP_REST_Request $request ) {
    $slug = sanitize_title( $request->get_param( 'slug' ) );

    $args = array(
        'name'        => $slug,
        'post_type'   => 'wispaar_project',
        'post_status' => 'publish',
        'numberposts' => 1,
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
 * 7. POST /projects (Create Project from Frontend)
 */
function wispaar_rest_create_project( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $title     = sanitize_text_field( $params['title'] ?? '' );
    $title_en  = sanitize_text_field( $params['titleEn'] ?? '' );
    $client    = sanitize_text_field( $params['client'] ?? '' );
    $industry  = sanitize_text_field( $params['industry'] ?? 'فین‌تک و خدمات مالی' );
    $year      = sanitize_text_field( $params['year'] ?? '۱۴۰۴' );
    $ptype     = sanitize_text_field( $params['projectType'] ?? 'وب‌سایت اختصاصی' );
    $challenge = sanitize_textarea_field( $params['challenge'] ?? '' );
    $solution  = sanitize_textarea_field( $params['solution'] ?? '' );
    $kpi1_val  = sanitize_text_field( $params['kpi1Value'] ?? '۹۹/۱۰۰' );
    $kpi1_lbl  = sanitize_text_field( $params['kpi1Label'] ?? 'شاخص عملکرد لایت‌هاوس' );
    $kpi2_val  = sanitize_text_field( $params['kpi2Value'] ?? '+۷۵٪' );
    $kpi2_lbl  = sanitize_text_field( $params['kpi2Label'] ?? 'نرخ تبدیل' );

    if ( empty( $title ) ) {
        return new WP_Error( 'missing_title', 'عنوان پروژه الزامی است.', array( 'status' => 400 ) );
    }

    $slug = sanitize_title( $title_en ?: $title );
    if ( empty( $slug ) ) {
        $slug = 'project-' . time();
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_type'    => 'wispaar_project',
        'post_status'  => 'publish',
        'post_content' => $solution,
        'post_excerpt' => $challenge,
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'create_failed', 'خطا در ایجاد پروژه.', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, '_wispaar_title_en', $title_en );
    update_post_meta( $post_id, '_wispaar_client', $client );
    update_post_meta( $post_id, '_wispaar_industry', $industry );
    update_post_meta( $post_id, '_wispaar_year', $year );
    update_post_meta( $post_id, '_wispaar_ptype', $ptype );
    update_post_meta( $post_id, '_wispaar_challenge', $challenge );
    update_post_meta( $post_id, '_wispaar_solution', $solution );
    update_post_meta( $post_id, '_wispaar_kpi1_val', $kpi1_val );
    update_post_meta( $post_id, '_wispaar_kpi1_lbl', $kpi1_lbl );
    update_post_meta( $post_id, '_wispaar_kpi2_val', $kpi2_val );
    update_post_meta( $post_id, '_wispaar_kpi2_lbl', $kpi2_lbl );
    update_post_meta( $post_id, '_wispaar_is_demo', 1 );

    if ( taxonomy_exists( 'project_industry' ) && ! empty( $industry ) ) {
        wp_set_object_terms( $post_id, $industry, 'project_industry' );
    }

    $created_post = get_post( $post_id );

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'پروژه با موفقیت در وردپرس هدلس ایجاد شد.',
        'project' => wispaar_format_project( $created_post ),
        'id'      => $post_id,
    ) );
}

/**
 * 8. Format Article Post Object to Match React Domain Model
 */
function wispaar_format_article( $post ) {
    $post_id    = $post->ID;
    $categories = wp_get_post_categories( $post_id, array( 'fields' => 'names' ) );
    $category   = ! empty( $categories ) ? $categories[0] : 'طراحی وب';

    $word_count = str_word_count( strip_tags( $post->post_content ) );
    $minutes    = max( 2, (int) ceil( $word_count / 180 ) );
    $read_time  = $minutes . ' دقیقه مطالعه';

    $post_tags = wp_get_post_tags( $post_id, array( 'fields' => 'names' ) );

    return array(
        'id'            => (string) $post_id,
        'slug'          => $post->post_name,
        'title'         => $post->post_title,
        'category'      => $category,
        'readTime'      => $read_time,
        'publishedDate' => get_the_date( 'j F Y', $post ),
        'author'        => array(
            'name' => get_the_author_meta( 'display_name', $post->post_author ) ?: 'تیم فنی ویسپار',
            'role' => 'استودیو ویسپار',
        ),
        'excerpt'       => $post->post_excerpt ?: wp_trim_words( strip_tags( $post->post_content ), 30 ),
        'contentParagraphs' => array(
            array(
                'subheading' => 'خلاصه و تحلیل تخصصی',
                'text'       => strip_tags( $post->post_content ),
            )
        ),
        'tags'          => ! empty( $post_tags ) ? $post_tags : array( 'وردپرس هدلس', 'سئو', 'توسعه اختصاصی' ),
        'link'          => get_permalink( $post_id ),
        'date'          => get_post_time( 'c', true, $post_id ),
        'source'        => 'wordpress',
    );
}

/**
 * 9. GET /articles
 */
function wispaar_rest_get_articles( WP_REST_Request $request ) {
    $page     = max( 1, (int) $request->get_param( 'page' ) );
    $per_page = min( 100, max( 1, (int) ( $request->get_param( 'per_page' ) ?: 20 ) ) );

    $args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    $query = new WP_Query( $args );
    $articles = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $articles[] = wispaar_format_article( $query->post );
        }
        wp_reset_postdata();
    }

    $total       = (int) $query->found_posts;
    $total_pages = (int) $query->max_num_pages;

    return rest_ensure_response( array(
        'items'       => $articles,
        'total'       => $total,
        'total_pages' => $total_pages ?: 1,
        'page'        => $page,
        'success'     => true,
        'count'       => count( $articles ),
        'articles'    => $articles,
    ) );
}

/**
 * 10. GET /articles/{slug}
 */
function wispaar_rest_get_single_article( WP_REST_Request $request ) {
    $slug = sanitize_title( $request->get_param( 'slug' ) );

    $args = array(
        'name'        => $slug,
        'post_type'   => 'post',
        'post_status' => 'publish',
        'numberposts' => 1,
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
 * 11. POST /brief (Submit Project Brief / Lead)
 */
function wispaar_rest_submit_brief( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    $name        = sanitize_text_field( $params['name'] ?? '' );
    $phone       = sanitize_text_field( $params['phone'] ?? '' );
    $email       = sanitize_email( $params['email'] ?? '' );
    $honeypot    = sanitize_text_field( $params['_hp'] ?? ( $params['company_trap'] ?? '' ) );

    // Honeypot trap: if filled by a spam bot, silently return fake success
    if ( ! empty( $honeypot ) ) {
        return rest_ensure_response( array(
            'success' => true,
            'message' => 'درخواست شما ثبت شد.',
        ) );
    }

    // IP-based rate limiting using transients: max 5 submissions per 10 minutes
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
    }

    $post_id = wp_insert_post( array(
        'post_title'   => $name . ' — ' . date_i18n( 'Y/m/d H:i' ),
        'post_type'    => 'wispaar_brief',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'save_failed', 'خطا در ثبت بریف در وردپرس.', array( 'status' => 500 ) );
    }

    update_post_meta( $post_id, '_wispaar_lead_phone', $phone );
    update_post_meta( $post_id, '_wispaar_lead_email', $email );
    update_post_meta( $post_id, '_wispaar_lead_services', $services );
    update_post_meta( $post_id, '_wispaar_lead_goals', $goals );
    update_post_meta( $post_id, '_wispaar_lead_platform', $platform );
    update_post_meta( $post_id, '_wispaar_lead_website', $website );
    update_post_meta( $post_id, '_wispaar_lead_budget', $budget );
    update_post_meta( $post_id, '_wispaar_lead_timeline', $timeline );
    update_post_meta( $post_id, '_wispaar_lead_desc', $description );
    update_post_meta( $post_id, '_wispaar_lead_status', 'new' );

    $admin_email = get_option( 'admin_email' );
    if ( $admin_email ) {
        @wp_mail(
            $admin_email,
            'درخواست پروژه جدید: ' . $name,
            "یک بریف جدید از فرانت‌اند هدلس ویسپار دریافت شد:\nنام: $name\nشماره: $phone\nایمیل: $email\nبودجه: $budget\nشرح: $description"
        );
    }

    return rest_ensure_response( array(
        'success' => true,
        'message' => 'بریف پروژه شما با موفقیت در سیستم وردپرس هدلس ویسپار ثبت شد.',
        'lead_id' => $post_id,
        'id'      => $post_id,
    ) );
}

/**
 * 12. GET /leads (Protected Admin Endpoint)
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
            'id'          => 'wp-' . $p->ID,
            'name'        => explode( ' — ', $p->post_title )[0],
            'phone'       => get_post_meta( $p->ID, '_wispaar_lead_phone', true ),
            'email'       => get_post_meta( $p->ID, '_wispaar_lead_email', true ),
            'services'    => get_post_meta( $p->ID, '_wispaar_lead_services', true ) ?: array(),
            'goals'       => get_post_meta( $p->ID, '_wispaar_lead_goals', true ) ?: array(),
            'platform'    => get_post_meta( $p->ID, '_wispaar_lead_platform', true ) ?: '',
            'website'     => get_post_meta( $p->ID, '_wispaar_lead_website', true ) ?: '',
            'budget'      => get_post_meta( $p->ID, '_wispaar_lead_budget', true ),
            'timeline'    => get_post_meta( $p->ID, '_wispaar_lead_timeline', true ),
            'description' => get_post_meta( $p->ID, '_wispaar_lead_desc', true ),
            'status'      => get_post_meta( $p->ID, '_wispaar_lead_status', true ) ?: 'new',
            'createdAt'   => get_the_date( 'Y/m/d H:i', $p ),
        );
    }

    return rest_ensure_response( array(
        'items'   => $leads,
        'total'   => count( $leads ),
        'success' => true,
        'leads'   => $leads,
    ) );
}

/**
 * 13. POST /seed (Idempotent Database Seeding)
 */
function wispaar_rest_seed_database() {
    $seeded_count  = 0;
    $skipped_count = 0;

    $default_projects = array(
        array(
            'slug'      => 'arya-capital',
            'title'     => 'آریا کاپیتال',
            'title_en'  => 'Arya Capital',
            'client'    => 'هلدینگ مدیریت سرمایه آریا',
            'industry'  => 'فین‌تک و خدمات مالی',
            'year'      => '۱۴۰۴',
            'ptype'     => 'وب‌سایت اختصاصی و سیستم تحلیلی مالی',
            'challenge' => 'نیاز به سامانه‌ای مدرن، بدون پیچیدگی‌های گیج‌کننده و با سرعت بارگذاری زیر ۱ ثانیه که بتواند گزارش‌های مالی تحلیلی را در قالبی شیک و خوانا به مخاطبان نخبه تجاری عرضه کند.',
            'solution'  => 'طراحی بر مبنای تایپوگرافی مهندسی‌شده، پالت رنگی تیره لوکس، معماری بدون سربار جاوااسکریپت، و کشینگ پیشرفته در سمت سرور.',
            'kpi1_lbl'  => 'شاخص عملکرد لایت‌هاوس',
            'kpi1_val'  => '۹۹/۱۰۰',
            'kpi2_lbl'  => 'سرعت بارگذاری اولیه (LCP)',
            'kpi2_val'  => '۰.۸ ثانیه',
        ),
        array(
            'slug'      => 'genome-labs',
            'title'     => 'ژنوم لبز',
            'title_en'  => 'Genome Labs',
            'client'    => 'مرکز پژوهش و آزمایشگاه ژنتیک ژنوم',
            'industry'  => 'علوم زیستی و پزشکی',
            'year'      => '۱۴۰۳',
            'ptype'     => 'پلتفرم جامع کاتالوگ تست‌ها و نتایج بالینی',
            'challenge' => 'ارائه بیش از ۳۰۰ نوع تست ژنتیک و مقالات بالینی سنگین در قالب یک ساختار ساده، بدون آنکه کاربر در شلوغی دسته‌بندی‌ها سردرگم شود.',
            'solution'  => 'پیاده‌سازی جستجوی لحظه‌ای با ساختار سلسله‌مراتبی و سیستم نوبت‌دهی آنلاین با بیشترین نرخ تکمیل موفق.',
            'kpi1_lbl'  => 'سرعت دسترسی به نتایج',
            'kpi1_val'  => '-۷۵٪',
            'kpi2_lbl'  => 'رضایت جامعه پزشکی',
            'kpi2_val'  => '۹۸٪',
        ),
        array(
            'slug'      => 'hoor-atelier',
            'title'     => 'آتلیه معماری هور',
            'title_en'  => 'Hoor Atelier',
            'client'    => 'دفتر معماری و طراحی داخلی هور',
            'industry'  => 'معماری و دکوراسیون لوکس',
            'year'      => '۱۴۰۴',
            'ptype'     => 'پورتفولیو مینیمال با گالری‌های فرمت‌بالا',
            'challenge' => 'نمایش تصاویر پروژه‌های ساختمانی با رزولوشن بسیار بالا بدون افت وحشتناک سرعت بارگذاری در اینترنت موبایل.',
            'solution'  => 'معماری مدرن رندرینگ تصاویر در ابعاد دقیق، بارگذاری تدریجی هوشمند و سیستم تمپلیت اختصاصی.',
            'kpi1_lbl'  => 'حجم صفحه اول',
            'kpi1_val'  => '۸۲۰ کیلوبایت',
            'kpi2_lbl'  => 'شاخص وفاداری بصری',
            'kpi2_val'  => '۱۰۰٪',
        ),
        array(
            'slug'      => 'synapse-cloud',
            'title'     => 'سیناپس کلود',
            'title_en'  => 'Synapse Cloud',
            'client'    => 'ارائه‌دهنده راهکارهای ابری سازمانی سیناپس',
            'industry'  => 'زیرساخت ابری و IT',
            'year'      => '۱۴۰۳',
            'ptype'     => 'لندینگ پیج‌های پرتبدیل B2B و ماشین حساب هزینه ابری',
            'challenge' => 'مشتریان سازمانی در نگاه اول ارزش فنی زیرساخت ابری را متوجه نمی‌شدند و نرخ پرش لندینگ پیج بالا بود.',
            'solution'  => 'بازطراحی معماری محتوا با تمرکز بر شفافیت ارزش پیشنهادی، ماشین‌حساب تعاملی برآورد هزینه سرور و بهینه‌سازی فرم جذب سرنخ.',
            'kpi1_lbl'  => 'نرخ تبدیل لندینگ',
            'kpi1_val'  => '۴.۸٪',
            'kpi2_lbl'  => 'کاهش زمان جذب مشتری',
            'kpi2_val'  => '۳.۲ روز',
        ),
    );

    foreach ( $default_projects as $proj ) {
        $existing = get_page_by_path( $proj['slug'], OBJECT, 'wispaar_project' );
        if ( ! $existing ) {
            $post_id = wp_insert_post( array(
                'post_title'   => $proj['title'],
                'post_name'    => $proj['slug'],
                'post_type'    => 'wispaar_project',
                'post_status'  => 'publish',
                'post_content' => $proj['solution'],
                'post_excerpt' => $proj['challenge'],
            ) );

            if ( ! is_wp_error( $post_id ) ) {
                update_post_meta( $post_id, '_wispaar_title_en', $proj['title_en'] );
                update_post_meta( $post_id, '_wispaar_client', $proj['client'] );
                update_post_meta( $post_id, '_wispaar_industry', $proj['industry'] );
                update_post_meta( $post_id, '_wispaar_year', $proj['year'] );
                update_post_meta( $post_id, '_wispaar_ptype', $proj['ptype'] );
                update_post_meta( $post_id, '_wispaar_challenge', $proj['challenge'] );
                update_post_meta( $post_id, '_wispaar_solution', $proj['solution'] );
                update_post_meta( $post_id, '_wispaar_kpi1_lbl', $proj['kpi1_lbl'] );
                update_post_meta( $post_id, '_wispaar_kpi1_val', $proj['kpi1_val'] );
                update_post_meta( $post_id, '_wispaar_kpi2_lbl', $proj['kpi2_lbl'] );
                update_post_meta( $post_id, '_wispaar_kpi2_val', $proj['kpi2_val'] );
                update_post_meta( $post_id, '_wispaar_is_demo', 1 );

                if ( taxonomy_exists( 'project_industry' ) ) {
                    wp_set_object_terms( $post_id, $proj['industry'], 'project_industry' );
                }

                $seeded_count++;
            }
        } else {
            $skipped_count++;
        }
    }

    return rest_ensure_response( array(
        'success'       => true,
        'message'       => "درون‌ریزی تکمیل شد: $seeded_count پروژه ثبت گردید، $skipped_count پروژه از قبل موجود بود.",
        'seeded_count'  => $seeded_count,
        'skipped_count' => $skipped_count,
    ) );
}
