import { Pipe, PipeTransform } from '@angular/core';
import { calcCampaignBudgetPerDay } from 'common/utilities/helpers';

/*
 * Calculates campaign budget per day basing on budget per hour.
 *
 * Usage:
 *   value | campaignBudgetDay
 * Example:
 *   {{ 0.1 | campaignBudgetDay }}
 *   formats to: 2.4
 */
@Pipe({ name: 'campaignBudgetPerDay' })
export class CampaignBudgetPerDayPipe implements PipeTransform {
  transform(value: number): number {
    return calcCampaignBudgetPerDay(value);
  }
}
