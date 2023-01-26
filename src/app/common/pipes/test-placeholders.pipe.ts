import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'testPlaceholders' })
export class TestPlaceholdersPipe implements PipeTransform {
  transform(url: string) {
    return url
      .replace(/{aid}/g, 'test_server_id')
      .replace(/{pid}/g, 'test_publisher')
      .replace(/{sid}/g, 'test_site')
      .replace(/{zid}/g, 'test_zone')
      .replace(/{cid}/g, 'test_case')
      .replace(/{bid}/g, 'test_banner');
  }
}
