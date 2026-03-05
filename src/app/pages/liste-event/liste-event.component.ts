import { Component, inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Categorie } from "src/app/models/Categorie";
import { Event } from "src/app/models/Event";
import { CategorieService } from "src/app/services/categorie.service";
import { EventService } from "src/app/services/event.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-liste-event",
  templateUrl: "./liste-event.component.html",
  styleUrls: ["./liste-event.component.scss"],
})
export class ListeEventComponent implements OnInit {
  private eventService = inject(EventService);
  private catService = inject(CategorieService);
  private toastr = inject(ToastrService);
  public utils = inject(UtilsService);

  events: Event[] = [];
  categories: Categorie[] = [];

  // Gestion du formulaire
  form: any = {
    idEvent: "",
    titre: "",
    description: "",
    organisateur: "",
    lieu: "",
    dateDebut: "",
    dateFin: "",
    categorieId: "",
  };
  selectedFile: File | null = null;
  fileName = "";
  isEdit = false;

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) =>
        this.toastr.error("Erreur lors du chargement des événements"),
    });
  }

  loadCategories() {
    this.catService.getAll().subscribe((data) => (this.categories = data));
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile?.name || "";
    }
  }

  onSubmit() {
    const {
      titre,
      description,
      lieu,
      dateDebut,
      dateFin,
      organisateur,
      categorieId,
      idEvent,
    } = this.form;

    if (this.isEdit) {
      this.eventService
        .updateEvent(
          idEvent,
          titre,
          description,
          lieu,
          dateDebut,
          categorieId,
          dateFin,
          organisateur,
          this.selectedFile
        )
        .subscribe({
          next: () => {
            this.toastr.success("Événement mis à jour");
            this.resetForm();
            this.loadEvents();
          },
        });
    } else {
      this.eventService
        .createEvent(
          titre,
          description,
          lieu,
          dateDebut,
          categorieId,
          dateFin,
          organisateur,
          this.selectedFile
        )
        .subscribe({
          next: () => {
            this.toastr.success("Événement créé");
            this.resetForm();
            this.loadEvents();
          },
        });
    }
  }

  prepareEdit(event: Event) {
    this.isEdit = true;
    this.form = {
      idEvent: event.idEvent,
      titre: event.titre,
      description: event.description,
      organisateur: event.organisateur,
      lieu: event.lieu,
      dateDebut: event.dateDebutEvent,
      dateFin: event.dateFinEvent,
      categorieId: event.categorie.idCategorie,
    };
  }

  onDelete(id: string) {
    if (confirm("Supprimer cet événement ?")) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.toastr.warning("Événement supprimé");
        this.loadEvents();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.form = {
      idEvent: "",
      titre: "",
      description: "",
      organisateur: "",
      lieu: "",
      dateDebut: "",
      dateFin: "",
      categorieId: "",
    };
    this.selectedFile = null;
    this.fileName = "";
  }
}
