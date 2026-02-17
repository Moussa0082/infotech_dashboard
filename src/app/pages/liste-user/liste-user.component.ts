import { Component, inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Categorie } from "src/app/models/Categorie";
import { User } from "src/app/models/User";
import { CategorieService } from "src/app/services/categorie.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-liste-user",
  templateUrl: "./liste-user.component.html",
  styleUrls: ["./liste-user.component.scss"],
})
export class ListeUserComponent implements OnInit {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  users: User[] = [];

  form: any = {
    id: "",
    nom: "",
    prenom: "",
    username: "",
    email: "",
    telephone: "",
    password: "",
    role: "USER",
    active: true,
  };

  isEdit = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: () => this.toastr.error("Impossible de charger les utilisateurs"),
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.userService.update(this.form.id, this.form).subscribe({
        next: () => {
          this.toastr.success("Utilisateur mis à jour");
          this.resetForm();
          this.loadUsers();
        },
      });
    } else {
      this.userService.create(this.form).subscribe({
        next: () => {
          this.toastr.success("Utilisateur créé avec succès");
          this.resetForm();
          this.loadUsers();
        },
      });
    }
  }

  prepareEdit(user: User) {
    this.isEdit = true;
    // On ne copie pas le mot de passe par sécurité lors de l'édition
    this.form = { ...user, password: "" };
  }

  toggleStatus(user: any) {
    const action = user.active
      ? this.userService.deactivate(user.id)
      : this.userService.activate(user.id);
    action.subscribe({
      next: () => {
        this.toastr.info(`Statut de ${user.identifiant} mis à jour`);
        this.loadUsers();
      },
    });
  }

  onDelete(id: string) {
    if (confirm("Supprimer cet utilisateur définitivement ?")) {
      this.userService.deleteUser(id).subscribe(() => {
        this.toastr.warning("Utilisateur supprimé");
        this.loadUsers();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.form = {
      id: "",
      nom: "",
      prenom: "",
      username: "",
      email: "",
      telephone: "",
      password: "",
      role: "USER",
      active: true,
    };
  }
}
