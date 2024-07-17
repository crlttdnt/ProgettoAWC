if (getUtenteLoggato()) {
    let elementi_loggato = document.querySelectorAll(".loggato");
    let elementi_non_loggato = document.querySelectorAll(".non-loggato");
    elementi_loggato.forEach((el) => el.classList.remove("d-none"));
    elementi_non_loggato.forEach((el) => el.classList.add("d-none"));
}


function getURLParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

//Returns the list of Ingredients, with Measures, for meal
function extractIngredients(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal["strIngredient" + i];
        let measure = meal["strMeasure" + i];
        if (ingredient && measure) {
            ingredients.push(
                {
                    name: ingredient,
                    measure: measure
                }
            );
        }
    }
    return ingredients;
}


const recipe_note = document.getElementById('recipe-note')
if (recipe_note) {
    recipe_note.addEventListener('show.bs.modal', event => {

        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipe_id = button.getAttribute('data-recipe')
        // If necessary, you could initiate an Ajax request here
        // and then do the updating in a callback.

        if (button.querySelector("i").classList.contains("fas")) {
            remToCookbook(recipe_id);
            return false;
        }

        // Update the modal's content.
        const saveButton = recipe_note.querySelector('.save-recipe')

        saveButton.setAttribute("data-recipe", recipe_id);
    })
}

function saveRecipe(button) {

    let recipe_id = button.getAttribute("data-recipe");

    let saved_recipe = {
        id: recipe_id,
        text: document.querySelector("#note-text").value
    }

    addToCookbook(saved_recipe);

    document.querySelector("#note-text").value = "";

    location.reload();


}
