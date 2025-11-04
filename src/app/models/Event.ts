import { Categorie } from "./Categorie";

export interface Event {
    idEvent:        string;
    titre:          string;
    description:    string;
    image:          string;
    dateCreation:   string;
    dateDebutEvent: string;
    dateFinEvent:   string;
    lieu:           string;
    organisateur:   string;
    categorie:      Categorie;
    active:         boolean;
}
