import { TargetingOption, TargetingOptionType, TargetingOptionValue } from 'models/targeting-option.model';
import { CampaignTargeting } from 'models/campaign.model';
import {
  createPathObject,
  excludeSiteDomain,
  prepareCustomOption,
} from 'common/components/targeting/targeting.helpers2';
import { TargetingConverter } from 'common/utilities/targeting-converter/targeting-converter';

export class CryptovoxelsConverter implements TargetingConverter {
  static ID = 'cryptovoxels';

  decodeValue(value: string): string {
    return value.slice('scene-'.length, -'.cryptovoxels.com'.length);
  }

  encodeValue(value: string): string {
    return `scene-${value}.cryptovoxels.com`;
  }

  convertPath(_path: string[]): string[] {
    return ['site', 'domain'];
  }

  convertTargetingOptions(targetingOptions: TargetingOption[]): void {
    excludeSiteDomain(targetingOptions);
    targetingOptions.push({
      allowInput: true,
      id: CryptovoxelsConverter.ID,
      key: CryptovoxelsConverter.ID,
      label: 'Parcel',
      valueType: TargetingOptionType.STRING,
    });
  }

  convertSelectedTargetingOptionValues(targetingObject: object, result: TargetingOptionValue[]): void {
    if (targetingObject['site'] && targetingObject['site']['domain']) {
      for (let item of targetingObject['site']['domain']) {
        if (item === 'cryptovoxels.com') {
          continue;
        }
        result.push(
          prepareCustomOption(
            this.decodeValue(item),
            CryptovoxelsConverter.ID,
            this.convertBackendUrlToValidUrl(`https://${item}`)
          )
        );
      }
    }
  }

  prepareCampaignTargetingForBackend(targeting: CampaignTargeting): void {
    if (targeting.requires[CryptovoxelsConverter.ID]) {
      for (let parcel of targeting.requires[CryptovoxelsConverter.ID]) {
        createPathObject(targeting.requires, this.convertPath([CryptovoxelsConverter.ID]), this.encodeValue(parcel));
      }
      delete targeting.requires[CryptovoxelsConverter.ID];
    } else {
      createPathObject(targeting.requires, ['site', 'domain'], 'cryptovoxels.com');
    }
    if (targeting.excludes[CryptovoxelsConverter.ID]) {
      for (let parcel of targeting.excludes[CryptovoxelsConverter.ID]) {
        createPathObject(targeting.excludes, this.convertPath([CryptovoxelsConverter.ID]), this.encodeValue(parcel));
      }
      delete targeting.requires[CryptovoxelsConverter.ID];
    }
  }

  convertBackendUrlToValidUrl(url: string): string {
    const id = this.decodeValue(url.slice('https://'.length));
    return `https://www.cryptovoxels.com/parcels/${id}`;
  }
}
