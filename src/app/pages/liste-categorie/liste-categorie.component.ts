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

  constructor(
    private categorieService: CategorieService,
    private toastr: ToastrService
  ) {}
  categories: Categorie[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.getAll().subscribe(
       (data) => {
        this.categories = data; // selon ton format de réponse
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.toastr.error('Erreur lors du chargement des catégories');
        this.isLoading = false;
      }
    );
  }

  deleteCategorie(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categorieService.delete(id).subscribe(
        (res) => {
          this.toastr.success('Catégorie supprimée');
          this.loadCategories();
        },
        (err) => {
          console.error(err);
          this.toastr.error('Erreur lors de la suppression');
        }
      );
    }
  }

}
