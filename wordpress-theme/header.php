<!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'wispaar-dark-theme wispaar-body-theme bg-[#03070D] text-[#C5D0DD] antialiased' ); ?>>
<?php wp_body_open(); ?>

<?php
if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'header' ) ) {
    return;
}
?>

<header class="wispaar-header">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="wispaar-logo">
            <span>WISPAAR</span>
            <span class="badge-code">&lt;/&gt;</span>
        </a>

        <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-[#C5D0DD]">
            <?php
            if ( has_nav_menu( 'primary-menu' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary-menu',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'fallback_cb'    => false,
                ) );
            } else {
                echo '<a href="' . esc_url( home_url( '/' ) ) . '" class="text-[#00D9FF]">خانه</a>';
                echo '<a href="' . esc_url( home_url( '/#portfolio' ) ) . '">پروژه‌ها</a>';
                echo '<a href="' . esc_url( home_url( '/services' ) ) . '">خدمات</a>';
                echo '<a href="' . esc_url( home_url( '/about' ) ) . '">درباره ویسپار</a>';
                echo '<a href="' . esc_url( home_url( '/contact' ) ) . '">تماس</a>';
            }
            ?>
        </nav>

        <div class="flex items-center gap-3">
            <a href="<?php echo esc_url( home_url( '/#wispaar-brief-section' ) ); ?>" class="btn-primary" style="padding:0.5rem 1rem; font-size:0.75rem;">
                شروع یک پروژه ←
            </a>

            <button id="wispaar-mobile-menu-toggle" class="lg:hidden p-2 text-[#C5D0DD] hover:text-white rounded-lg" style="background:#0A1626; border:1px solid #172638; cursor:pointer;" aria-label="منو">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="wispaar-mobile-drawer" style="display:none; background:#06111F; border-top:1px solid #172638; padding:1.5rem; margin-top:0.75rem;">
        <div style="display:flex; flex-direction:column; gap:1rem; text-align:right;">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" style="color:#00D9FF; font-weight:600;">خانه</a>
            <a href="<?php echo esc_url( home_url( '/#portfolio' ) ); ?>">پروژه‌ها</a>
            <a href="<?php echo esc_url( home_url( '/services' ) ); ?>">خدمات</a>
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>">درباره ویسپار</a>
            <a href="<?php echo esc_url( home_url( '/contact' ) ); ?>">تماس</a>
            <a href="<?php echo esc_url( home_url( '/#wispaar-brief-section' ) ); ?>" class="btn-primary" style="text-align:center; justify-content:center; margin-top:0.5rem;">ثبت بریف پروژه</a>
        </div>
    </div>
</header>
