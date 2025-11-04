import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CResponse } from '../models/CResponse';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serviceUrl: string;
  constructor(private http: HttpClient) { 
    this.serviceUrl = environment.apiUrl;
  }

   /** ➕ Créer un utilisateur */
   create(user: User): Observable<CResponse> {
    return this.http.post<CResponse>(`${this.serviceUrl}/create`, user);
  }

  /** ✏️ Mettre à jour un utilisateur */
  update(idUser: string, user: User): Observable<CResponse> {
    return this.http.put<CResponse>(`${this.serviceUrl}/update/${idUser}`, user);
  }

  /** 🔍 Récupérer tous les utilisateurs */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.serviceUrl}/getAllUser`);
  }

  /** 🔍 Récupérer un utilisateur par ID */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.serviceUrl}/getById/${id}`);
  }

  /** 🗑️ Supprimer un utilisateur */
  deleteUser(idUser: string): Observable<CResponse> {
    return this.http.delete<CResponse>(`${this.serviceUrl}/deleteUser/${idUser}`);
  }

  /** 🚫 Désactiver un utilisateur */
  deactivate(idUser: string): Observable<CResponse> {
    return this.http.post<CResponse>(`${this.serviceUrl}/desactivate/${idUser}`, {});
  }

  /** ✅ Activer un utilisateur */
  activate(idUser: string): Observable<CResponse> {
    return this.http.post<CResponse>(`${this.serviceUrl}/activater/${idUser}`, {});
  }

}
