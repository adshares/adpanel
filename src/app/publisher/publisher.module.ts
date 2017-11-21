import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublisherRoutingModule } from './publisher-routing.module';
import { PublisherComponent } from './publisher.component';

@NgModule({
  imports: [
    CommonModule,
    PublisherRoutingModule
  ],
  declarations: [
    PublisherComponent
  ]
})
export class PublisherModule { }
