<?php
/**
 * Single Project Template
 * 
 * @package Wispaar
 */

get_header();

while ( have_posts() ) : the_post();
    $post_id   = get_the_ID();
    $client    = get_post_meta( $post_id, '_wispaar_client', true );
    $title_en  = get_post_meta( $post_id, '_wispaar_title_en', true );
    $year      = get_post_meta( $post_id, '_wispaar_year', true );
    $ptype     = get_post_meta( $post_id, '_wispaar_ptype', true );
    $challenge = get_post_meta( $post_id, '_wispaar_challenge', true );
    $solution  = get_post_meta( $post_id, '_wispaar_solution', true );
    $is_demo   = get_post_meta( $post_id, '_wispaar_is_demo', true ) === '1';
    $demo_url  = get_post_meta( $post_id, '_wispaar_demo_url', true );
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <div class="space-y-4">
        <div class="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
            <span>&lt;/&gt;</span>
            <span>CASE STUDY / <?php echo esc_html( $title_en ?: get_the_title() ); ?></span>
            <?php if ( $is_demo ) : ?>
                <span class="bg-[#03070D] border border-[#23364C] px-2 py-0.5 rounded text-[#00D9FF]">CONCEPT / DEMO</span>
            <?php endif; ?>
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold text-[#F5F8FC]"><?php the_title(); ?></h1>
    </div>

    <?php if ( has_post_thumbnail() ) : ?>
        <div class="rounded-2xl overflow-hidden border border-[#172638] max-h-[600px]">
            <?php the_post_thumbnail( 'full', array( 'class' => 'w-full object-cover' ) ); ?>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#06111F] border border-[#172638] rounded-xl p-6 text-xs">
        <div>
            <div class="text-[#536174] mb-1">کارفرما</div>
            <div class="text-[#F5F8FC] font-medium"><?php echo esc_html( $client ?: 'اختصاصی ویسپار' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">سال اجرا</div>
            <div class="text-[#F5F8FC] font-medium font-mono"><?php echo esc_html( $year ?: '۱۴۰۴' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">نوع اثر</div>
            <div class="text-[#F5F8FC] font-medium"><?php echo esc_html( $ptype ?: 'وب‌سایت اختصاصی' ); ?></div>
        </div>
        <div>
            <div class="text-[#536174] mb-1">پیش‌نمایش آنلاین</div>
            <div>
                <?php if ( $demo_url ) : ?>
                    <a href="<?php echo esc_url($demo_url); ?>" target="_blank" class="text-[#00D9FF] hover:underline">مشاهده دمو ←</a>
                <?php else : ?>
                    <span class="text-[#8C9BAD]">در دسترس در استیجینگ</span>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <h3 class="text-sm font-bold text-[#EF4444] uppercase tracking-wider">چالش اساسی پروژه</h3>
            <p class="text-sm text-[#8C9BAD] leading-relaxed"><?php echo esc_html( $challenge ); ?></p>
        </div>
        <div class="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <h3 class="text-sm font-bold text-[#00D9FF] uppercase tracking-wider">راهکار مهندسی ویسپار</h3>
            <p class="text-sm text-[#8C9BAD] leading-relaxed"><?php echo esc_html( $solution ); ?></p>
        </div>
    </div>

    <div class="prose prose-invert max-w-none text-base leading-relaxed text-[#C5D0DD]">
        <?php the_content(); ?>
    </div>
</div>

<?php
endwhile;

get_footer();
