document.addEventListener('DOMContentLoaded', function () {
    const acfFieldButtons = document.querySelectorAll('.acf-field-button');
    const touteButton = document.getElementById('toute-button');
    const classContent = document.getElementById('cours-content');
    const nextPageButton = document.querySelector('.next-page');
    const prevPageButton = document.querySelector('.prev-page');


    let acfFieldsArray = [];
    let slugCatOption = '';

    // Faire une requête AJAX  pour récuperer le nom des ACF fields
    const fetchData = fetch(customData.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_acf_field_name', // Action custom pour récuperer les noms des ACF field
    })
        .then(response => response.json())
        .then(data => {
            // Set le nom des ACF field dans la variable "acfFields"
            acfFields = data.acf_field_name;
            acfFieldsArray = acfFields.split(','); // Diviser le string en une array

            slugCatOption = data.cat_option

          
        })
        .catch(error => {
            console.error('Erreur lors du fetching des ACF field name:', error);
        });



    // Function pour chercher tout les posts

    fetchData.then(() => {
        // Now that slugCatOption is set, you can proceed with the rest of your code.
        // Call loadToutLesPosts or any other functions that depend on slugCatOption here.
        loadToutLesPosts();
    });

    function loadToutLesPosts() {
        acfFields = [];
        currentPage = 1;
        filterPosts(acfFields, currentPage);
    }

    // Ajouter event listeners pour les buttons ACF field 
    acfFieldButtons.forEach(function (button) {
        button.addEventListener('click', function () {

            const selectedAcfField = button.getAttribute('data-acf-field');

            // Diviser le field choisie par le webPageUser en nom et sa valeur
            const [nomAcfField, valeurAcfField] = selectedAcfField.split(':');

            // Check si le field name existe déja dans l'array
            const index = acfFieldsArray.findIndex(field => field.startsWith(nomAcfField));

            if (index === -1) {
                // Si pas dans l'array on ajoute
                acfFieldsArray.push(selectedAcfField);
            } else {
                // Si dans l'array on update le nom
                acfFieldsArray[index] = nomAcfField + ':' + valeurAcfField;
            }
            currentPage = 1;
            filterPosts(acfFieldsArray, currentPage);
        });
    });

    touteButton.addEventListener('click', function () {
        acfFieldsArray = []; // Set acfFields en string vide
        currentPage = 1;
        filterPosts(acfFieldsArray, currentPage);
    });

    let currentPage = 1;

    // Function pour update les buttons de paginations 
    function updatePaginationButtons(dataJSON) {
        if (dataJSON.pagination.total_pages === 0) {
            //ON PEUT RENDRE CA MIEU POUR LE UX 
            prevPageButton.disabled = true;
            nextPageButton.disabled = true;
        } else {
            prevPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = currentPage === dataJSON.pagination.total_pages;
        }
    }

    nextPageButton.addEventListener('click', function () {
        if (currentPage < dataJSON.pagination.total_pages) {
            currentPage++;
            filterPosts(acfFieldsArray, currentPage);
        }
    });

    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            filterPosts(acfFieldsArray, currentPage);
        }
    });


    /**
     * Fonction pour construire un url avec les informations donner par le WebPageUser
     * @param {Array} acfFieldsArray 
     * @param {Number} page 
     * @returns Un url construit avec les params du WebPageUser
     */
    function buildURL(acfFieldsArray, page) {
        const queryParams = new URLSearchParams(); // Créer un objet pour les params de la query
        const acfFieldString = acfFieldsArray.join(','); // Itérere à traver les ACF fields dans l'array
        const formattedACFFields = acfFieldString.replace(/&/g, ',');// Remplacer les "$" par une virgule ","
        queryParams.append('acf_fields', formattedACFFields);// Ajouter les ACF fields formtatés au param de la query
        queryParams.append('page', page);// Ajouter le param page au param de la query
        // Construire l'URL avec les nouveaus query parameters
        const url = `http://localhost/weee1/wp-json/${slugCatOption}/filtre-acf?${queryParams.toString()}`;
        console.log(url);
        return url;
    }

    /**
     * Fonction pour fetche et filtrer les classes avec les params donné par le WebPageUser
     * @param {Array} acfFieldsArray 
     * @param {Number} page 
     */
    function filterPosts(acfFieldsArray, page) {
        const url = buildURL(acfFieldsArray, page);
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                dataJSON = JSON.parse(data);
                updatePaginationButtons(dataJSON)
                displayPosts(dataJSON);
            });
    }

    /**
    * Fonction pour display les posts filtrés
    * @param {JSON} data 
    */
    function displayPosts(data) {
        let content = '';

        if (data.posts.length > 0) {
            data.posts.forEach((classInfo) => {
                content += '<li class="">';
                content += `<h2>${classInfo.title}</h2>`;
                content += `<p>${classInfo.content}</p>`;
                content += '</li>';
            });
        } else {
            content = '<p>Aucun cours pour cette option n\'est disponible</p>';
        }

        classContent.innerHTML = content;
    }

});
