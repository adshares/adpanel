import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublisherComponent } from './publisher.component';
import { PublisherGuard } from './publisher-guard.service';

const publisherRoutes: Routes = [
  { path: 'publisher', component: PublisherComponent, canActivate: [PublisherGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(publisherRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PublisherRoutingModule { }
