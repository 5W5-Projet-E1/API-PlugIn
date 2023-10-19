document.addEventListener('DOMContentLoaded', function () {
    const acfFieldButtons = document.querySelectorAll('.acf-field-button');
    const touteButton = document.getElementById('toute-button');
    const classContent = document.getElementById('cours-content');
    const nextPageButton = document.querySelector('.next-page');
    const prevPageButton = document.querySelector('.prev-page');


    let acfFieldsArray = [];

    // Make an AJAX request to retrieve the ACF field name
    fetch(customData.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_acf_field_name', // Custom action to retrieve the ACF field name
    })
        .then(response => response.json())
        .then(data => {
            // Set the ACF field name in your JavaScript variable
            acfFields = data.acf_field_name;
            acfFieldsArray = acfFields.split(','); // Split the string into an array
            console.log('gcuhfiuviu', acfFields);

            // Log the array
            console.log('ACF Fields:', acfFieldsArray);
        })
        .catch(error => {
            console.error('Error fetching ACF field name:', error);
        });


    let currentPage = 1;

    // Function to load all posts
    function loadAllPosts() {
        acfFields = [];
        currentPage = 1;
        filterClasses(acfFields, currentPage);
    }

    // Add event listeners for ACF field buttons
    acfFieldButtons.forEach(function (button) {
        button.addEventListener('click', function () {

            const selectedAcfField = button.getAttribute('data-acf-field');

            // Split the selected ACF field into its name and value
            const [acfFieldName, acfFieldValue] = selectedAcfField.split(':');

            // Check if the ACF field name already exists in the array
            const index = acfFieldsArray.findIndex(field => field.startsWith(acfFieldName));

            if (index === -1) {
                // If not in the array, add it
                acfFieldsArray.push(selectedAcfField);
            } else {
                // If already in the array, update the value
                acfFieldsArray[index] = acfFieldName + ':' + acfFieldValue;
            }

            // Log the updated array for testing
            console.log('Updated ACF Fields Array:', acfFieldsArray);
            currentPage = 1;
            filterClasses(acfFieldsArray, currentPage);
        });
    });

    touteButton.addEventListener('click', function () {
        acfFieldsArray = []; // Set acfFields to an empty string
        currentPage = 1;
        filterClasses(acfFieldsArray, currentPage);
    });

    nextPageButton.addEventListener('click', function () {
        if (currentPage < 5) {
            currentPage++;
            filterClasses(acfFieldsArray, currentPage);
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
            filterClasses(acfFieldsArray, currentPage);
        }

        if (currentPage < 5) {
            nextPageButton.disabled = false;
        }

        if (currentPage === 1) {
            prevPageButton.disabled = true;
        }
    });


    function buildURL(acfFieldsArray, page) {
        // Create an object to hold the query parameters
        const queryParams = new URLSearchParams();
        // Iterate over the ACF fields in the array
        const acfFieldString = acfFieldsArray.join(',');
        // Replace ampersands with commas
        const formattedACFFields = acfFieldString.replace(/&/g, ',');
        // Append the formatted ACF fields to the query parameters
        queryParams.append('acf_fields', formattedACFFields);
        // Append the page parameter to the query parameters
        queryParams.append('page', page);
        // Construct the URL with query parameters
        const url = `http://localhost/weee1/wp-json/pagecours/class-filter?${queryParams.toString()}`;
        return url;
    }




    function filterClasses(acfFieldsArray, page) {

        const url = buildURL(acfFieldsArray, page);
        console.log('Constructed URL:', url);

        //let url = `http://localhost/weee1/wp-json/pagecours/class-filter?acf_fields=${encodeURIComponent(acfFields)}&page=${page}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                dataJSON = JSON.parse(data);
                displayClasses(dataJSON);
            });
        // console.log(url);
    }



    function displayClasses(data) {
        let content = '';
        // console.log(data);

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
