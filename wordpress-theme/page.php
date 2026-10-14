<?php
/**
 * Page Template for WISPAAR
 * Fully compatible with Elementor Full Width and standard editor
 * 
 * @package Wispaar
 */

get_header();

while ( have_posts() ) : the_post();
    ?>
    <div class="wispaar-page-content text-right">
        <?php the_content(); ?>
    </div>
    <?php
endwhile;

get_footer();
