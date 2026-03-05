import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/User";
import { environment } from "src/environments/environment";

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
  role: string;
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
  providedIn: "root",
})
export class AuthService {
  // Nouveaux champs privés pour stocker les tokens en mémoire
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  public currentUsername: string | null = null;

  private serviceUrl: string;
  private baseUrl: string = "auth";
  constructor(private http: HttpClient) {
    this.serviceUrl = environment.apiUrl;
    this.accessToken = sessionStorage.getItem("token");
    this.refreshToken = sessionStorage.getItem("refreshToken");
    this.currentUsername = sessionStorage.getItem("username");
  }
  /**
   * 1. Connexion de l'utilisateur
   * Endpoint: POST /api-infotech/auth/signin
   */
  signIn(credentials: any): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(
      `${this.serviceUrl}/${this.baseUrl}/signin`,
      credentials
    );
  }

  /**
   * 2. Inscription d'un nouvel utilisateur
   * Endpoint: POST /api-infotech/auth/signup
   */
  signUp(userData: SignupRequest): Observable<User> {
    return this.http.post<User>(
      `${this.serviceUrl}/${this.baseUrl}/signup`,
      userData
    );
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
      Authorization: `Bearer ${refreshToken}`,
    });

    // Le corps de la requête POST est vide ({}) car toutes les infos sont dans le header.
    return this.http.post<RefreshResponse>(
      `${this.serviceUrl}/${this.baseUrl}/refresh`,
      {},
      { headers }
    );
  }

  public saveTokens(response: JwtResponse) {
    this.accessToken = response.token;
    this.refreshToken = response.refreshToken;
    this.currentUsername = response.username;

    // ✅ Sauvegarde complète dans le sessionStorage
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("refreshToken", response.refreshToken);
    sessionStorage.setItem("username", response.username);
    sessionStorage.setItem("email", response.email);

    // Pour la navbar :
    const user = {
      username: response.username,
      email: response.email,
    };
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Efface tous les tokens lors de la déconnexion.
   */
  public signOut() {
    this.accessToken = null;
    this.refreshToken = null;
    this.currentUsername = null;
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("username");
  }

  // public getAccessToken(): string | null {
  //   // Si la variable en mémoire est vide, on tente de la récupérer dans le storage
  //   if (!this.accessToken) {
  //     this.accessToken = sessionStorage.getItem("token");
  //   }
  //   return this.accessToken;
  // }
  public getAccessToken(): string | null {
    // On donne la priorité à la session pour éviter le "null" après un F5
    return sessionStorage.getItem("token");
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem("refreshToken");
  }

  public isAuthenticated(): boolean {
    const token = this.accessToken || sessionStorage.getItem("token");
    const refresh = sessionStorage.getItem("refreshToken");

    return !!token || !!refresh;
  }

  public updateAccessToken(newToken: string) {
    this.accessToken = newToken;
    sessionStorage.setItem("token", newToken);
  }
}
