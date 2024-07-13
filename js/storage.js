
//registra utente nel local storage
function registraUtente(utente) {

    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));

    if (!utenti_attuali) {
        utenti_attuali = [];
    }

    utenti_attuali.push(utente);

    localStorage.setItem("utenti", JSON.stringify(utenti_attuali));
}

function utenteDoppio(utente) {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));

    if (!utenti_attuali) {
        return false;
    }

    for (let i = 0; i < utenti_attuali.length; i++) {
        if (utenti_attuali[i].email == utente) {
            return true;
        }
    }

    return false;
}

//effettua login se i dati inseriti corrispondono ad un utente esistente
function provaLogin(email, password) {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));

    if (!utenti_attuali) {
        return false;
    }

    let trovato = utenti_attuali.filter((utente) => utente.email == email && utente.password == password);

    if (trovato.length > 0) {
        sessionStorage.setItem("utente_loggato", email);
        return true;
    }
    return false;
}

//restituisce l'utente loggato
function getUtenteLoggato() {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));
    let email = sessionStorage.getItem("utente_loggato");

    if (email) {
        let trovati = utenti_attuali.filter((utente) => utente.email == email);
        return trovati[0];
    }
    return null;
}

function getNomeCognome(email) {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));

    if (email) {
        let trovati = utenti_attuali.filter((utente) => utente.email == email);
        return trovati[0].nome + " " + trovati[0].cognome;

    }
    return null;
}


//aggiunge la ricetta al ricettario dell'utente loggato
function addToCookbook(recipe) {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));
    let email = sessionStorage.getItem("utente_loggato");

    for (let i = 0; i < utenti_attuali.length; i++) {
        if (utenti_attuali[i].email == email) {

            utenti_attuali[i].cookbook.push(recipe);
        }
    }
    localStorage.setItem("utenti", JSON.stringify(utenti_attuali));
}


function remToCookbook(recipe_id) {
    let utente = getUtenteLoggato();

    for (let i = 0; i < utente.cookbook.length; i++) {
        if (utente.cookbook[i].id == recipe_id) {
            utente.cookbook.splice(i, 1);
        }
    }

    let utenti = JSON.parse(localStorage.getItem("utenti"));

    for (let i = 0; i < utenti.length; i++) {
        if (utenti[i].email == utente.email) {
            utenti[i] = utente;
        }
    }
    localStorage.setItem("utenti", JSON.stringify(utenti));
    location.reload();
}

//aggiunge la ricetta che ha recensioni
function addReview(review) {
    let reviews = localStorage.getItem("recensioni");

    if (!reviews) {
        reviews = {};
    } else {
        reviews = JSON.parse(reviews);
    }

    if (!reviews[review.title]) {
        reviews[review.title] = [];
    }

    reviews[review.title].push(review);
    localStorage.setItem("recensioni", JSON.stringify(reviews))
}

function remReview(recipe_id, review_date, review_text) {
    let user = getUtenteLoggato().email;
    let reviews = JSON.parse(localStorage.getItem("recensioni"));

    for (let i = 0; i < reviews[recipe_id].length; i++) {
        let review = reviews[recipe_id][i];
        if (review.utente == user && review.date == review_date && review.text == review_text) {
            reviews[recipe_id].splice(i, 1);
        }
    }
    localStorage.setItem("recensioni", JSON.stringify(reviews));
    location.reload();
}


function getUserReviews() {
    let email = sessionStorage.getItem("utente_loggato")
    let reviews = JSON.parse(localStorage.getItem("recensioni"));
    let user_reviews = []
    for (let recipe_id of Object.keys(reviews)) { // !!! Preso da https://stackoverflow.com/questions/36839089/how-to-retrieve-all-fields-from-a-json-file
        for (let recipe of reviews[recipe_id]) {
            if (recipe.utente == email) {
                user_reviews.push(recipe);
            }
        }
    }
    return user_reviews;
}

function getReviewsById(id) {
    let reviews = JSON.parse(localStorage.getItem("recensioni"));
    return reviews[id];

}

function getRecipeReviewStats(id) {
    let reviews = JSON.parse(localStorage.getItem("recensioni"));
    if (reviews) {
        let related_reviews = reviews[id];
        if (related_reviews && related_reviews.length > 0) {
            return {
                taste: (related_reviews.map((review) => parseInt(review.taste)).reduce((a, b) => a + b, 0) / related_reviews.length).toFixed(1),
                difficulty: (related_reviews.map((review) => parseInt(review.difficulty)).reduce((a, b) => a + b, 0) / related_reviews.length).toFixed(1),
            }
        }
    } else {
        localStorage.setItem("recensioni", JSON.stringify({}));
    }
    return {
        taste: '-',
        difficulty: '-',
    }
}

//modifica i campi dell'utente loggato
function modificaDatiUtente(nuovo_utente) {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));

    for (let i = 0; i < utenti_attuali.length; i++) {
        if (utenti_attuali[i].email == nuovo_utente.email) {
            utenti_attuali[i] = nuovo_utente;
        }
    }

    localStorage.setItem("utenti", JSON.stringify(utenti_attuali));
}

function logout() {
    sessionStorage.removeItem("utente_loggato");
    location.reload();
}

//cancella utente loggato
function cancellaUtente() {
    let utenti_attuali = JSON.parse(localStorage.getItem("utenti"));
    let email = sessionStorage.getItem("utente_loggato");

    for (let i = 0; i < utenti_attuali.length; i++) {
        if (utenti_attuali[i].email == email) {
            utenti_attuali.splice(i, 1);
        }
    }

    sessionStorage.removeItem("utente_loggato");
    localStorage.setItem("utenti", JSON.stringify(utenti_attuali));
}

function isInCookbook(id) {
    let user_cookbook = getUtenteLoggato()?.cookbook;
    if (!user_cookbook) {
        return false;
    }
    for (let recipe of user_cookbook) {
        if (recipe.id == id) {
            return true;
        }
    }
    return false;
}


