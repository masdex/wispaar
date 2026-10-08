<?php
if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( 'footer' ) ) {
    wp_footer();
    return;
}
?>

<footer class="bg-[#02050A] border-t border-[#172638] text-[#8C9BAD] pt-16 pb-12 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-[#172638]/70">
            <div class="md:col-span-2 space-y-4">
                <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold tracking-tight text-[#F5F8FC]">WISPAAR</span>
                    <span class="text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded font-mono">&lt;/&gt;</span>
                </div>
                <div class="text-sm text-[#00D9FF]">آفرینش با خرد — Wisdom + Technology</div>
                <p class="text-sm text-[#8C9BAD] max-w-sm leading-relaxed">
                    استودیو فناوری و طراحی دیجیتال ویسپار. طراحی وب‌سایت‌های اختصاصی، مهندسی پیشرفته وردپرس و سئو تکنیکال.
                </p>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-4">پروژه‌ها و خدمات</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="<?php echo esc_url( home_url( '/portfolio' ) ); ?>" class="hover:text-white">منتخب پروژه‌ها</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/services' ) ); ?>" class="hover:text-white">طراحی اختصاصی وب</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/seo' ) ); ?>" class="hover:text-white">مطالعات موردی سئو</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-4">استودیو ویسپار</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="hover:text-white">درباره و مانیفست</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/start-project' ) ); ?>" class="text-[#00D9FF]">ثبت بریف پروژه</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/contact' ) ); ?>" class="hover:text-white">تماس مستقیم</a></li>
                </ul>
            </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>تمام حقوق محفوظ است © <?php echo date('Y'); ?> WISPAAR. قدرت گرفته از هسته مهندسی وردپرس.</div>
            <div class="font-mono text-[#00D9FF]">&lt;/&gt; Creation with Wisdom</div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
