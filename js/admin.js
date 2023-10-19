document.addEventListener('DOMContentLoaded', function () {
    const acfFieldsForm = document.getElementById('acf-fields-form');
    const acfFieldsInput = document.getElementById('acf_fields');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const selectedAcfFieldsContainer = document.querySelector('.selected-acf-fields');

    saveSettingsButton.addEventListener('click', function (event) {
        event.preventDefault();

        const acfFields = acfFieldsInput.value;

        const data = new FormData(acfFieldsForm);
        data.append('action', 'save_acf_fields');
        data.append('acf_fields', acfFields);

        fetch(ajaxurl, {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update UI with the saved ACF fields
                selectedAcfFieldsContainer.innerHTML = ''; // Clear previous content

                const acfFieldsArray = acfFields.split(',');
                acfFieldsArray.forEach(acfField => {
                    const div = document.createElement('div');
                    div.className = 'selected-acf-field';
                    div.textContent = acfField.trim();
                    selectedAcfFieldsContainer.appendChild(div);
                });

                // Optionally, you can show a success message to the user
                console.log('ACF fields saved successfully:', acfFieldsArray);
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
});
