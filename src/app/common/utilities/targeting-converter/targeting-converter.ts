import { TargetingOption, TargetingOptionValue } from 'models/targeting-option.model';
import { CampaignTargeting } from 'models/campaign.model';

export interface TargetingConverter {
  /**
   * Decode backend value to be used in panel
   * @param value
   */
  decodeValue(value: string): string;

  /**
   * Encode value to be used in backend
   * @param value
   */
  encodeValue(value: string): string;

  /**
   * Converts custom path keys to backend format
   * @param path array of custom keys
   */
  convertPath(path: string[]): string[];

  /**
   * Convert targeting options
   * @param targetingOptions targeting options
   */
  convertTargetingOptions(targetingOptions: TargetingOption[]): void;

  /**
   * Extract custom options from targeting object and add them to selected options
   * @param targetingObject targeting object from backend
   * @param targetingOptionValues selected targeting options
   */
  convertSelectedTargetingOptionValues(targetingObject: object, targetingOptionValues: TargetingOptionValue[]): void;

  /**
   * Process targeting object for backend, e.g. add default values if missing, change paths
   * @param targeting targeting object from backend
   */
  prepareCampaignTargetingForBackend(targeting: CampaignTargeting): void;

  /**
   * Converts backend "URL" to valid URL.
   * @param url backend (internal) "URL", which can be used internally only (e.g. for targeting)
   * @return valid URL, which leads to existing page
   */
  convertBackendUrlToValidUrl(url: string): string;
}
