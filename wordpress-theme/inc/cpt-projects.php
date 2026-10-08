<?php
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
        'show_in_rest'       => true,
    );

    register_post_type( 'wispaar_project', $args );

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
}
add_action( 'init', 'wispaar_register_project_cpt' );

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
    </p>

    <p>
        <label><strong>آدرس پیش‌نمایش سایت (Demo URL):</strong></label><br>
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
