import { Component, inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Categorie } from "src/app/models/Categorie";
import { CategorieService } from "src/app/services/categorie.service";

@Component({
  selector: "app-liste-categorie",
  templateUrl: "./liste-categorie.component.html",
  styleUrls: ["./liste-categorie.component.scss"],
})
export class ListeCategorieComponent implements OnInit {
  private categorieService = inject(CategorieService);
  private toastr = inject(ToastrService);

  categories: Categorie[] = [];

  typesDisponibles = ["EVENT", "BLOG", "FORMATION", "AUTRE"];

  form: any = {
    idCategorie: "",
    nom: "",
    typeCategorie: "EVENT",
    description: "",
    active: true,
    blogs: [],
    events: [],
  };

  isEdit = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: () => this.toastr.error("Erreur de chargement des catégories"),
    });
  }

  onSubmit() {
    //crée une copie propre des données pour ne pas polluer l'affichage
    const payload = { ...this.form };

    if (this.isEdit) {
      // LOGIQUE UPDATE
      this.categorieService.update(payload.idCategorie, payload).subscribe({
        next: () => {
          this.toastr.success("Catégorie mise à jour");
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => this.toastr.error("Erreur lors de la modification"),
      });
    } else {
      // LOGIQUE CRÉATION
      delete payload.idCategorie;
      payload.blogs = [];
      payload.events = [];

      this.categorieService.create(payload).subscribe({
        next: () => {
          this.toastr.success("Catégorie créée avec succès");
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Erreur : Vérifiez si le nom existe déjà");
        },
      });
    }
  }

  prepareEdit(cat: Categorie) {
    this.isEdit = true;
    // On clone l'objet pour éviter les modifications par référence dans la liste
    this.form = { ...cat };
  }

  toggleStatus(cat: Categorie) {
    const action = cat.active
      ? this.categorieService.deactivate(cat.idCategorie)
      : this.categorieService.activate(cat.idCategorie);

    action.subscribe({
      next: () => {
        this.toastr.info(`Statut mis à jour : ${cat.nom}`);
        this.loadCategories();
      },
    });
  }

  onDelete(id: string) {
    if (confirm("Supprimer cette catégorie ?")) {
      this.categorieService.delete(id).subscribe(() => {
        this.toastr.warning("Catégorie supprimée");
        this.loadCategories();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.form = {
      idCategorie: null, // Utiliser null plutôt que ""
      nom: "",
      typeCategorie: "EVENT",
      description: "",
      active: true,
      blogs: [],
      events: [],
    };
  }
}
