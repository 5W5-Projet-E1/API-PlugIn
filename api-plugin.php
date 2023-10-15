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

    // Définir les arguments pour la requête WP_Query
    $args = array(
        'category_name' => 'pagecours', // Slug de la catégorie
        'posts_per_page' => -1,
    );

    // Initialisation de la requête de métadonnées
    // DOCS: https://developer.wordpress.org/reference/classes/wp_meta_query/
    $meta_query = array('relation' => 'AND');

    // Si le paramètre 'session' est défini, ajouter une clause de métadonnées pour 'session'
    if ($session) {
        $meta_query[] = array(
            'key'     => 'session',
            'value'   => $session,
            'compare' => '=',
            'type'    => 'NUMERIC',
        );
    }

    // Si le paramètre 'type' est défini, ajouter une clause de métadonnées pour 'type'
    if ($type) {
        $meta_query[] = array(
            'key'     => 'type',
            'value'   => $type,
            'compare' => '=',
        );
    }

    // Si des clauses de métadonnées sont définies, les ajouter aux arguments de requête
    if (!empty($meta_query)) {
        $args['meta_query'] = $meta_query;
    }

    // Exécuter la requête WP_Query
    $query = new WP_Query($args);

    // Tableau pour stocker les publications
    $posts = array();

    // Parcourir les publications trouvées
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

    // Convertir le tableau en JSON en supprimant les caractères de contrôle
    $jsonData = preg_replace('/[[:cntrl:]]/', '', json_encode($posts));
    return $jsonData;
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
