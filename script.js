//heure = document.getElementById("heure");
h = new Date();
console.log(h);
console.log("Mois : " + h.getMonth() + 1);
console.log("Jour : " + h.getDay());
console.log("minutes : " + h.getMinutes());
console.log("heure : " + h.getHours());

//date = h.toLocaleDateString() + " " + h.getHours() + ":" + h.getMinutes()
console.log(h.getTime())
//heure.innerHTML = date;

class Horaire {
    constructor(date) {
        this.objet = date.getTime()
        this.date = date.toLocaleDateString()
        this.heure = date.getHours()
        this.minutes = date.getMinutes()
    }

    getHeure() {
        return this.heure + ":" + this.minutes
    }
}

class Session {
    constructor(date) {
        this.debut = new Horaire(date);
        this.fin = false;
    }

    end(date) {
        this.fin = new Horaire(date);
    }

    resume() {
        this.fin = false;
    }

    isFinished(date) {
        return this.fin != false;
    }

    save() {
        var a = "oé";
    }

    getTWInteractif() {
        var tempsMs = Date.now() - this.debut.objet
        var tempsS = tempsMs/1000;
        return Math.round(tempsS/3600,2);
    }
}

var currentSession = null;

function nouveau() {
    if (currentSession == null) {
        currentSession = new Session(new Date());
        document.getElementById("new").disabled = true;
        document.getElementById("resume").disabled = true;
        document.getElementById("finish").disabled = false;
        document.getElementById("DD").innerText = currentSession.debut.getHeure();
        setInterval(function () {
            document.getElementById("TW").innerText = currentSession.getTWInteractif();
        }, 1000*60)
    }
}

function finish() {
    if (currentSession != null) {
        currentSession.end(new Date());
        document.getElementById("new").disabled = false;
        document.getElementById("resume").disabled = false;
        document.getElementById("finish").disabled = true;
        document.getElementById("DD").innerText = "";
        currentSession.save()
    }
}

function resume() {
    if (currentSession != null) {
        currentSession.resume();
        document.getElementById("new").disabled = true;
        document.getElementById("resume").disabled = true;
        document.getElementById("finish").disabled = false;
    }
}

function add() {
    var compteur = document.getElementById("compt");
    compteur.innerText = Number(compteur.innerText) + 1;
    if (Number(compteur.innerText) > 0)
        document.getElementById("remove").disabled = false;
}

function remove() {
    var compteur = document.getElementById("compt");
    if (Number(compteur.innerText) > 0) {
        compteur.innerText = Number(compteur.innerText) - 1;
    }
    if (Number(compteur.innerText) <= 0) {
        document.getElementById("remove").disabled = true;
    }
}
