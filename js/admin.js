document.addEventListener('DOMContentLoaded', function () {
    const acfFieldsForm = document.getElementById('acf-fields-form');
    const acfFieldsInput = document.getElementById('acf_fields');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const selectedAcfFieldsContainer = document.querySelector('.selected-acf-fields');

    saveSettingsButton.addEventListener('click', function (event) {
        event.preventDefault();

        const acfFields = acfFieldsInput.value; // Ensure that it's a string

        const data = new FormData(acfFieldsForm);
        data.append('action', 'save_acf_fields');
        data.append('acf_fields', acfFields);
        console.log(acfFields);

        fetch(ajaxurl, {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update UI with the saved ACF fields
                    selectedAcfFieldsContainer.innerHTML = ''; // Clear previous content

                    const acfFieldsString = acfFields.trim(); // Ensure it's a string and remove extra spaces

                    if (acfFieldsString) {
                        const acfFieldsArray = acfFieldsString.split(','); // Split into an array if needed

                        acfFieldsArray.forEach(acfField => {
                            const div = document.createElement('div');
                            div.className = 'selected-acf-field';
                            div.textContent = acfField.trim();
                            selectedAcfFieldsContainer.appendChild(div);
                        });

                        // Optionally, you can show a success message to the user
                        console.log('ACF fields saved successfully:', acfFieldsString);
                        sendAPIRequest(acfFieldsArray);
                    } else {
                        // Handle the case when acfFieldsString is empty
                        console.log('No ACF fields saved.');
                    }
                } else {
                    // Handle errors if needed
                    console.error('Failed to save ACF fields:', data.error);
                }
            })
            .catch(error => {
                // Handle fetch errors, if any
                console.error('Fetch error:', error);
            });
    });


    function sendAPIRequest(acfFieldsArray) {
        // Create the ACF fields string in the format "field1:value1,field2:value2"
        const acfFieldsString = acfFieldsArray.join(',');

        // Construct the correct URL
        
        const apiUrl = `/weee1/wp-json/pagecours/class-filter?acf_fields=${acfFieldsString}&page=1`;
        // Include code to send the API request with the constructed URL
        console.log(apiUrl);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Handle the API response as needed
                console.log('API Response:', data);
            })
            .catch(error => {
                // Handle API request errors, if any
                console.error('API Request Error:', error);
            });
    }
    
    
    
});
