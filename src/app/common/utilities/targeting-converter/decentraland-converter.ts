import { TargetingOption, TargetingOptionType, TargetingOptionValue } from 'models/targeting-option.model';
import { CampaignTargeting } from 'models/campaign.model';
import {
  createPathObject,
  excludeSiteDomain,
  prepareCustomOption,
} from 'common/components/targeting/targeting.helpers2';
import { TargetingConverter } from 'common/utilities/targeting-converter/targeting-converter';

export class DecentralandConverter implements TargetingConverter {
  static ID = 'decentraland';

  decodeValue(value: string): string {
    const mappedCoordinates = value.replace('/', '').slice('scene-'.length, -'.decentraland.org'.length);
    const coordinates = mappedCoordinates
      .split('-')
      .map(coordinate => (coordinate.charAt(0) === 'n' ? `-${coordinate.substring(1)}` : coordinate))
      .join(', ');
    return `(${coordinates})`;
  }

  encodeValue(value: string): string {
    const mappedCoordinates = value
      .substring(1, value.length - 1)
      .split(', ')
      .map(coordinate => (coordinate.charAt(0) === '-' ? `n${coordinate.substring(1)}` : coordinate))
      .join('-');
    return `scene-${mappedCoordinates}.decentraland.org`;
  }

  convertPath(_path: string[]): string[] {
    return ['site', 'domain'];
  }

  convertTargetingOptions(targetingOptions: TargetingOption[]): void {
    excludeSiteDomain(targetingOptions);
    targetingOptions.push({
      allowInput: true,
      id: DecentralandConverter.ID,
      key: DecentralandConverter.ID,
      label: 'Parcel',
      valueType: TargetingOptionType.PARCEL_COORDINATES,
    });
  }

  convertSelectedTargetingOptionValues(targetingObject: object, result: TargetingOptionValue[]): void {
    if (targetingObject['site'] && targetingObject['site']['domain']) {
      for (let item of targetingObject['site']['domain']) {
        if (item === 'decentraland.org') {
          continue;
        }
        result.push(
          prepareCustomOption(
            this.decodeValue(item),
            DecentralandConverter.ID,
            this.convertBackendUrlToValidUrl(`https://${item}`)
          )
        );
      }
    }
  }

  prepareCampaignTargetingForBackend(targeting: CampaignTargeting): void {
    if (targeting.requires[DecentralandConverter.ID]) {
      for (let parcel of targeting.requires[DecentralandConverter.ID]) {
        createPathObject(targeting.requires, this.convertPath([DecentralandConverter.ID]), this.encodeValue(parcel));
      }
      delete targeting.requires[DecentralandConverter.ID];
    } else {
      createPathObject(targeting.requires, ['site', 'domain'], 'decentraland.org');
    }
    if (targeting.excludes[DecentralandConverter.ID]) {
      for (let parcel of targeting.excludes[DecentralandConverter.ID]) {
        createPathObject(targeting.excludes, this.convertPath([DecentralandConverter.ID]), this.encodeValue(parcel));
      }
      delete targeting.requires[DecentralandConverter.ID];
    }
  }

  convertBackendUrlToValidUrl(url: string): string {
    const decodedValue = this.decodeValue(url.slice('https://'.length));
    const coordinates = decodedValue.slice(1, decodedValue.length - 1).split(', ');

    return `https://play.decentraland.org/?position=${coordinates[0]}%2C${coordinates[1]}`;
  }
}
