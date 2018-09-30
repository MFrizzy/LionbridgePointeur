modelHoraire = new Horaire(new Date());
modelSession = new Session(new Date());

var today = new Date().toLocaleDateString();

all_sessions = {};
if (getCookie("all_sessions")) all_sessions = JSON.parse(getCookie("all_sessions"));

/**
 * ForEach pour les sessions
 *
 * @param fonction qui prend comme paramètre chaque element de all_sessions
 */
all_sessions.forEach = function (fonction) {
    all_sessions_keys = Object.keys(all_sessions);
    i = 0;
    while (i < all_sessions_keys.length) {
        current = all_sessions[all_sessions_keys[i]];
        if (current != all_sessions.forEach) {
            fonction(current);
        }
        i++;
    }
};

/**
 * Récupération ex current sessions si partie pas finie
 */
if (!(getCookie('current') == "null" || getCookie('current') == null)) {
    cookie_current = JSON.parse(getCookie("current"));
    all_sessions[cookie_current.debut.objet] = cookie_current;
}

today_sessions = [];

all_sessions.forEach(function (current) {
    if (current.debut.date == today) {
        today_sessions.push(current);
    }
    current.debut.getHeure = modelHoraire.getHeure;
    current.fin.getHeure = modelHoraire.getHeure;
    current.generateLi = modelSession.generateLi;
    current.getFinalTW = modelSession.getFinalTW;
    document.getElementById("histoj").innerHTML += current.generateLi();
});

histoAll = document.getElementById("histo_all");
histoToday = document.getElementById('histoj');
all_sessions_by_day = {};

updateAll();

function updateAll() {

    totalSecondes = 0;
    totalTaches = 0;

    // Nettoyage sale de historique du jour
    histoToday.innerHTML = "";
    histoAll.innerHTML = "";

    all_sessions.forEach(function (current) {

        if (current.debut.date == today) {
            histoToday.innerHTML += current.generateLi();
            totalSecondes += current.fin.objet - current.debut.objet;
            totalTaches += Number(current.nbTaches);
        }

        //histoAll.innerHTML += current.generateLi();

    });

    all_sessions_by_day = {};
    for (var date in all_sessions_by_day) {
        delete all_sessions_by_day[date];
    }

    all_sessions.forEach(function (session) {

        if (all_sessions_by_day[session.debut.date]) {
            all_sessions_by_day[session.debut.date].push(session);
        } else {
            all_sessions_by_day[session.debut.date] = [session];
        }
    });

    for (var date in all_sessions_by_day) {
        tab_sessions = all_sessions_by_day[date];
        // Creer h3 avec nom jour
        h3 = document.createElement("h3");
        h3.innerText = date;
        // Creéer div de l'accordéon
        div = document.createElement("div");
        contenuDiv = "<ul class=\"mdc-list mdc-list--two-line\" >";
        tab_sessions.forEach(function (session) {
            contenuDiv += session.generateLi();
        });
        div.innerHTML = contenuDiv + "</ul>";
        // ajouter tout ça dans le histoAll
        histoAll.appendChild(h3);
        histoAll.appendChild(div);
    }

    totalHeures = totalSecondes / (60 * 60 * 1000); // 60 minutes * 60 secondes * 1000 millisecondes
    document.getElementById("today_heures").innerText = precisionRound(totalHeures, 2) + " heures"
    document.getElementById("today_taches").innerText = totalTaches + " Tâches"
}

function removeSession(timestamp) {
    delete all_sessions[timestamp];
    if (navigator.cookieEnabled) {
        let toSave = JSON.stringify(all_sessions);
        setCookie("all_sessions", toSave);
    } else {
        alert("Activez vos cookies")
    }
    updateAll();
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

var currentSession = null;

function nouveau() {
    if (currentSession == null) {
        currentSession = new Session(new Date());
        document.getElementById("new").disabled = true;
        document.getElementById("finish").disabled = false;
        document.getElementById("DD").innerText = currentSession.debut.getHeure();
        document.getElementById("add").disabled = false;
        document.getElementById("TW").innerText = "0.00";
        setInterval(function () {
            document.getElementById("PF").innerText = precisionRound(Number(document.getElementById("compt").innerText) / (30 * currentSession.getTWInteractif()), 2);
            document.getElementById("TW").innerText = currentSession.getTWInteractif();
        }, 1000 * 30)
    }
}

function finish() {
    if (currentSession != null) {
        setCookie("current", null);
        currentSession.end(new Date(), document.getElementById("compt").innerText);
        document.getElementById("new").disabled = false;
        document.getElementById("finish").disabled = true;
        document.getElementById("DD").innerText = "";
        document.getElementById("add").disabled = true;
        document.getElementById("remove").disabled = true;
        document.getElementById("histoj").innerHTML += currentSession.generateLi();
        document.getElementById("compt").innerText = "0";
        document.getElementById("PF").innerText = "";
        document.getElementById("TW").innerText = "";
        currentSession.save();
        currentSession = null;
        updateAll();
    }
}


function add() {
    var compteur = document.getElementById("compt");
    currentSession.nbTaches = Number(compteur.innerText) + 1;
    compteur.innerText = currentSession.nbTaches;
    let snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById("snack"));
    snackbar.show({
            message: "+1"
        }
    );
    // Add temporary end date for currentSession
    currentSession.fin = new Horaire(new Date());
    // Save in cookies current session
    setCookie("current", JSON.stringify(currentSession));
    majPerf();
    if (Number(compteur.innerText) > 0)
        document.getElementById("remove").disabled = false;
}

function remove() {
    var compteur = document.getElementById("compt");
    if (Number(compteur.innerText) > 0) {
        currentSession.nbTaches = Number(compteur.innerText) - 1;
        compteur.innerText = currentSession.nbTaches;
        let snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById("snack"));
        snackbar.show({
            message: "-1"
        });
    }
    // Add temporary end date for currentSession
    currentSession.fin = new Horaire(new Date());
    // Save in cookies current session
    setCookie("current", JSON.stringify(currentSession));
    if (Number(compteur.innerText) <= 0) {
        document.getElementById("remove").disabled = true;
    }
    majPerf();
}

function majPerf() {
    document.getElementById("PF").innerText = precisionRound(Number(document.getElementById("compt").innerText) / (30 * currentSession.getTWInteractif()), 2)
}

window.onbeforeunload = function () {
    return "T'es sûr de vouloir fermer ?";
}

function setCookie(sName, sValue) {
    if (navigator.cookieEnabled) {
        var today = new Date(), expires = new Date();
        expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
    } else {
        alert("Activez vos cookies");
    }

}

function getCookie(sName) {
    if (navigator.cookieEnabled) {
        var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
        if (oRegex.test(document.cookie)) {
            return decodeURIComponent(RegExp["$1"]);
        } else {
            return null;
        }
    } else {
        alert("Activez vos cookies");
    }

}