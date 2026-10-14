<?php
/**
 * Main Index Template for WISPAAR
 * 
 * @package Wispaar
 */

get_header();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-right">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) : the_post();
            ?>
            <article class="wispaar-card p-8 mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-[#F5F8FC] mb-4">
                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </h1>
                <div class="text-sm text-[#8C9BAD] leading-relaxed">
                    <?php the_content(); ?>
                </div>
            </article>
            <?php
        endwhile;
    else :
        ?>
        <p class="text-[#8C9BAD]">محتوایی یافت نشد.</p>
        <?php
    endif;
    ?>
</div>

<?php
get_footer();
