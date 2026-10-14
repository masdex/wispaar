<?php
/**
 * Archive Template for Wispaar Projects (Portfolio)
 * 
 * @package Wispaar
 */

get_header();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-right">
    <div class="space-y-3">
        <span class="badge-code">&lt;PORTFOLIO ARCHIVE&gt;</span>
        <h1 class="text-3xl sm:text-5xl font-bold text-[#F5F8FC]">نمایشگاه جامع پروژه‌ها و آثار دیجیتال</h1>
        <p class="text-sm sm:text-base text-[#8C9BAD] max-w-2xl">
            مجموعه وب‌سایت‌های اختصاصی، مهندسی زیرساخت وردپرس و راهکارهای دیجیتال طراحی‌شده با تلفیق خرد استراتژیک و کدهای سبک.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                $id       = get_the_ID();
                $title_en = get_post_meta( $id, '_wispaar_title_en', true );
                $client   = get_post_meta( $id, '_wispaar_client', true );
                $year     = get_post_meta( $id, '_wispaar_year', true );
                $ptype    = get_post_meta( $id, '_wispaar_ptype', true );
                $is_demo  = get_post_meta( $id, '_wispaar_is_demo', true ) === '1';
                ?>
                <article class="project-card">
                    <div class="card-media">
                        <?php if ( $is_demo ) : ?>
                            <div style="position:absolute; top:12px; right:12px; z-index:10;">
                                <span class="badge-demo">CONCEPT / DEMO</span>
                            </div>
                        <?php endif; ?>
                        <a href="<?php the_permalink(); ?>">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                            <?php else : ?>
                                <div style="width:100%; height:240px; background:#0A1626; display:flex; align-items:center; justify-content:center; color:#536174; font-family:monospace; font-size:12px;">
                                    &lt;PORTFOLIO IMAGE&gt;
                                </div>
                            <?php endif; ?>
                        </a>
                    </div>

                    <div class="card-content">
                        <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#8C9BAD; margin-bottom:8px;">
                            <span><?php echo esc_html( $client ?: 'اختصاصی ویسپار' ); ?></span>
                            <span>·</span>
                            <span><?php echo esc_html( $ptype ?: 'وب‌سایت اختصاصی' ); ?></span>
                            <span>·</span>
                            <span><?php echo esc_html( $year ?: '۱۴۰۴' ); ?></span>
                        </div>

                        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:8px;">
                            <a href="<?php the_permalink(); ?>" style="color:#F5F8FC;">
                                <?php the_title(); ?>
                                <?php if ( $title_en ) : ?>
                                    <span style="display:block; font-size:12px; font-weight:normal; color:#8C9BAD; direction:ltr; text-align:right;">
                                        <?php echo esc_html( $title_en ); ?>
                                    </span>
                                <?php endif; ?>
                            </a>
                        </h3>

                        <div style="font-size:13px; color:#8C9BAD; margin-bottom:16px;">
                            <?php the_excerpt(); ?>
                        </div>

                        <div style="padding-top:12px; border-top:1px solid #172638;">
                            <a href="<?php the_permalink(); ?>" style="color:#00D9FF; font-size:12px; font-weight:600;">
                                مطالعه کامل مطالعه موردی ←
                            </a>
                        </div>
                    </div>
                </article>
                <?php
            endwhile;
        else :
            ?>
            <p class="text-[#8C9BAD]">هیچ پروژه‌ای در این بخش یافت نشد.</p>
            <?php
        endif;
        ?>
    </div>
</div>

<?php
get_footer();
