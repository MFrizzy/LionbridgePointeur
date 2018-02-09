class Horaire {
    constructor(date) {
        this.objet = date.getTime()
        this.date = date.toLocaleDateString()
        this.heure = date.getHours()
        this.minutes = date.getMinutes()
    }

    getHeure() {
        var heures = this.heure<10?"0"+this.heure:this.heure;
        var minute = this.minutes<10?"0"+this.minutes:this.minutes
        return heures + ":" + minute
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

    isFinished(date) {
        return this.fin != false;
    }

    save() {
        var a = "oé";
    }

    getTWInteractif() {
        var tempsMs = Date.now() - this.debut.objet
        var tempsS = tempsMs/1000;
        return precisionRound(tempsS/3600,2);
    }
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
        document.getElementById("add").disabled=false;
        document.getElementById("TW").innerText="0.00";
        setInterval(function () {
            document.getElementById("TW").innerText = currentSession.getTWInteractif();
        }, 1000*30)
    }
}

function finish() {
    if (currentSession != null) {
        currentSession.end(new Date());
        document.getElementById("new").disabled = false;
        document.getElementById("finish").disabled = true;
        document.getElementById("DD").innerText = "";
        document.getElementById("add").disabled=true;
        document.getElementById("remove").disabled=true;
        document.getElementById("compt").innerText="0";
        // Faire un recap
        currentSession.save()
        currentSession=null;
    }
}


function add() {
    // ajouter à la current session
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
