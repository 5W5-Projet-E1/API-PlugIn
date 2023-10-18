<?php

/**
 * Plugin name: Plugin REST API
 * Author: Osama Madi
 * Author URI: https://github.com/osamagmm
 * Description: Plugin pour utiliser le point de terminaison de l'API REST personnalisé créé à l'aide de cette fonction vous permet d'interroger et de filtrer les publications dans une catégorie spécifique en fonction de divers paramètres, ce qui le rend utile pour créer des requêtes de contenu personnalisées sur votre site WordPress.
 * Version: 1.0.0
 */


/**
 * fonction de rappel personnalisée utilisée dans WordPress pour créer
 * un point de terminaison d'API REST personnalisé.
 */

function filtre_cours_endpoint($request)
{
    // Obtenir les paramètres de requête 'session' et 'type'
    $session = $request->get_param('session');
    $type = $request->get_param('type');
    $page = $request->get_param('page'); // Get the current page number
    $posts_per_page = $request->get_param('posts_per_page'); // Get the number of posts per page

    // Set default values for page and posts_per_page
    $page = isset($page) ? $page : 1;
    $posts_per_page = isset($posts_per_page) ? $posts_per_page : 5; // Set your desired posts per page value

    // Calculate the offset for pagination
    $offset = ($page - 1) * $posts_per_page;

    // Define the arguments for the WP_Query
    $args = array(
        'category_name' => 'pagecours', // Slug of the category
        'posts_per_page' => $posts_per_page,
        'paged' => $page, // Set the current page
        'offset' => $offset, // Set the offset for pagination
    );

    // Initialize the metadata query
    $meta_query = array('relation' => 'AND');

    // If the 'session' parameter is set, add a metadata clause for 'session'
    if ($session) {
        $meta_query[] = array(
            'key' => 'session',
            'value' => $session,
            'compare' => '=',
            'type' => 'NUMERIC',
        );
    }

    // If the 'type' parameter is set, add a metadata clause for 'type'
    if ($type) {
        $meta_query[] = array(
            'key' => 'type',
            'value' => $type,
            'compare' => '=',
        );
    }

    // If metadata clauses are defined, add them to the query arguments
    if (!empty($meta_query)) {
        $args['meta_query'] = $meta_query;
    }


    // Execute the WP_Query
    $query = new WP_Query($args);

    // Array to store the posts
    $posts = array();

    // Iterate through the found posts
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

    // Convert the array to JSON while removing control characters
    $jsonData = preg_replace('/[[:cntrl:]]/', '', json_encode($posts));
    
    // Include pagination information in the response
    $response = array(
        'posts' => json_decode($jsonData),
        'pagination' => array(
            'current_page' => $page,
            'total_pages' => $query->max_num_pages,
            'posts_per_page' => $posts_per_page,
        ),
    );

    return json_encode($response);
}


// Enregistrer le point de terminaison REST
add_action('rest_api_init', function () {
    register_rest_route('pagecours/', '/class-filter', array(
        'methods' => 'GET',
        'callback' => 'filtre_cours_endpoint',
    ));
});

// Enqueue le CSS et le JavaScript
function enqueue_mes_assets()
{
    // Assurez-vous que la page actuelle est 'cours' avant d'enregistrer les assets
    if (is_page('cours')) {
        // CSS
        wp_enqueue_style(
            'plugin-style',
            plugin_dir_url(__FILE__) . 'style.css'
        );

        // JavaScript
        wp_enqueue_script(
            'plugin-script',
            plugin_dir_url(__FILE__) . 'js/api-plugin.js',
            true
        );
    }
}

// Hook pour enqueue les scripts 'wp_enqueue_scripts'
add_action('wp_enqueue_scripts', 'enqueue_mes_assets');


function plugin_settings_page() {
    // Get the user-defined ACF fields from the options table
    $acf_fields = get_option('acf_fields');
    $acf_fields_array = explode(',', $acf_fields);

    ?>
    <div class="wrap">
        <h2>Plugin Settings</h2>
        <form method="post" action="">
            <label for="acf_fields">ACF Fields to Use for Filtering (comma-separated):</label>
            <input type="text" id="acf_fields" name="acf_fields" value="<?php echo esc_attr(get_option('acf_fields')); ?>">
            <br>
            <div class="selected-acf-fields">
                <?php
                // Display the selected ACF fields
                foreach ($acf_fields_array as $acf_field) {
                    echo '<div class="selected-acf-field">' . esc_html($acf_field) . '</div>';
                }
                ?>
            </div>
            <input type="submit" name="save_settings" class="button button-primary" value="Save Settings">
        </form>
    </div>
    <?php
}




function process_form_data() {
    if (isset($_POST['save_settings'])) {
        $acf_fields = sanitize_text_field($_POST['acf_fields']);
        update_option('acf_fields', $acf_fields);
    }
}


function register_plugin_menu() {
    add_menu_page('REST PLUGIN', 'REST PLUGIN', 'manage_options', 'plugin-settings', 'plugin_settings_page');
}

add_action('admin_menu', 'register_plugin_menu');
add_action('admin_init', 'process_form_data');
