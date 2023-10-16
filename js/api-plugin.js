document.addEventListener('DOMContentLoaded', function () {
    const sessionButtons = document.querySelectorAll('.session-button'); // Boutons de session 1-6
    const typeButtons = document.querySelectorAll('.type-button'); // Boutons pour le type
    const touteButton = document.querySelector('.toute-button'); // Bouton pour afficher tout
    const classContent = document.getElementById('cours-content'); // Où le contenu est ajouté
    const nextPageButton = document.querySelector('.next-page'); // Bouton pour la page suivante
    const prevPageButton = document.querySelector('.prev-page'); // Bouton pour la page précédente

    let session = null;
    let type = null;
    let currentPage = 1;

    // Fonction pour charger tous les articles de la catégorie "cours"
    function loadAllPosts() {
        session = null;
        type = null;
        currentPage = 1;
        filterClasses(session, type, currentPage);
    }

    // Écouteurs d'événements pour les boutons de session
    sessionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            session = button.getAttribute('data-session');
            currentPage = 1;
            filterClasses(session, type, currentPage);
        });
    });

    // Écouteurs d'événements pour les boutons de type
    typeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            type = button.getAttribute('data-type');
            currentPage = 1;
            filterClasses(session, type, currentPage);
        });
    });

    // Afficher tous les cours
    touteButton.addEventListener('click', loadAllPosts);

    // Écouteur d'événement pour le bouton de la page suivante
    nextPageButton.addEventListener('click', function () {
        currentPage++;
        filterClasses(session, type, currentPage);
    });

    // Écouteur d'événement pour le bouton de la page précédente
    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            filterClasses(session, type, currentPage);
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