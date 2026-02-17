import { Component, inject, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, forkJoin, map, of } from "rxjs";
import { HeadImage } from "src/app/models/HeadImage";
import { HeadImageService } from "src/app/services/head-image.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: "app-liste-headimage",
  templateUrl: "./liste-headimage.component.html",
  styleUrls: ["./liste-headimage.component.scss"],
})
export class ListeHeadimageComponent implements OnInit {
  private headService = inject(HeadImageService);
  private toastr = inject(ToastrService);
  private utils = inject(UtilsService);

  headImages: HeadImage[] = [];
  form = { id: "", pageName: "", description: "" };
  selectedFile: File | null = null;
  fileName = "";
  isEdit = false;

  pagesToManage = [
    "Home",
    "Contact",
    "Blog",
    "Event",
    "About1",
    "About2",
    "About3",
  ];

  ngOnInit() {
    this.loadAllHeadImages();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileName = this.selectedFile?.name || "";
    }
  }

  onSubmit() {
    if (this.isEdit) {
      if (!this.form.id) {
        this.toastr.error("Erreur : ID de l'image introuvable.");
        return;
      }
      this.headService
        .updateHeadImage(
          this.form.id,
          this.form.description,
          this.selectedFile!
        )
        .subscribe({
          next: () => {
            this.toastr.success("Bannière mise à jour");
            this.resetForm();
            this.loadAllHeadImages();
          },
        });
    } else {
      if (!this.selectedFile) {
        this.toastr.warning(
          "Veuillez sélectionner une image avant d'enregistrer."
        );
        return;
      }
      this.headService
        .createHeadImage(
          this.form.pageName,
          this.form.description,
          this.selectedFile
        )
        .subscribe({
          next: () => {
            this.toastr.success("Bannière créée");
            // this.resetForm();
            this.loadAllHeadImages();
          },
          error: (err) => {
            console.error("ERREUR SERVEUR :", err);
            this.toastr.error(
              "Erreur : " +
                (err.error?.message || "Vérifiez votre connexion au serveur")
            );
          },
        });
    }
  }

  prepareEdit(head: HeadImage) {
    this.isEdit = true;
    this.form = {
      id: head.idHeadImage,
      pageName: head.pageName,
      description: head.description,
    };
    this.fileName = "";
    this.selectedFile = null;
  }

  onDelete(id: string) {
    if (confirm("Supprimer cette bannière ?")) {
      this.headService.deleteHeadImage(id).subscribe(() => {
        this.toastr.warning("Bannière supprimée");
        this.loadAllHeadImages();
      });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.form = { id: "", pageName: "", description: "" };
    this.selectedFile = null;
    this.fileName = "";
  }

  loadAllHeadImages() {
    const requests = this.pagesToManage.map((page) =>
      this.headService.getHeadImageByPage(page).pipe(
        // Extraction de l'objet niché 'headImage' vu dans ta capture JSON
        map((response) =>
          response && response.headImage ? response.headImage : null
        ),
        // On capture l'erreur 404 pour que forkJoin ne s'arrête pas
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        this.headImages = results.filter((img) => img !== null);
        console.log("Images chargées :", this.headImages);
      },
    });
  }

  getImageUrl(path: string) {
    return this.utils.getImageUrl(path);
  }
}
