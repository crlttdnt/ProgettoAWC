function mostraPassword(bottone) {
    let icone = bottone.querySelectorAll("i");

    icone.forEach((icona) => {
        icona.classList.toggle("d-none");
    });

    let passwords = document.querySelectorAll("input.password");

    passwords.forEach((password) => {
        if (password.type == "text") {
            password.type = "password";
        } else {
            password.type = "text";
        }
    })
}

//Comportamento standard (Controlla solo il Default)
function controllaCampo(campo) {
    if (campo.checkValidity()) {
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    } else {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
    }
}

function controllaValiditaEUnicita(campo) {
    if (!campo.checkValidity() || utenteDoppio(campo.value)) {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
        if (utenteDoppio(campo.value)) {
            campo.nextElementSibling.textContent = "Email already in use";
        } else {
            campo.nextElementSibling.textContent = "Email not valid";
        }
        return false;
    } else {
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
        return true;
    }
}

function controllaUguaglianzaPassword(password1, password2) {
    console.log(password1, password2);
    if (password1.value == password2.value) {
        password2.classList.add("is-valid");
        password2.classList.remove("is-invalid");
        return true;
    } else {
        password2.classList.remove("is-valid");
        password2.classList.add("is-invalid");;
        return false;
    }

}

//Controllo che la data non sia futura
function controllaData(date) {
    let dateValue = Date.parse(date.value);
    let today = new Date().getTime();

    if (dateValue <= today) {
        date.classList.add("is-valid");
        date.classList.remove("is-invalid");
        return true;
    } else {
        date.classList.remove("is-valid");
        date.classList.add("is-invalid");
        return false;
    }

}

function controllaERegistraUtente(form) {
    let inputs = form.querySelectorAll("input");

    for (let input of inputs) {
        if (!input.checkValidity) {
            return false; //Non inviare il form
        }
    }

    if (!controllaValiditaEUnicita(form.querySelector("input#email"))) {
        return false;
    }

    if (!controllaData(form.querySelector("input#birthdate"))) {
        return false;
    }

    if (!controllaUguaglianzaPassword(form.querySelector("input#password"), form.querySelector("input#password2"))) {
        return false;
    }

    //Form è valido

    let dati = new FormData(form);

    let nuovo_utente = {
        email: dati.get("email"),
        password: dati.get("password"),
        nome: dati.get("nome"),
        cognome: dati.get("lname"),
        data: dati.get("date"),
        cookbook: [],
    }

    registraUtente(nuovo_utente);
    provaLogin(nuovo_utente.email, nuovo_utente.password);

    return true;

}

function controllaEModificaUtente(form) {
    let inputs = form.querySelectorAll("input");

    for (let input of inputs) {
        if (!input.checkValidity) {
            return false; //Non inviare il form
        }
    }

    if (!controllaData(form.querySelector("input#birthdate-modify"))) {
        return false;
    }

    //form valido 

    let dati = new FormData(form);

    let utente_modificato = {
        email: getUtenteLoggato().email,
        password: dati.get("password-modify"),
        nome: dati.get("nome-modify"),
        cognome: dati.get("lname-modify"),
        data: dati.get("date-modify"),
        cookbook: getUtenteLoggato().cookbook,
    }

    modificaDatiUtente(utente_modificato);
    return true;
}

function controllaELogin(form) {
    let dati = new FormData(form);

    let email = dati.get("email");
    let password = dati.get("password");

    if (provaLogin(email, password)) {
        document.querySelector(".login-errato").classList.add("d-none");
        return true;
    }
    document.querySelector(".login-errato").classList.remove("d-none");
    return false;
}

function enableEdit() {
    
    document.querySelector(".edit_button").classList.add("d-none");
    document.querySelector(".save_changes_button").classList.remove("d-none");
    
    document.querySelector("#utente-nome>input").toggleAttribute("disabled");
    document.querySelector("#utente-cognome>input").toggleAttribute("disabled");
    document.querySelector("#utente-data>input").toggleAttribute("disabled");
    document.querySelector("#utente-password>input").toggleAttribute("disabled");
}


function controllaERegistraRecensione(form) {
    let inputs = form.querySelectorAll("input");

    for (let input of inputs) {
        if (!input.checkValidity) {
            return false; //Non inviare il form
        }
    }

    if (!controllaData(form.querySelector("input#preparation_date"))) {
        return false;
    }

    let dati = new FormData(form);

    let review = {
        title: getURLParam("id"), 
        utente: getUtenteLoggato().email, 
        text: dati.get("content"),
        difficulty: parseInt(dati.get("difficulty")),
        taste: parseInt(dati.get("taste")),
        date: dati.get("date")
    }
    
   
    addReview(review);

    return true;
}

// Interaction with the Taste Input of the Review Form
function voteTaste(vote) {
    let taste_stars = document.querySelectorAll(".review-taste-input>img");
    if (!vote)
        return;
    //Edit Graphics
    for (let i = 0; i < vote; i++) {
        taste_stars[i].classList.remove("tint-black");
    }
    for (let i = vote; i < taste_stars.length; i++) {
        taste_stars[i].classList.add("tint-black");
    }
}

// Interaction with the Difficulty Input of the Review Form
function voteDifficulty(vote) {
    let difficulty_stars = document.querySelectorAll(".review-difficulty-input>img");
    if (!vote)
        return;
    //Edit Graphics
    for (let i = 0; i < vote; i++) {
        difficulty_stars[i].classList.add("tint-primary");
    }
    for (let i = vote; i < difficulty_stars.length; i++) {
        difficulty_stars[i].classList.remove("tint-primary");
    }
}

function enableNoteEdit(card) {
    card.querySelector("textarea").toggleAttribute("disabled");
    card.querySelector(".edit_note_button").classList.add("d-none");
    card.querySelector(".save_note_button").classList.remove("d-none");
}

function saveNote(card) {
    let id = card.querySelector(".save_note_button").getAttribute("data-id");
    let text = card.querySelector("textarea").value;
    remToCookbook(id);

    addToCookbook({
        id: id,
        text: text
    });

    card.querySelector(".edit_note_button").classList.remove("d-none");
    card.querySelector(".save_note_button").classList.add("d-none");
}
