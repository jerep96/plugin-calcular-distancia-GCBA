import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InitialListComponent } from './components/initial-list/initial-list.component';
import { NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PesosProxyPipe } from './pipes/pesos-proxy.pipe';
import { DisableDirective } from './directives/disable.directive';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { ContactComponent } from './components/contact/contact.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: InitialListComponent },
  { path: 'contacto', component: ContactComponent },
  { path: '**', redirectTo: '' }  
]

@NgModule({
  declarations: [
    AppComponent,
    InitialListComponent,
    PesosProxyPipe,
    DisableDirective,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    //NgbModule,
    NgbModalModule,
    NgbToastModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [{ provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
