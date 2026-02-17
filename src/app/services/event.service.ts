import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { CResponse } from "../models/CResponse";
import { Observable } from "rxjs";
import { Event } from "../models/Event";

@Injectable({
  providedIn: "root",
})
export class EventService {
  private serviceUrl: string;
  private baseUrl: string = "event";
  constructor(private http: HttpClient) {
    this.serviceUrl = environment.apiUrl;
  }
  /**
   * Crée un nouvel événement en utilisant multipart/form-data.
   * @param titre Le titre de l'événement.
   * @param description La description de l'événement.
   * @param lieu Le lieu de l'événement.
   * @param dateDebut La date de début.
   * @param dateFin La date de fin.
   * @param categorieId L'ID de la catégorie.
   * @param imageFile Le fichier image (optionnel).
   */
  createEvent(
    titre: string,
    description: string,
    lieu: string,
    dateDebut: string,
    organisateur: string,
    dateFin: string,
    categorieId: string,
    imageFile: File | null
  ): Observable<CResponse> {
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("organisateur", organisateur);
    formData.append("lieu", lieu);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("idCategorie", categorieId);
    formData.append("active", "true");

    // Ajoute le fichier image s'il existe
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    }

    // Le Content-Type est automatiquement défini sur multipart/form-data par Angular
    return this.http.post<CResponse>(
      `${this.serviceUrl}/${this.baseUrl}/create`,
      formData
    );
  }

  /**
   * Met à jour un événement existant en utilisant multipart/form-data.
   * Le backend gère la suppression/mise à jour de l'ancienne image si une nouvelle est fournie.
   */
  updateEvent(
    idEvent: string,
    titre: string,
    description: string,
    organisateur: string,
    lieu: string,
    dateDebut: string,
    dateFin: string,
    categorieId: string,
    imageFile: File | null
  ): Observable<CResponse> {
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("organisateur", organisateur);
    formData.append("lieu", lieu);
    formData.append("dateDebut", dateDebut);
    formData.append("dateFin", dateFin);
    formData.append("categorie_id", categorieId);

    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    }

    return this.http.put<CResponse>(
      `${this.serviceUrl}/${this.baseUrl}/update/${idEvent}`,
      formData
    );
  }

  /**
   * Récupère tous les événements.
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${this.serviceUrl}/${this.baseUrl}/getAllEvent`
    );
  }

  /**
   * Récupère un événement par son ID.
   */
  getEventById(idEvent: string): Observable<Event> {
    return this.http.get<Event>(
      `${this.serviceUrl}/${this.baseUrl}/getById/${idEvent}`
    );
  }

  /**
   * Récupère les événements par ID de catégorie.
   */
  getEventsByCategory(idCategorie: string): Observable<Event[]> {
    return this.http.get<Event[]>(
      `${this.serviceUrl}/${this.baseUrl}/getEventByCategory/${idCategorie}`
    );
  }

  /**
   * Supprime un événement.
   */
  deleteEvent(idEvent: string): Observable<CResponse> {
    return this.http.delete<CResponse>(
      `${this.serviceUrl}/${this.baseUrl}/delete/${idEvent}`
    );
  }

  /**
   * Désactive un événement.
   */
  deactivateEvent(idEvent: string): Observable<CResponse> {
    return this.http.post<CResponse>(
      `${this.serviceUrl}/${this.baseUrl}/desactivate/${idEvent}`,
      {}
    );
  }

  /**
   * Active un événement.
   */
  activateEvent(idEvent: string): Observable<CResponse> {
    return this.http.post<CResponse>(
      `${this.serviceUrl}/${this.baseUrl}/activate/${idEvent}`,
      {}
    );
  }
}
