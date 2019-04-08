import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { basicComponent } from './components/common/layouts/basic.component';
import { blankComponent } from './components/common/layouts/blank.component';
import { DestinoESComponent } from './views/destino-es/destino-es.component';
import { OrigenESComponent } from './views/origen-es/origen-es.component';
import { FichaEscolarComponent } from './views/ficha-escolar/ficha-escolar.component';

const routes: Routes = [
  // Main redirect
  {path: '', redirectTo: 'carrera/ficha-escolar', pathMatch: 'full'},

  // App views
  {
    path: 'carrera', component: basicComponent,
    children: [
      {path: 'ficha-escolar', component: FichaEscolarComponent},
    ]
  },

  {
    path: 'login', component: basicComponent,
    children: [
      {path: '', component: LoginComponent},
    ]
  },
  //{ path: 'main', component: MainComponent },
  //{ path: 'home', component: HomeComponent },
  //{ path: 'login', component: LoginComponent },
  //{ path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
