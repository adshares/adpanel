export interface Site {
  id: number;
  name: string;
  estimatedEarnings?: number;
  clicks?: number;
  impressions?: number;
  rpm?: number;
  averageCPC?: number;

  targeting?: {
    requires?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    },
    excludes?: {
      languages?: string[];
      devices?: string[];
      genders?: string[];
      operatingSystems?: string[];
      browsers?: string[];
    }
  };

  adUnits?: object[];
}
