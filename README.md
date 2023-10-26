# Filtre ACF Plugin
- Description: Plugin pour utiliser le point de terminaison de l'API REST personnalisé permet de filtrer les publications dans une catégorie spécifique en fonction de divers paramètres à l'aide de champs ACF (Advance Customs Fields), ce qui le rend utile pour créer des requêtes de contenu personnalisées sur votre site WordPress. Ce plugin gère aussi la pagination de vôtre site en spécifiant les paramètres de votre choix.
# Comment utiliser
- Dans votre page template où le filtre devrait être actif, copier et coller ce gabarit.
- Vous pouvez rajouter des boutons en copiant et en collant le deuxième bouton. 
```HTML
<button id="toute-button"class="toute-button" data-*acfField* = "">Toute</button>

<!-- Ajouter plus de boutons si nécessaire -->
<button class="acf-field-button" data-acf-field="*acfField*:*valeur*">*valeur*</button>

<div class="le-content-container">
    <!--  Le contenue append ici dans des <li> -->
    <ul id="le-content" class="le-content">

    </ul>
</div>

<div class="pagination-container">
    <!-- Les liens de paginations seront ici -->
    <button class="prev-page">Previous</button>
    <button class="next-page">Next</button>
</div>
```
- Ensuite vous n'avez qu'à remplacer les parties entourer par des astérisques `*acfFields*` & `*valeur*` par vos noms de  champs ACF et leurs valeurs.
- Chaque champs devrait avoir sont propre groupe de buttons et de valeur, assurer vous que les valeurs et les champs écrit existe et sont bien écrit. ([Example ici!](#exemple-dutilisation))

# Recommandations
- Les balises HTML du gabarit peuvent être changé, toutefois les classes et id doivent rester les mêmes
- Pour vous pouvez ajouter vos propre classe CSS en la rajoutent après la classe `le-content`
**`<ul id="le-content" class="le-content votre-classe">`**
- La classe pour les boutons n'est pas nécessaire mais seulement recommander, toutefois les attributs data `data-acf-field` sont obligatoire pour un bon fonctionnement
- Les `:` entre le champ ACF et la valeur de celui-ci est obligatoire

# Exemple d'utilisation
- Dans cet example le filtre fonctionnera avec deux champs ACF distinct
```HTML
<h4>Filtrer par session: </h4>
<button class="acf-field-button" data-acf-field="session:1">Session 1</button>
<button class="acf-field-button" data-acf-field="session:2">Session 2</button>

<h4>Filtrer par type de cours: </h4>
<button class="acf-field-button" data-acf-field="type:Création">Création</button> 
<button class="acf-field-button" data-acf-field="type:Programmation">Programmation</button>
```
- Le premier groupe `session` et mis avec ça valeur `1` et de même pour le deuxième groupe `type:Création`
