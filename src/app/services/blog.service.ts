import { Injectable } from '@angular/core';
import { CResponse } from '../models/CResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Blog } from '../models/Blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private serviceUrl: string;
  private baseUrl: string = "blog";
      constructor(private http: HttpClient) { 
        this.serviceUrl = environment.apiUrl;
      }

  /**
   * 1. CRÉATION (avec Fichier Image)
   * Cette méthode est spéciale car elle doit utiliser FormData.
   *
   * @param titre Le titre du blog.
   * @param description La description du blog.
   * @param auteur L'auteur du blog (ID ou nom).
   * @param categorieId L'ID de la catégorie.
   * @param imageFile Le fichier image à uploader (objet File).
   */
  createBlog(
    titre: string,
    description: string,
    auteur: string,
    categorieId: string, // ou number selon votre backend
    imageFile: File
  ): Observable<CResponse> {
    const formData = new FormData();
    
    // Ajoutez tous les champs de texte
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('auteur', auteur);
    formData.append('categorie_id', categorieId);
    
    // Ajoutez le fichier image. Le nom de la clé ('image') doit correspondre au @RequestParam("image")
    formData.append('image', imageFile, imageFile.name); 

    // Angular HttpClient va automatiquement définir l'en-tête Content-Type: multipart/form-data.
    return this.http.post<CResponse>(`${this.serviceUrl}/${this.baseUrl}/create`, formData);
  }

  /**
   * 2. MISE À JOUR (PUT)
   * Note : Votre contrôleur utilise @RequestBody pour la mise à jour, ce qui n'inclut PAS le fichier.
   * Si vous voulez mettre à jour l'image, vous devrez adapter ce service et le contrôleur.
   */
  updateBlog(idBlog: string, blogData: Partial<Blog>): Observable<CResponse> {
    // Partial<Blog> permet d'envoyer uniquement les champs modifiés
    return this.http.put<CResponse>(`${this.serviceUrl}/${this.baseUrl}/update/${idBlog}`, blogData);
  }

  /**
   * 3. LECTURE - Tous les Blogs
   */
  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.serviceUrl}/${this.baseUrl}/getAllBlog`);
  }

  /**
   * 4. LECTURE - Blog par ID
   */
  getBlogById(idBlog: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.serviceUrl}/${this.baseUrl}/getById/${idBlog}`);
  }

  /**
   * 5. LECTURE - Blogs par Catégorie
   */
  getBlogByCategory(idCategorie: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.serviceUrl}/${this.baseUrl}/getBlogByCategory/${idCategorie}`);
  }

  /**
   * 6. SUPPRESSION (DELETE)
   */
  deleteBlog(idBlog: string): Observable<CResponse> {
    return this.http.delete<CResponse>(`${this.serviceUrl}/${this.baseUrl}/delete/${idBlog}`);
  }

  /**
   * 7. DÉSACTIVATION (POST)
   */
  deactivateBlog(idBlog: string): Observable<CResponse> {
    return this.http.post<CResponse>(`${this.serviceUrl}/${this.baseUrl}/desactivate/${idBlog}`, {});
  }

  /**
   * 8. ACTIVATION (POST)
   */
  activateBlog(idBlog: string): Observable<CResponse> {
    return this.http.post<CResponse>(`${this.serviceUrl}/${this.baseUrl}/activate/${idBlog}`, {});
  }
}
