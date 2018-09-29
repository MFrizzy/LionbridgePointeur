class Horaire {
    constructor(date) {
        this.objet = date.getTime();
        this.date = date.toLocaleDateString();
        this.heure = date.getHours();
        this.minutes = date.getMinutes();
    }

    getHeure() {
        var heures = this.heure < 10 ? "0" + this.heure : this.heure;
        var minute = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        return heures + ":" + minute;
    }
}
