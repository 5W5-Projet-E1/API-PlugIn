// <!-- Add this JavaScript to your template -->
document.addEventListener('DOMContentLoaded', function () {
    const sessionButtons = document.querySelectorAll('.session-button');
    const typeButtons = document.querySelectorAll('.type-button');
    const classContent = document.getElementById('cours-content');
    const touteButton = document.querySelector('.toute-button');

    let session = null;
    let type = null;

    // Function to load all posts from the "cours" category
    function loadAllPosts() {
        session = null
        type = null;
        filterClasses(session, type);
    }


    // Event listeners for session buttons
    sessionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            session = button.getAttribute('data-session');
            filterClasses(session, type);
            // console.log('button clicker')
            // console.log(session)
            // console.log(type)

        });
    });

    // Event listeners for type buttons
    typeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            type = button.getAttribute('data-type');
            filterClasses(session, type);
            // console.log('button clicker 2')
            // console.log(session)
            // console.log(type)

        });
    });
    //Afficher tout les cours
    touteButton.addEventListener('click', loadAllPosts)


    function filterClasses(session, type) {
        if (session === null) {
            session = ''; // Set the default session value (empty string)
        }
        if (type === null) {
            type = ''; // Set the default type value (empty string)
        }

        let url = `http://localhost/weee1/wp-json/pagecours/v1/class-filter?session=${encodeURIComponent(session)}&type=${encodeURIComponent(type)}`;

        //let url = `https://gftnth00.mywhc.ca/tim02/cours/wp-json/custom/v1/class-filter?session=${encodeURIComponent(session)}&type=${encodeURIComponent(type)}`;

        fetch(url)
            .then((response) => response.json()) // Get the response as text
            .then((data) => {
                dataJSON = JSON.parse(data)
                displayClasses(dataJSON);
            })

        function displayClasses(data) {
            // console.log(data);
            let content = '';

            if (data.length > 0) {
                data.forEach((classInfo) => {
                    //On peut changer la structure ici
                    content += '<li class = "">';
                    content += `<h2>${classInfo.title}</h2>`;
                    content += `<p>${classInfo.content}</p>`;
                    content += '</li>';
                });
            } else {
                content = '<p>Aucune classe pour cette option et disponible</p>';
            }

            classContent.innerHTML = content;
        }
    }

    // Load all posts when the page loads
    loadAllPosts();
});