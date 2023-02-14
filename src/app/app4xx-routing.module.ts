import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error4xxComponent } from 'common/info/page-not-found/error4xx.component';
import { HTTP_FORBIDDEN, HTTP_NOT_FOUND } from 'common/utilities/codes';

const appRoutes: Routes = [
  { path: '403', component: Error4xxComponent, data: { code: HTTP_FORBIDDEN } },
  { path: '404', component: Error4xxComponent, data: { code: HTTP_NOT_FOUND } },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class App4xxRoutingModule {}
