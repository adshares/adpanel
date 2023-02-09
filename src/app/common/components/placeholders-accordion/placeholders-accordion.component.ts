import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholders-accordion',
  templateUrl: './placeholders-accordion.component.html',
})
export class PlaceholdersAccordionComponent {
  readonly PLACEHOLDERS = [
    { id: '{aid}', description: 'server id' },
    { id: '{pid}', description: 'publisher id' },
    { id: '{sid}', description: 'site id' },
    { id: '{zid}', description: 'zone id' },
    { id: '{cid}', description: 'case id' },
    { id: '{bid}', description: 'banner id' },
  ];
}
