import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Categorie } from 'src/app/models/Categorie';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-liste-categorie',
  templateUrl: './liste-categorie.component.html',
  styleUrls: ['./liste-categorie.component.scss']
})
export class ListeCategorieComponent implements OnInit {
  categories: Categorie[] = [];
  isLoading = true;

  constructor(
    private categorieService: CategorieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
        console.log("Data chargé :", data);
        this.toastr.success('Catégories chargées avec succès');
      },
      error: (err) => {
        console.error("Erreur détaillée :", err);
        this.isLoading = false;
        
        // Better error handling
        if (err.status === 0) {
          this.toastr.error('Impossible de se connecter au serveur');
        } else if (err.status === 401) {
          this.toastr.error('Authentification requise');
        } else if (err.status === 403) {
          this.toastr.error('Accès non autorisé');
        } else {
          this.toastr.error('Erreur lors du chargement des catégories');
        }
      }
    });
  }

  reload(): void {
    this.loadCategories(); 
  }

  editCategorie(cat: Categorie): void {
    this.toastr.info(`Modification de ${cat.nom}`);
    // Implémentez la logique de modification ici
  }

  deleteCategorie(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categorieService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Catégorie supprimée avec succès');
          this.loadCategories();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }
}