import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'common/info/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class App404RoutingModule {}
