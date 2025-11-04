import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ListeUserComponent } from './pages/liste-user/liste-user.component';
import { ListeCategorieComponent } from './pages/liste-categorie/liste-categorie.component';
import { ListeBlogComponent } from './pages/liste-blog/liste-blog.component';
import { ListeEventComponent } from './pages/liste-event/liste-event.component';
import { ListeHeadimageComponent } from './pages/liste-headimage/liste-headimage.component';
import { AddUpUserComponent } from './pages/add-up-user/add-up-user.component';
import { AddUpCategorieComponent } from './pages/add-up-categorie/add-up-categorie.component';
import { AddUpHeadeimageComponent } from './pages/add-up-headeimage/add-up-headeimage.component';
import { AddUpBlogComponent } from './pages/add-up-blog/add-up-blog.component';
import { AddUpEventComponent } from './pages/add-up-event/add-up-event.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ListeUserComponent,
    ListeCategorieComponent,
    ListeBlogComponent,
    ListeEventComponent,
    ListeHeadimageComponent,
    AddUpUserComponent,
    AddUpCategorieComponent,
    AddUpHeadeimageComponent,
    AddUpBlogComponent,
    AddUpEventComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
