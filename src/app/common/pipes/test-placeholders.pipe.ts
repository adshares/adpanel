import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'testPlaceholders'})
export class TestPlaceholdersPipe implements PipeTransform {

  readonly PLACEHOLDERS = [
    {id: '{aid}', description: 'server id'},
    {id: '{pid}', description: 'publisher id'},
    {id: '{sid}', description: 'site id'},
    {id: '{zid}', description: 'zone id'},
    {id: '{cid}', description: 'case id'},
    {id: '{bid}', description: 'banner id'},
  ];

  transform(url: string) {
    return url.replace(/{aid}/g, 'test_server_id')
      .replace(/{pid}/g, 'test_publisher')
      .replace(/{sid}/g, 'test_site')
      .replace(/{zid}/g, 'test_zone')
      .replace(/{cid}/g, 'test_case')
      .replace(/{bid}/g, 'test_banner');
  }
}
