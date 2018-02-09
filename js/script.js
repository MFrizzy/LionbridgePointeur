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

    end(date,nbTaches) {
        this.fin = new Horaire(date);
        this.nbTaches = nbTaches;
    }
    /**
     * Session.isFinished() should be true
     */
    generateLi() {
        var li = "<li class=\"mdc-list-item\">\n" +
            "                    <i class=\"mdc-list-item__graphic material-icons\" aria-hidden=\"true\">keyboard_arrow_right</i>\n" +
            "                    <span class=\"mdc-list-item__text\">\n" +
            "                        "+this.debut.getHeure()+" - "+this.fin.getHeure()+" : "+this.getFinalTW()+" heures\n" +
            "                        <span class=\"mdc-list-item__secondary-text\">\n" +
            "                            "+this.nbTaches+" Tâches\n" +
            "                        </span>\n" +
            "                    </span>\n" +
            "                </li>"
        return li
    }

    isFinished(date) {
        return this.fin != false;
    }

    /**
     * Session.isFinished() should be true
     */
    getFinalTW() {
        var tempsMs = this.fin.objet - this.debut.objet
        var tempsS = tempsMs/1000;
        return precisionRound(tempsS/3600,2);
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
            document.getElementById("PF").innerText = Number(document.getElementById("compt").innerText)/(30*currentSession.getTWInteractif())
            document.getElementById("TW").innerText = currentSession.getTWInteractif();
        }, 1000*30)
    }
}

function finish() {
    if (currentSession != null) {
        currentSession.end(new Date(),document.getElementById("compt").innerText);
        document.getElementById("new").disabled = false;
        document.getElementById("finish").disabled = true;
        document.getElementById("DD").innerText = "";
        document.getElementById("add").disabled=true;
        document.getElementById("remove").disabled=true;
        document.getElementById("histoj").innerHTML+=currentSession.generateLi();
        document.getElementById("compt").innerText="0";
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


