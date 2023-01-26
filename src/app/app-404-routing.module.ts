import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'common/info/page-not-found/page-not-found.component';
import { HTTP_FORBIDDEN, HTTP_NOT_FOUND } from 'common/utilities/codes';

const appRoutes: Routes = [
  { path: '403', component: PageNotFoundComponent, data: { code: HTTP_FORBIDDEN } },
  { path: '404', component: PageNotFoundComponent, data: { code: HTTP_NOT_FOUND } },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
//TODO Rename module to App4xxRoutingModule after styling
export class App404RoutingModule {}
