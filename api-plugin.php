<?php

/**
 * Plugin name: Plugin REST API
 * Author: Osama Madi
 * Author URI: https://github.com/osamagmm
 * Description: Plugin pour utiliser le point de terminaison de l'API REST personnalisé créé à l'aide de cette fonction vous permet d'interroger et de filtrer les publications dans une catégorie spécifique en fonction de divers paramètres à l'aide de champs ACF (Advance Customs Fields), ce qui le rend utile pour créer des requêtes de contenu personnalisées sur votre site WordPress.
 * Version: 1.0.0
 */


/**
 * Fonction de rappel personnalisée utilisée dans WordPress pour créer
 * un point de terminaison d'API REST personnalisé.
 */

function filtre_acf_endpoint($request)
{
    // Chercher les infos liée au page
    $page = $request->get_param('page'); // Chercher la current page number
    $posts_per_page = $request->get_param('posts_per_page'); // Chercher le number de posts per page
    // Chercher le ACF fields parameter
    $acf_fields = $request->get_param('acf_fields');
    $page = $request->get_param('page'); // Chercher la current page number

    // Set des valeurs par défauts pour $page
    $page = isset($page) ? $page : 1;
    // Set le nombre de posts per page ** Devrait être set dynamique par le plugin user
    $posts_per_page = isset($posts_per_page) ? $posts_per_page : 5; 

    $cat_option = get_option('cat_value');
    // Définir les args pour la WP_query
    $args = array(
        // Slug de la categorie dans laquelle on veut filtrer ** Devrait être set dynamique par le plugin user
        'category_name' => $cat_option,
        'posts_per_page' => $posts_per_page, // Retrieve all posts
        'paged' => $page, // Set the current page
    );

    if (!empty($acf_fields)) {
        // Parse les params ACF fields en array[] ~"session,type"-->[session, type]~
        $acf_fields_array = explode(',', $acf_fields);

        // Init la metadata query
        $meta_query = array('relation' => 'AND');

        // Loop à travers les ACF fields et créer des "metadata clauses"
        /**METTRE LA DOCS ICI */
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

        // Ajouter les "metadata clauses" au args de la query
        $args['meta_query'] = $meta_query;
    }


    // Éxécuter la WP_Query
    $query = new WP_Query($args);

    // Array pour storer les posts
    $posts = array();

    // Itérer à travers les posts trouvé
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

    // Convertir l'array en JSON en enlevant les caractères de contrôls 
    $jsonData = preg_replace('/[[:cntrl:]]/', '', json_encode($posts));

    // Inclure l'information de pagination dans la reponse 
    $response = array(
        'posts' => json_decode($jsonData),
        'pagination' => array(
            'current_page' => $page,
            'total_pages' => $query->max_num_pages,
            'posts_per_page' => $posts_per_page,
        ),
    );
    // Retourner la reponse en format JSON
    return json_encode($response);
}


// Enregistrer le point de terminaison REST (endpoint)
add_action('rest_api_init', function () {
    $cat_option = get_option('cat_value');
    register_rest_route( $cat_option . '/', '/filtre-acf', array(
        'methods' => 'GET',
        'callback' => 'filtre_acf_endpoint',
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

        // Donner l'url AJAX au JavaScript
        wp_localize_script('plugin-script', 'customData', array(
            'ajax_url' => admin_url('admin-ajax.php')
        ));
    }
}

// Hook pour enqueue les scripts 'wp_enqueue_scripts'
add_action('wp_enqueue_scripts', 'enqueue_mes_assets');


function enqueue_admin_script()
{
    $screen = get_current_screen();

    // Vérifier si la page est celle du plugin
    if ($screen->id === 'toplevel_page_filtre-acf') {
        wp_enqueue_script(
            'admin-script',
            plugin_dir_url(__FILE__) . 'js/admin.js',
            '1.0',
            true
        );
    }
}

add_action('admin_enqueue_scripts', 'enqueue_admin_script');


function filtre_acf_page()
{
    // Chercher les ACF fields par l'utilisateur du plugin dans la table option dans la DB!
    $acf_fields = get_option('acf_fields');
    $acf_fields_array = explode(',', $acf_fields);
    $cat_value = get_option('cat_value');
    var_dump($cat_value);
    

?>
    <div class="wrap">
        <h2>Paramètre</h2>
        <form method="post" action="<?php echo admin_url('admin-post.php'); ?>" id="param-form">
            <h2>Les ACF fields que vous filtrer</h2>
            <label for="acf_fields">Entrer les ACF fields que vous voulez utiliser pour filtrer (séparé par des virgules ","):</label>
            <input type="text" id="acf_fields" name="acf_fields" value="<?php echo esc_attr(get_option('acf_fields')); ?>" required>
            
            <div class="selected-acf-fields">
                <?php
                // Display les ACF fields que l'admin à déterminé
                foreach ($acf_fields_array as $acf_field) {
                    echo '<li class="selected-acf-field">' . esc_html($acf_field) . '</li>';
                }
                ?>
            </div>

            <div class="selected-category">
            <h2>Le slug de la catégorie que vous voulez filtrer</h2>
            
            <label for="cat_value">Entrer le slug de la catégorie:</label>
            <input type="text" id="cat_value" name="cat_value" value="<?php echo esc_attr(get_option('cat_value')); ?>" required>

                <ul>
                    <li class="selected-category-li"><?= esc_html($cat_value) ?></li>
                </ul>
            </div>
            <br>

            <input type="submit" id="save-settings-button" name="save_settings" class="button button-primary" value="Save Settings">
        </form>
    </div>
<?php
}

// AJAX action pour sauvegarder les ACF fields et la category values
add_action('wp_ajax_save_acf_and_cat_values', 'save_acf_and_cat_values');

function save_acf_and_cat_values()
{
    $response = array('success' => false);

    if (isset($_POST['acf_fields']) && isset($_POST['cat_value'])) {
        $acf_fields = sanitize_text_field($_POST['acf_fields']);
        $cat_value = sanitize_text_field($_POST['cat_value']);
        
        update_option('acf_fields', $acf_fields);
        update_option('cat_value', $cat_value);
        
        $response['success'] = true;
    } else {
        $response['error'] = 'Invalid data';
    }

    echo json_encode($response);
    wp_die();
}


/**
 * PEUT ETRE PAS NECESSAIRE
 * 
 * 
 * 
 * 
 * 
 * 
 */
add_action('wp_ajax_get_acf_fields', 'get_acf_fields');
function get_acf_field_name()
{
    $acf_field_name = get_option('acf_fields');
    $cat_option = get_option('cat_value');

    $response = array(
        'cat_option' => $cat_option,
        'acf_field_name' => $acf_field_name,
    );

    wp_send_json($response);
}

add_action('wp_ajax_get_acf_field_name', 'get_acf_field_name');
add_action('wp_ajax_nopriv_get_acf_field_name', 'get_acf_field_name');


/**
 * DOIT ETRE CHANGER EVENTUELLEMENT
 */
function register_plugin_menu()
{
    add_menu_page('Filtre ACF', 'Filtre ACF', 'manage_options', 'filtre-acf', 'filtre_acf_page');
}

add_action('admin_menu', 'register_plugin_menu');
