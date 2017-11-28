import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherComponent } from './publisher.component';
import { PublisherGuard } from './publisher-guard.service';

@NgModule({
  imports: [
    CommonModule,
    PublisherRoutingModule
  ],
  providers: [
    PublisherGuard
  ],
  declarations: [
    PublisherComponent
  ]
})
export class PublisherModule { }
