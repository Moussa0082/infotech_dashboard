import { Blog } from "./Blog";

export interface Categorie {
    idCategorie:   string;
    nom:           string;
    typeCategorie: string;
    description:   string;
    active:        boolean;
    blogs:         Blog[];
    events:        string[];
}