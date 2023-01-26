import { Injectable } from '@angular/core';
import { Options } from 'models/options.model';

@Injectable()
export class ServerOptionsService {
  private options: Options;

  setOptions(options: Options): void {
    this.options = options;
  }

  getOptions(): Options {
    return this.options;
  }
}
