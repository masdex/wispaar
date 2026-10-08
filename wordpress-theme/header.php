<!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-[#03070D] text-[#C5D0DD] antialiased selection:bg-[#1769FF]/30 selection:text-white' ); ?>>
<?php wp_body_open(); ?>

<?php
if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'header' ) ) {
    return;
}
?>

<header class="sticky top-0 z-50 bg-[#03070D]/95 border-b border-[#172638] backdrop-blur-md py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2.5">
            <span class="text-2xl font-bold tracking-tight text-[#F5F8FC]">WISPAAR</span>
            <span class="text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded font-mono">&lt;/&gt;</span>
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
                echo '<a href="' . esc_url( home_url( '/portfolio' ) ) . '">پروژه‌ها</a>';
                echo '<a href="' . esc_url( home_url( '/services' ) ) . '">خدمات</a>';
                echo '<a href="' . esc_url( home_url( '/about' ) ) . '">درباره ویسپار</a>';
                echo '<a href="' . esc_url( home_url( '/contact' ) ) . '">تماس</a>';
            }
            ?>
        </nav>

        <div class="flex items-center gap-3">
            <a href="<?php echo esc_url( home_url( '/start-project' ) ); ?>" class="px-4 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-lg transition-all shadow-sm">
                شروع یک پروژه ←
            </a>
        </div>
    </div>
</header>
