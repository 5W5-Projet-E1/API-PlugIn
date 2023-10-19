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
    // Set default values for page and posts_per_page
    $page = $request->get_param('page'); // Get the current page number
    $posts_per_page = $request->get_param('posts_per_page'); // Get the number of posts per page
    
    // Get the ACF fields parameter
    $acf_fields = $request->get_param('acf_fields');
    $page = $request->get_param('page'); // Get the current page number
    
    // Set default values for page
    $page = isset($page) ? $page : 1;
    $posts_per_page = isset($posts_per_page) ? $posts_per_page : 5; // Set your desired posts per page value

    // Define the arguments for the WP_Query
    $args = array(
        'category_name' => 'pagecours', // Slug of the category
        'posts_per_page' => $posts_per_page, // Retrieve all posts
        'paged' => $page, // Set the current page
    );

    if (!empty($acf_fields)) {
        // Parse the ACF fields parameter into an array
        $acf_fields_array = explode(',', $acf_fields);

        // Initialize the metadata query
        $meta_query = array('relation' => 'AND');

        // Loop through the ACF fields and create metadata clauses
        foreach ($acf_fields_array as $acf_field) {
            $field_parts = explode(':', $acf_field);
            if (count($field_parts) == 2) {
                $meta_query[] = array(
                    'key' => $field_parts[0],
                    'value' => $field_parts[1],
                    'compare' => '=',
                );
            }
        }

        // Add the metadata clauses to the query arguments
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
    // var_dump($response);
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
            plugin_dir_url(__FILE__) . 'js/frontend.js',
            true,
        );
    }
}

// Hook pour enqueue les scripts 'wp_enqueue_scripts'
add_action('wp_enqueue_scripts', 'enqueue_mes_assets');


function enqueue_admin_script()
{
    $screen = get_current_screen();

    // Check if the current admin page is 'rest-plugin'
    if ($screen->id === 'toplevel_page_rest-plugin') {
        wp_enqueue_script(
            'admin-script',
            plugin_dir_url(__FILE__) . 'js/admin.js',
            '1.0',
            true
        );
    }
}

add_action('admin_enqueue_scripts', 'enqueue_admin_script');


function rest_plugin_page()
{
    // Get the user-defined ACF fields from the options table
    $acf_fields = get_option('acf_fields');
    $acf_fields_array = explode(',', $acf_fields);

?>
    <div class="wrap">
        <h2>Plugin Settings</h2>
        <form method="post" action="" id="acf-fields-form">
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
            <input type="submit" id="save-settings-button" name="save_settings" class="button button-primary" value="Save Settings">
        </form>
    </div>
<?php
}

add_action('wp_ajax_save_acf_fields', 'save_acf_fields');

function save_acf_fields()
{
    $response = array('success' => false);

    if (isset($_POST['acf_fields'])) {
        $acf_fields = sanitize_text_field($_POST['acf_fields']);
        update_option('acf_fields', $acf_fields);
        $response['success'] = true;
    } else {
        $response['error'] = 'Invalid ACF fields data.';
    }

    
    echo json_encode($response);
    wp_die();
}

add_action('wp_ajax_get_acf_fields', 'get_acf_fields');




// function process_form_data()
// {
//     if (isset($_POST['save_settings'])) {
//         $acf_fields = sanitize_text_field($_POST['acf_fields']);
//         update_option('acf_fields', $acf_fields);
//     }
// }


function register_plugin_menu()
{
    add_menu_page('REST PLUGIN', 'REST PLUGIN', 'manage_options', 'rest-plugin', 'rest_plugin_page');
}

add_action('admin_menu', 'register_plugin_menu');
// add_action('admin_init', 'process_form_data');
