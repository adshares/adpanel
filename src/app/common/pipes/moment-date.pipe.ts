import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DATE_AND_TIME_FORMAT } from 'common/utilities/consts';

@Pipe({ name: 'formatDate' })
export class MomentDatePipe implements PipeTransform {
  transform(date, format = DATE_AND_TIME_FORMAT): string {
    return moment(date).format(format);
  }
}
