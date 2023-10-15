<?php

/**
 * Plugin name: REST API Plugin
 * Author: Osama Madi
 * Author URI: https://github.com/osamagmm
 * Description: Plugin pour utiliser le REST API de wordpress
 * Version: 1.0.0
 */

// In your theme's functions.php or a custom plugin file, create a custom REST endpoint.
function custom_class_filter_endpoint($request)
{
    $session = $request->get_param('session');
    $type = $request->get_param('type');

    $args = array(
        'category_name' => 'pagecours', // Replace with the slug of your category
        'posts_per_page' => -1,
    );

    $meta_query = array('relation' => 'AND');

    if ($session) {
        $meta_query[] = array(
            'key'     => 'session',
            'value'   => $session,
            'compare' => '=',
            'type'    => 'NUMERIC',
        );
    }

    if ($type) {
        $meta_query[] = array(
            'key'     => 'type',
            'value'   => $type,
            'compare' => '=',
        );
    }

    if (!empty($meta_query)) {
        $args['meta_query'] = $meta_query;
    }

    $query = new WP_Query($args);

    $posts = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts[] = array(
                "id" => get_the_ID(),
                "title" => get_the_title(),
                "content" => get_the_content(),
            );
        }
        wp_reset_postdata();
    }
    // $JSONFormatPosts = (json_encode($posts));
    // var_dump($posts);
    // $jsonData = json_encode($posts);
    $jsonData = preg_replace('/[[:cntrl:]]/', '', json_encode($posts));
    // print_r($jsonData);

    return $jsonData;
}

add_action('rest_api_init', function () {
    register_rest_route('pagecours/v1', '/class-filter', array(
        'methods' => 'GET',
        'callback' => 'custom_class_filter_endpoint',
    ));
});


// Enqueue your CSS and JavaScript
function enqueue_custom_assets()
{
    // Enqueue your CSS
    wp_enqueue_style(
        'custom-plugin-style',
        plugin_dir_url(__FILE__) . 'style.css'
    );

    // Enqueue your JavaScript
    wp_enqueue_script(
        'custom-plugin-script',
        plugin_dir_url(__FILE__) . 'js/api-plugin.js',
        true);
}

// Hook into the 'wp_enqueue_scripts' action
add_action('wp_enqueue_scripts', 'enqueue_custom_assets');
