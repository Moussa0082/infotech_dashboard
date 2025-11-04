import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categorie } from '../models/Categorie';
import { Observable } from 'rxjs';
import { CResponse } from '../models/CResponse';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private serviceUrl: string;
    constructor(private http: HttpClient) { 
      this.serviceUrl = environment.apiUrl;
    }

    /** ➕ Créer une catégorie */
    create(categorie: Categorie): Observable<CResponse> {
      return this.http.post<CResponse>(`${this.serviceUrl}/create`, categorie);
    }
  
    /** ✏️ Mettre à jour une catégorie */
    update(idCategorie: string, categorie: Categorie): Observable<CResponse> {
      return this.http.put<CResponse>(`${this.serviceUrl}/update/${idCategorie}`, categorie);
    }
  
    /** 🔍 Récupérer toutes les catégories */
    getAll(): Observable<Categorie[]> {
      return this.http.get<Categorie[]>(`${this.serviceUrl}/getAllCategorie`);
    }
  
    /** 🔍 Récupérer une catégorie par ID */
    getById(idCategorie: string): Observable<Categorie> {
      return this.http.get<Categorie>(`${this.serviceUrl}/getById/${idCategorie}`);
    }
  
    /** 🗑️ Supprimer une catégorie */
    delete(idCategorie: string): Observable<void> {
      return this.http.delete<void>(`${this.serviceUrl}/delete/${idCategorie}`);
    }
  
    /** 🚫 Désactiver une catégorie */
    deactivate(idCategorie: string): Observable<void> {
      return this.http.post<void>(`${this.serviceUrl}/${idCategorie}/deactivater`, {});
    }
  
    /** ✅ Activer une catégorie */
    activate(idCategorie: string): Observable<void> {
      return this.http.post<void>(`${this.serviceUrl}/${idCategorie}/activater`, {});
    }
  
    /** 🔎 Trouver les catégories par type (TypeCategorie enum côté backend) */
    findByType(typeCategorie: string): Observable<Categorie[]> {
      return this.http.get<Categorie[]>(`${this.serviceUrl}/findByTypeCategrie/${typeCategorie}`);
    }
}
