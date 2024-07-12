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
