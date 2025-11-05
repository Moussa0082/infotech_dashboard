import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private router:Router,private fb: FormBuilder,private authService:AuthService,    
    // private messageService: MessageService

  ) {}
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group(
      {
        usernameOrEmail: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
    );
    // this.messageService.add({severity:'success', summary:'Succès', detail:'Test toast en haut à droite'});

  }
  ngOnDestroy() {
  }

  onSubmit(){
    const { usernameOrEmail, password } = this.loginForm.value;
    this.authService.signIn({ usernameOrEmail, password }).subscribe({
      next: (res) => {
        this.authService.saveTokens(res);
        console.log('Réponse backend:', res);
        console.log('Token sauvegardé:', this.authService.getAccessToken());
        console.log('isAuthenticated:', this.authService.isAuthenticated());
        // this.router.navigate(['/dashboard']);
        this.router.navigate(['/dashboard']).then(ok => {
          console.log('Navigation réussie ?', ok);
        });        
        // Affichage du toast succès
        // this.messageService.add({severity:'success', summary:'Succès', detail:'Connexion réussie !'});
      },
      error: (err) => {
        console.error('Erreur connexion', err);
        // Affichage du toast erreur
        // this.messageService.add({severity:'error', summary:'Erreur', detail:'Erreur de connexion, vérifiez vos identifiants.'});
      }
    });
    
  }
}
