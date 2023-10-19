document.addEventListener('DOMContentLoaded', function () {
    const acfFieldsInput = document.getElementById('acf_fields'); // Input for user-defined ACF fields
    const acfFieldButtons = document.querySelectorAll('.acf-field-button'); // Buttons for ACF field values
    const touteButton = document.getElementById('toute-button');
    const classContent = document.getElementById('cours-content'); // Où le contenu est ajouté
    const nextPageButton = document.querySelector('.next-page'); // Bouton pour la page suivante
    const prevPageButton = document.querySelector('.prev-page'); // Bouton pour la page précédente

    let acfFields = null; // Initialize user-defined ACF fields
    let currentPage = 1;

    // Fonction pour charger tous les articles de la catégorie "cours"
    function loadAllPosts() {
        acfFields = acfFieldsInput.value;
        currentPage = 1;
        filterClasses(acfFields, currentPage);
    }

    // Add event listeners for ACF field buttons
    acfFieldButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const selectedAcfField = button.getAttribute('data-acf-field');
            acfFields = selectedAcfField;
            currentPage = 1;
            filterClasses(acfFields, currentPage);
        });
    });

    touteButton.addEventListener('click', function () {
        // Clear the ACF fields input and load all posts
        acfFieldsInput.value = '';
        acfFields = '';
        currentPage = 1;
        filterClasses(acfFields, currentPage);
    });

    // Écouteur d'événement pour le bouton de la page suivante
    nextPageButton.addEventListener('click', function () {
        if (currentPage < 5) {
            currentPage++;
            filterClasses(session, type, currentPage);
            prevPageButton.disabled = false;

        }
        //Deactive le button si cest la page 5
        if (currentPage === 5) {
            nextPageButton.disabled = true
        }
        
    });

    //Deactive le button si cest la page 1
    prevPageButton.disabled = true
    // Écouteur d'événement pour le bouton de la page précédente
    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            filterClasses(session, type, currentPage);
        }
        //Deactive le button si cest la page 5
        if (currentPage < 5) {
            nextPageButton.disabled = false
        }
        //Reactive le button si cest la page 1
        if(currentPage === 1){
            prevPageButton.disabled = true
        }
    });

    function filterClasses(session, type, page) {
        if (session === null) {
            session = ''; // Définit la valeur de session par défaut (chaine vide)
        }
        if (type === null) {
            type = ''; // Définit la valeur de type par défaut (chaine vide)
        }

        let url = `http://localhost/weee1/wp-json/pagecours/class-filter?session=${encodeURIComponent(session)}&type=${encodeURIComponent(type)}&page=${page}`;

        fetch(url)
            .then((response) => response.json()) // Obtenir la réponse comme texte
            .then((data) => {
                dataJSON = JSON.parse(data);
                displayClasses(dataJSON);
            });

        function displayClasses(data) {
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

    }

    // Charger tous les articles lorsque la page se charge
    loadAllPosts();
});