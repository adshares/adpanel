import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model'
import { CampaignTargeting } from 'models/campaign.model'
import {
  createPathObject,
  excludeSiteDomain,
} from 'common/components/targeting/targeting.helpers2'
import { TargetingConverter } from 'common/utilities/targeting-converter/targeting-converter'

export class PolkaCityConverter implements TargetingConverter {
  static ID = 'polkacity'

  convertPath (path: string[]): string[] {
    return [];
  }

  convertSelectedTargetingOptionValues (targetingObject: object, targetingOptionValues: TargetingOptionValue[]): void {
  }

  convertTargetingOptions (targetingOptions: TargetingOption[]): void {
    excludeSiteDomain(targetingOptions)
  }

  decodeValue (value: string): string {
    return value;
  }

  encodeValue (value: string): string {
    return value;
  }

  prepareCampaignTargetingForBackend (targeting: CampaignTargeting): void {
    createPathObject(targeting.requires, ['site', 'domain'], 'polkacity.io')
  }

  convertBackendUrlToValidUrl(url: string): string {
    return 'https://www.polkacity.io/'
  }
}
