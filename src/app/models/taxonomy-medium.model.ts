interface Format {
  type: string;
  mimes: string[];
  scopes: Scope;
}

interface Media {
  [index: string]: string;
}

interface Medium {
  name: string;
  label: string;
  vendor: string | null;
  formats: Format[];
  targeting: Targeting;
}

interface Scope {
  [index: string]: string;
}

interface Targeting {
  user: TargetingItem[];
  site: TargetingItem[];
  device: TargetingItem[];
}

interface TargetingItem {
  type: string;
  name: string;
  label: string;
  items?: object;
}

export { Format, Media, Medium, Scope, Targeting, TargetingItem };
