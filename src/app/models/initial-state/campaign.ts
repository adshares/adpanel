import { Campaign } from '../campaign.model';

export const campaignInitialState: Campaign = {
  basicInformation: {
    status: 0,
    name: 'asdasdasd',
    targetUrl: 'sdasd',
    bidStrategyName: 'cpp',
    bidValue: 2,
    budget: 1,
    dateStart: new Date()
  },

  targeting: {excludes: [
    {label: "English", value: "en", key: "lang_en", parent_label: "Language", selected: true},
    {label: "google.pl", value: "google.pl", key: "host_google", parent_label: "Site domain", selected: true},
    {label: "onet.pl", value: "onet.pl", key: "host_onet", parent_label: "Site domain", selected: true},
    {label: "No", value: "false", key: "js_enabled_no", parent_label: "Javascript support", selected: true}],
  requires: [
    {label: "Polish", value: "pl", key: "lang_pol", parent_label: "Language", selected: true},
    {label: "English", value: "en", key: "lang_en", parent_label: "Language", selected: true},
    {label: "google.pl", value: "google.pl", key: "host_google", parent_label: "Site domain", selected: true},
    {label: "onet.pl", value: "onet.pl", key: "host_onet", parent_label: "Site domain", selected: true},
    {label: "1200 or more", value: "<1200,>", key: "width_1200", parent_label: "width", selected: true},
    {label: "Yes", value: "true", key: "js_enabled_yes", parent_label: "Javascript support", selected: true}
  ]},


  id: 0
}
