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
