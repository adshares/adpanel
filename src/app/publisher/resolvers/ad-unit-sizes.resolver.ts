import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AdUnitMetaData } from 'models/site.model';
import { PublisherService } from 'publisher/publisher.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdUnitSizesResolver implements Resolve<AdUnitMetaData[]> {
  constructor(private publisherService: PublisherService) {}

  resolve(): Observable<AdUnitMetaData[]> {
    return this.publisherService.getAdUnitSizes().pipe(
      map(metaDataArray =>
        metaDataArray.map(
          metaData =>
            <AdUnitMetaData>{
              ...metaData,
              tags: this.TAGS_BY_SIZE[metaData.size] || ['Other'],
            }
        )
      )
    );
  }

  private readonly TAGS_BY_SIZE = {
    '300x250': ['Desktop', 'best'],
    '336x280': ['Desktop', 'best'],
    '728x90': ['Desktop', 'best'],
    '300x600': ['Desktop', 'best'],
    '320x100': ['Desktop', 'best', 'Mobile'],
    '320x50': ['Desktop', 'Mobile'],
    '468x60': ['Desktop'],
    '234x60': ['Desktop'],
    '120x600': ['Desktop'],
    '120x240': ['Desktop'],
    '160x600': ['Desktop'],
    '300x1050': ['Desktop'],
    '970x90': ['Desktop'],
    '970x250': ['Desktop'],
    '250x250': ['Desktop'],
    '200x200': ['Desktop'],
    '180x150': ['Desktop'],
    '125x125': ['Desktop'],
    '240x400': ['Desktop'],
    '980x120': ['Desktop'],
    '250x360': ['Desktop'],
    '930x180': ['Desktop'],
    '580x400': ['Desktop'],
    '750x100': ['Desktop', 'PL'],
    '750x200': ['Desktop', 'PL'],
    '750x300': ['Desktop', 'PL'],
    '300x100': ['Desktop'],
    '120x90': ['Desktop'],
    '120x60': ['Desktop'],
    '88x31': ['Desktop'],
    'pop-up': ['Desktop', 'Mobile'],
    'pop-under': ['Desktop', 'Mobile'],
    cube: ['Metaverse'],
  };
}
