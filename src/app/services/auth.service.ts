import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from 'src/environments/environment';


// 1. Requête de connexion (LoginRequest)
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

// 2. Requête d'inscription (SignupRequest)
interface SignupRequest {
  // Ajoutez tous les champs nécessaires ici, basés sur votre User/SignupRequest DTO côté Spring
  username: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

// 3. Réponse de Connexion (JwtResponse)
interface JwtResponse {
  token: string; // Le JWT d'accès principal
  type: string; // "Bearer"
  username: string;
  email: string;
  refreshToken: string; // Le jeton pour renouveler la session
}

// 4. Réponse de Rafraîchissement de Token (/refresh)
interface RefreshResponse {
  token: string; // Le nouveau JWT d'accès
  type: string; // "Bearer"
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // Nouveaux champs privés pour stocker les tokens en mémoire
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  public currentUsername: string | null = null;


    private serviceUrl: string;
    constructor(private http: HttpClient) { 
      this.serviceUrl = environment.apiUrl;
    }
  /**
   * 1. Connexion de l'utilisateur
   * Endpoint: POST /api-infotech/auth/signin
   */
  signIn(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.serviceUrl}/signin`, credentials);
  }

  /**
   * 2. Inscription d'un nouvel utilisateur
   * Endpoint: POST /api-infotech/auth/signup
   */
  signUp(userData: SignupRequest): Observable<User> {
    return this.http.post<User>(`${this.serviceUrl}/signup`, userData);
  }

  /**
   * 3. Renouvellement du Token d'Accès
   * Endpoint: POST /api-infotech/auth/refresh
   * Le token est envoyé via le header Authorization.
   *
   * @param refreshToken Le jeton de rafraîchissement stocké.
   */
   public refreshTokens(refreshToken: string): Observable<RefreshResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    // Le corps de la requête POST est vide ({}) car toutes les infos sont dans le header.
    return this.http.post<RefreshResponse>(`${this.serviceUrl}/refresh`, {}, { headers });
  }

  // --- Fonctions utilitaires (stockage sécurisé en mémoire) ---

  /**
   * Méthode pour stocker les tokens en mémoire de session du service (plus sécurisé que localStorage).
   *
   * @param response La réponse de connexion contenant les tokens.
   */
  public saveTokens(response: JwtResponse) {
    this.accessToken = response.token;
    this.refreshToken = response.refreshToken;
    this.currentUsername = response.username;
    // Pour persister le refreshToken entre les rechargements de page, on utilise le sessionStorage (plus sûr que localStorage).
    // Idéalement, le refreshToken devrait être dans un cookie HTTP-only géré par le backend.
    sessionStorage.setItem('refreshToken', response.refreshToken);
    sessionStorage.setItem('username', response.username);
  }

  /**
   * Efface tous les tokens lors de la déconnexion.
   */
  public signOut() {
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUsername = null;
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('username');
  }

  /**
   * Récupère le jeton d'accès (accessToken) depuis la mémoire du service.
   */
  public getAccessToken(): string | null {
    // Si l'accessToken est en mémoire, on le renvoie.
    return this.accessToken;
  }

  /**
   * Récupère le jeton de rafraîchissement (refreshToken) depuis le sessionStorage.
   */
  public getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  /**
   * Vérifie si l'utilisateur est authentifié.
   */
  public isAuthenticated(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken();
  }

}
