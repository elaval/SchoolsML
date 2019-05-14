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
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // Main redirect
  {path: '', redirectTo: 'k12/ficha-escolar', pathMatch: 'full'},

  // App views
  {
    path: 'k12', component: basicComponent,
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
  {
    path: 'register', component: basicComponent,
    children: [
      {path: '', component: RegisterComponent},
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
