export interface User {
  idUser?: string;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone: string;
  password?: string;
  role?: string;
  active?: boolean;
  dateCreation?: string;
}
