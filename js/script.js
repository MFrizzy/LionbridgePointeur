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
all_sessions.forEach = function(fonction) {
    all_sessions_keys = Object.keys(all_sessions);
    i = 0;
    while (i < all_sessions_keys.length) {
        current = all_sessions[all_sessions_keys[i]];
        if(current != all_sessions.forEach) {
            fonction(current);
        }
        i++;
    }
};



/*
all_sessions.forEach(function (element) {
    element.debut.getHeure = modelHoraire.getHeure();
    element.fin.getHeure = modelHoraire.getHeure();
    element.generateLi = modelSession.generateLi();
    element.getFinalTW = modelSession.getFinalTW();
});
*/

today_sessions = [];

all_sessions.forEach(function(current) {
    if (current.debut.date == today) {
        today_sessions.push(current);
    }
    current.debut.getHeure = modelHoraire.getHeure;
    current.fin.getHeure = modelHoraire.getHeure;
    current.generateLi = modelSession.generateLi;
    current.getFinalTW = modelSession.getFinalTW;
    document.getElementById("histoj").innerHTML += current.generateLi();
});

updateAll();

function updateAll() {
    totalSecondes = 0;
    totalTaches = 0;

    // Nettoyage sale de historique du jour
    document.getElementById("histoj").innerHTML = "";

    all_sessions.forEach(function(current) {
        if(current.debut.date == today) {
            document.getElementById("histoj").innerHTML += current.generateLi();
            totalSecondes += current.fin.objet - current.debut.objet;
            totalTaches += Number(current.nbTaches);
        }
    });

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
    let compteur = document.getElementById("compt");
    compteur.innerText = Number(compteur.innerText) + 1;
    let snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById("snack"));
    snackbar.show({
            message: "+1"
        }
    );
    majPerf();
    if (Number(compteur.innerText) > 0)
        document.getElementById("remove").disabled = false;
}

function remove() {
    var compteur = document.getElementById("compt");
    if (Number(compteur.innerText) > 0) {
        compteur.innerText = Number(compteur.innerText) - 1;
        let snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById("snack"));
        snackbar.show({
            message: "-1"
        });
    }
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
    var today = new Date(), expires = new Date();
    expires.setTime(today.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
}

function getCookie(sName) {
    var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");

    if (oRegex.test(document.cookie)) {
        return decodeURIComponent(RegExp["$1"]);
    } else {
        return null;
    }
}