document.addEventListener('DOMContentLoaded', function () {
    const acfFieldsForm = document.getElementById('acf-fields-form');
    const acfFieldsInput = document.getElementById('acf_fields');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const selectedAcfFieldsContainer = document.querySelector('.selected-acf-fields');

    saveSettingsButton.addEventListener('click', function (event) {
        event.preventDefault(); //Prevent le reload de la page 

        const acfFields = acfFieldsInput.value; // Ensure that it's a string


        // Combine les informations que l'utilisateur à input
        const data = new FormData(acfFieldsForm);
        data.append('action', 'save_acf_fields');
        data.append('acf_fields', acfFields);
        console.log(acfFields);

        //Faire un requête pour envoyer l'info à la DB
        fetch(ajaxurl, {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update l'UI avec les ACF fields sauvegardé
                    selectedAcfFieldsContainer.innerHTML = ''; // Vidé les vielles donné 

                    const acfFieldsString = acfFields.trim(); // S'assurer que c'est un string

                    if (acfFieldsString) {
                        const acfFieldsArray = acfFieldsString.split(','); // Faire une array si nécessaire

                        acfFieldsArray.forEach(acfField => {
                            const div = document.createElement('div');
                            div.className = 'selected-acf-field';
                            div.textContent = acfField.trim();
                            selectedAcfFieldsContainer.appendChild(div);
                        });

                        console.log('Vos ACF fields on été sauvegardé:', acfFieldsString);
                    } else {
                        // Handle the case when acfFieldsString is empty
                        console.log('Aucun ACF fields à été sauvegardé');
                    }
                } else {
                    // Handle errors if needed
                    console.error('Erreur lors de la sauvegarde des ACF fields:', data.error);
                }
            })
            .catch(error => {
                // Handle fetch errors, if any
                console.error('Fetch error:', error);
            });
    });
    
});
