document.addEventListener('DOMContentLoaded', function () {
    const paramForm = document.getElementById('param-form');
    const acfFieldsInput = document.getElementById('acf_fields');
    const selectedAcfFieldsContainer = document.querySelector('.selected-acf-fields');
    const selectedCategoryLi = document.querySelector('.selected-category-li');
    const categoryInput = document.getElementById('cat_value');
    const selectedPageLi = document.querySelector('.selected-page-li');
    const pageInput = document.getElementById('page_value');
    const saveSettingsButton = document.getElementById('save-settings-button');


    saveSettingsButton.addEventListener('click', function (event) {

        //Verifier que tout les champs on été remplie avant de continuer
        const inputs = paramForm.querySelectorAll("[required]");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === "") {
                alert("Veuillez remplir toutes les champs");
                event.preventDefault();
                return;
            }
        }

        event.preventDefault(); //Prevent le reload de la page 

        const acfFields = acfFieldsInput.value; // Ensure that it's a string
        const categoryValue = categoryInput.value;
        const pageValue = pageInput.value;

        // Combine les informations que l'utilisateur à input
        const data = new FormData(paramForm);
        data.append('action', 'save_user_input');
        data.append('acf_fields', acfFields);
        data.append('cat_value', categoryValue);
        data.append('page_value', pageValue);

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
                    selectedCategoryLi.innerHTML = ''; // Vidé les vielles donné
                    selectedPageLi.innerHTML = ''; // Vidé les vielles donné

                    const acfFieldsString = acfFields.trim(); // S'assurer que c'est un string
                    const categoryValueString = categoryValue.trim(); // S'assurer que c'est un string
                    const pageValueString = pageValue.trim(); // S'assurer que c'est un string

                    if (acfFieldsString && categoryValueString && pageValueString) {
                        const acfFieldsArray = acfFieldsString.split(','); // Faire une array si nécessaire

                        acfFieldsArray.forEach(acfField => {
                            const li = document.createElement('li');
                            li.className = 'selected-acf-field';
                            li.textContent = acfField.trim();
                            selectedAcfFieldsContainer.appendChild(li);
                        });

                        //Gestion de la selection de categorie
                        selectedCategoryLi.innerHTML = categoryValueString;
                        selectedPageLi.innerHTML = pageValueString;

                        console.log('Vos ACF fields on été sauvegardé:', acfFieldsString);
                        console.log('Vos ACF fields on été sauvegardé:', categoryValueString);
                        console.log('Vos ACF fields on été sauvegardé:', pageValueString);
                    }
                    else {
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
