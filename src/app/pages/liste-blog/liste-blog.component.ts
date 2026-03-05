import { Component, inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Blog } from "src/app/models/Blog";
import { Categorie } from "src/app/models/Categorie";
import { BlogService } from "src/app/services/blog.service";
import { CategorieService } from "src/app/services/categorie.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-liste-blog",
  templateUrl: "./liste-blog.component.html",
  styleUrls: ["./liste-blog.component.scss"],
})
export class ListeBlogComponent implements OnInit {
  private blogService = inject(BlogService);
  private catService = inject(CategorieService);
  private toastr = inject(ToastrService);
  public utils = inject(UtilsService);

  blogs: Blog[] = [];
  categories: Categorie[] = [];

  // Formulaire
  form: any = {
    idBlog: "",
    titre: "",
    description: "",
    auteur: "",
    categorieId: "",
  };

  selectedFile: File | null = null;
  fileName = "";
  isEdit = false;

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

  loadBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => (this.blogs = data),
      error: () => this.toastr.error("Erreur de chargement des articles"),
    });
  }

  loadCategories() {
    // On filtre pour ne prendre que les catégories de type BLOG si nécessaire
    this.catService.getAll().subscribe((data) => (this.categories = data));
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile?.name || "";
    }
  }

  onSubmit() {
    const { titre, description, auteur, categorieId, idBlog } = this.form;

    if (this.isEdit) {
      // Pour l'update, votre service attend un Partial<Blog> (JSON)
      const blogUpdate: Partial<Blog> = { titre, description, auteur };
      this.blogService.updateBlog(idBlog, blogUpdate).subscribe({
        next: () => {
          this.toastr.success("Article mis à jour");
          this.resetForm();
          this.loadBlogs();
        },
      });
    } else {
      if (!this.selectedFile) {
        this.toastr.warning("Image obligatoire pour la création");
        return;
      }
      this.blogService
        .createBlog(titre, description, auteur, categorieId, this.selectedFile)
        .subscribe({
          next: () => {
            this.toastr.success("Article publié");
            this.resetForm();
            this.loadBlogs();
          },
        });
    }
  }

  prepareEdit(blog: Blog) {
    this.isEdit = true;
    this.form = {
      idBlog: blog.idBlog,
      titre: blog.titre,
      description: blog.description,
      auteur: blog.auteur,
      categorieId: blog.categorie ? (blog.categorie as any).idCategorie : "",
    };
  }

  toggleStatus(blog: Blog) {
    const action = blog.active
      ? this.blogService.deactivateBlog(blog.idBlog)
      : this.blogService.activateBlog(blog.idBlog);
    action.subscribe(() => {
      this.toastr.info("Statut modifié");
      this.loadBlogs();
    });
  }

  onDelete(id: string) {
    if (confirm("Supprimer cet article ?")) {
      this.blogService.deleteBlog(id).subscribe(() => {
        this.toastr.warning("Article supprimé");
        this.loadBlogs();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.form = {
      idBlog: "",
      titre: "",
      description: "",
      auteur: "",
      categorieId: "",
    };
    this.selectedFile = null;
    this.fileName = "";
  }
}
