import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ListeHeadimageComponent } from 'src/app/pages/liste-headimage/liste-headimage.component';
import { ListeEventComponent } from 'src/app/pages/liste-event/liste-event.component';
import { ListeBlogComponent } from 'src/app/pages/liste-blog/liste-blog.component';
import { ListeCategorieComponent } from 'src/app/pages/liste-categorie/liste-categorie.component';
import { ListeUserComponent } from 'src/app/pages/liste-user/liste-user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'liste-user',           component: ListeUserComponent },
    { path: 'liste-categorie',           component: ListeCategorieComponent },
    { path: 'liste-blog',           component: ListeBlogComponent },
    { path: 'liste-headimage',           component: ListeHeadimageComponent },
    { path: 'liste-event',           component: ListeEventComponent },
];
