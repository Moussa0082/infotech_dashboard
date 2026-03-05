import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private apiUrl = environment.apiUrl;

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${this.apiUrl}/${cleanPath}`;
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
  }
}
