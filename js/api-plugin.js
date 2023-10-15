// <!-- Ajoutez ce JavaScript à votre modèle -->
document.addEventListener('DOMContentLoaded', function () {
    const sessionButtons = document.querySelectorAll('.session-button'); // Boutons de session 1-6
    const typeButtons = document.querySelectorAll('.type-button'); // Boutons pour le type
    const touteButton = document.querySelector('.toute-button'); // Bouton pour afficher tout
    const classContent = document.getElementById('cours-content'); // Où le contenu est ajouté

    let session = null;
    let type = null;

    // Fonction pour charger tous les articles de la catégorie "cours"
    function loadAllPosts() {
        session = null
        type = null;
        filterClasses(session, type);
    }

    // Écouteurs d'événements pour les boutons de session
    sessionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            session = button.getAttribute('data-session');
            filterClasses(session, type);
            // console.log('button clicker')
            // console.log(session)
            // console.log(type)
        });
    });

    // Écouteurs d'événements pour les boutons de type
    typeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            type = button.getAttribute('data-type');
            filterClasses(session, type);
            // console.log('button clicker 2')
            // console.log(session)
            // console.log(type)
        });
    });

    // Afficher tous les cours
    touteButton.addEventListener('click', loadAllPosts);

    function filterClasses(session, type) {
        if (session === null) {
            session = ''; // Définit la valeur de session par défaut (chaine vide)
        }
        if (type === null) {
            type = ''; // Définit la valeur de type par défaut (chaine vide)
        }

        let url = `http://localhost/weee1/wp-json/pagecours/class-filter?session=${encodeURIComponent(session)}&type=${encodeURIComponent(type)}`;

        //let url = `https://gftnth00.mywhc.ca/tim02/wp-json/pagecours/class-filter?session=${encodeURIComponent(session)}&type=${encodeURIComponent(type)}`;

        fetch(url)
            .then((response) => response.json()) // Obtenir la réponse comme texte
            .then((data) => {
                dataJSON = JSON.parse(data);
                displayClasses(dataJSON);
            });

        function displayClasses(data) {
            // console.log(data);
            let content = '';

            if (data.length > 0) {
                data.forEach((classInfo) => {
                    // Vous pouvez changer la structure ici
                    content += '<li class = "">';
                    content += `<h2>${classInfo.title}</h2>`;
                    content += `<p>${classInfo.content}</p>`;
                    content += '</li>';
                });
            } else {
                content = '<p>Aucun cours pour cette option et disponible</p>';
            }

            classContent.innerHTML = content;
        }
    }

    // Charger tous les articles lorsque la page se charge
    loadAllPosts();
});
