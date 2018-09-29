class Session {
    constructor(date) {
        this.debut = new Horaire(date);
        this.fin = false;
    }

    end(date, nbTaches) {
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
            "                        " + this.debut.getHeure() + " - " + this.fin.getHeure() + " : " + this.getFinalTW() + " heures\n" +
            "                        <span class=\"mdc-list-item__secondary-text\">\n" +
            "                            " + this.nbTaches + " Tâches\n" +
            "                        </span>\n" +
            "                    </span>\n" +
            "                    <i class=\"mdc-list-item__meta material-icons\" onclick='removeSession(" + this.debut.objet + ")'>delete</i>" +
            "                </li>";
        return li
    }

    isFinished(date) {
        return this.fin != false;
    }

    /**
     * Session.isFinished() should be true
     */
    getFinalTW() {
        var tempsMs = this.fin.objet - this.debut.objet;
        var tempsS = tempsMs / 1000;
        return precisionRound(tempsS / 3600, 2);
    }

    save() {
        if (navigator.cookieEnabled) {
            all_sessions[this.debut.objet] = this;
            let toSave = JSON.stringify(all_sessions);
            setCookie("all_sessions", toSave);
        } else {
            alert("Activez vos cookies")
        }
    }

    getTWInteractif() {
        var tempsMs = Date.now() - this.debut.objet;
        var tempsS = tempsMs / 1000;
        return precisionRound(tempsS / 3600, 2);
    }
}