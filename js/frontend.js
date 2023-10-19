document.addEventListener('DOMContentLoaded', function () {
    const acfFieldButtons = document.querySelectorAll('.acf-field-button');
    const touteButton = document.getElementById('toute-button');
    const classContent = document.getElementById('cours-content');
    const nextPageButton = document.querySelector('.next-page');
    const prevPageButton = document.querySelector('.prev-page');

    let acfFields = null;
    let currentPage = 1;

    // Function to load all posts
    function loadAllPosts() {
        acfFields = '';
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
        acfFields = ''; // Set acfFields to an empty string
        currentPage = 1;
        filterClasses(acfFields, currentPage);
    });

    nextPageButton.addEventListener('click', function () {
        if (currentPage < 5) {
            currentPage++;
            filterClasses(acfFields, currentPage);
            prevPageButton.disabled = false;
        }

        if (currentPage === 5) {
            nextPageButton.disabled = true;
        }
    });

    prevPageButton.disabled = true;

    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            filterClasses(acfFields, currentPage);
        }

        if (currentPage < 5) {
            nextPageButton.disabled = false;
        }

        if (currentPage === 1) {
            prevPageButton.disabled = true;
        }
    });

    function filterClasses(acfFields, page) {
        // Create an object to hold the query parameters
        const queryParams = new URLSearchParams();

        // Append the ACF fields to the query parameters
        if (acfFields) {
            queryParams.append('acf_fields', acfFields);
        }

        // Append the page parameter to the query parameters
        queryParams.append('page', page);

        // Construct the URL with query parameters
        let url = `http://localhost/weee1/wp-json/pagecours/class-filter?${queryParams.toString()}`;


        //let url = `http://localhost/weee1/wp-json/pagecours/class-filter?acf_fields=${encodeURIComponent(acfFields)}&page=${page}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                dataJSON = JSON.parse(data);
                displayClasses(dataJSON);
            });
        console.log(url);
    }

    function displayClasses(data) {
        let content = '';
        console.log(data);

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

    loadAllPosts();
});
