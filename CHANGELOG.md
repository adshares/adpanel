# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Edit index.html, notify an administrator about change
- Dialog after adding the site informing about verification of the site
- Allow to add a site on mobile
- Backup the previous project version during build
### Changed
- Advertisement preview in dialog
- Fetch domain rank (page rank) from adserver
- Handling connection errors (dialog after a period of errors)
- Target URL is clickable
### Fixed
- Administrator user search

## [1.6.2] - 2020-03-03
### Added
- Publishers stats
- Support links

## [1.6.1] - 2020-02-19
### Added
- Asynchronous report generation
- Banners' sizes to targeting reach
### Fixed
- Targeting message while reach is less than threshold

## [1.6.0] - 2020-02-19
### Added
- BTC withdraw
- Targeting reach

## [1.5.8] - 2020-02-12
### Changed
- Site metatags

## [1.5.7] - 2020-02-10
### Added
- Benefits info on the login page info

## [1.5.6] - 2020-02-05
### Changed
- Site rating info
### Fixed
- Categories labels & descriptions 

## [1.5.5] - 2020-01-30
### Added
- Classification info
### Changed
- Layout of site's codes
### Fixed
- Loading publisher's stats

## [1.5.4] - 2020-01-27
### Fixed
- Loading sites by date filter

## [1.5.4] - 2020-01-27
### Fixed
- Loading sites by date filter

## [1.5.3] - 2020-01-27
### Added
- Site codes configuration
- Automatic refresh of charts and statistics
- Minimal budget support
### Changed
- Update conversion statistics with date filter change
### Fixed
- Sorting lists
- Reloading dashboard

## [1.5.2] - 2020-01-03
### Changed
- Integrate native deposit with NowPayments

## [1.5.1] - 2020-01-15
### Fixed
- Approximately ads refresh

## [1.5.0] - 2020-01-15
### Added
- NowPayments integration
- Additional button which adds advertisement
- Page rank info (CPA only and not working)
- Edit conversions

## [1.4.8] - 2020-01-03
### Changed
- Default direct link value
- Limit chart requests
### Fixed
- Long direct links

## [1.4.7] - 2020-01-03
### Added
- Ads with direct links (pop-up and pop-under)

## [1.4.6] - 2019-12-13
### Changed
- Page rank info source

## [1.4.5] - 2019-12-11
### Added
- Page rank info

## [1.4.4] - 2019-12-10
### Added
- Chart types for cash accounting 
### Fixed
- Account's balance check error

## [1.4.3] - 2019-12-05
### Removed
- Conversion definition budget

## [1.4.2] - 2019-11-26
### Fixed
- Banner size in internal classifier
- Banner size for html ad upload

## [1.4.1] - 2019-11-22
### Improved
- Fill site name with domain
### Fixed
- Hide direct-link ad type

## [1.4.0] - 2019-11-22
### Added
- Conversions definition
- Target URL placeholders
- Pops ad units configuration
- Site domain requirement
### Changed
- Hid Requires section from site filtering

## [1.2.5] - 2019-10-01
### Changed
- Upgrade @angular/cli to version 1.7.0
- Publisher and advertiser panel texts

## [1.2.4] - 2019-09-30
### Added
- Admin wallet info
### Changed
- Publisher panel texts

## [1.2.1] - 2019-09-20
### Added
- Billing history filtering
- Newsletter subscribe option
### Changed
- Internal classifier rejects banners only

## [0.11.0] - 2019-06-12
### Fixed
- Minor display issues

## [0.10.0] - 2019-06-04
### Added
- Referrer link handling

## [0.9.0] - 2019-05-30
### Added
- Admin Panel User View
 
## [0.8.0] - 2019-05-20
### Added
- Chart series
### Fixed
- Targeting when value is present in key
### Improved
- Labels for charts are clearer for user

## [0.7.3] - 2019-05-13
### Improved
- User impersonation by server admin
### Fixed
- Drag and drop banners 
- Banner resize on missing banner

## [0.7.2] - 2019-05-10
### Added
- Reports in Excel format

## [0.7.0] - 2019-04-29
### Added
- Presentation and formatting of currency values
### Improved
- Responsive design of the panel

## [0.6.7] - 2019-04-26
### Added
- Classification banner filtering by landingUrl

## [0.6.6] - 2019-04-25
### Added
- Values in custom currencies

## [0.6.4] - 2019-04-24
### Added
- Custom currency support
- Custom domain targeting
### Improved
- Responsiveness

## [0.6.1] - 2019-04-18
### Fixed
- Banner preview and format
- Date formatting for campaigns

## [0.6.0] - 2019-04-16
### Added
- Bonus credits for new users (on email confirmation)
- Custom targeting options
### Fixed
- Formatting for chart y-axes labels
### Improved
- UX for list of sites and campaign and ads:

## [0.5.4] - 2019-04-12
### Fixed
- Funds summary view

## [0.5.3] - 2019-04-12
### Added
- Bonus credits for advertising expenses
### Improved
- Campaign Reports

## [0.5.2] - 2019-04-11
### Fixed
- Campaign name edit

## [0.5.1] - 2019-04-10
### Fixed
- Configuration names

## [0.5.0] - 2019-04-09
### Changed
- Banner classification improvements

## [0.4.0] - 2019-04-01
### Added
- Banner classification
- Administrator panel
### Changed
- User Interface: UX improvements
- Event statistics
- Build scripts
- ZIP files upload instead of HTML banner upload
### Fixed
- Banner visibility detection
- Double finder script loading

## [0.1.0] - 2019-01-31
- Deployment of the AdPanel Release Candidate to https://demo.adshares.net with:
- User Account management features
- Billing and Payments features
- Advertiser features (Campaigns & Ads)
- Publisher features (Sites & AdUnits)


[Unreleased]: https://github.com/adshares/adpanel/compare/v1.6.2...develop
[1.6.2]: https://github.com/adshares/adpanel/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/adshares/adpanel/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/adshares/adpanel/compare/v1.5.8...v1.6.0
[1.5.8]: https://github.com/adshares/adpanel/compare/v1.5.7...v1.5.8
[1.5.7]: https://github.com/adshares/adpanel/compare/v1.5.6...v1.5.7
[1.5.6]: https://github.com/adshares/adpanel/compare/v1.5.5...v1.5.6
[1.5.5]: https://github.com/adshares/adpanel/compare/v1.5.4...v1.5.5
[1.5.4]: https://github.com/adshares/adpanel/compare/v1.5.3...v1.5.4
[1.5.3]: https://github.com/adshares/adpanel/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/adshares/adpanel/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/adshares/adpanel/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/adshares/adpanel/compare/v1.4.8...v1.5.0
[1.4.8]: https://github.com/adshares/adpanel/compare/v1.4.7...v1.4.8
[1.4.7]: https://github.com/adshares/adpanel/compare/v1.4.6...v1.4.7
[1.4.6]: https://github.com/adshares/adpanel/compare/v1.4.5...v1.4.6
[1.4.5]: https://github.com/adshares/adpanel/compare/v1.4.4...v1.4.5
[1.4.4]: https://github.com/adshares/adpanel/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/adshares/adpanel/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/adshares/adpanel/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/adshares/adpanel/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/adshares/adpanel/compare/v1.2.5...v1.4.0
[1.2.5]: https://github.com/adshares/adpanel/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/adshares/adpanel/compare/v1.2.1...v1.2.4
[1.2.1]: https://github.com/adshares/adpanel/compare/v0.11.0...v1.2.1
[0.11.0]: https://github.com/adshares/adpanel/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/adshares/adpanel/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/adshares/adpanel/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/adshares/adpanel/compare/v0.7.3...v0.8.0
[0.7.3]: https://github.com/adshares/adpanel/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/adshares/adpanel/compare/v0.7.0...v0.7.2
[0.7.0]: https://github.com/adshares/adpanel/compare/v0.6.7...v0.7.0
[0.6.7]: https://github.com/adshares/adpanel/compare/v0.6.6...v0.6.7
[0.6.6]: https://github.com/adshares/adpanel/compare/v0.6.4...v0.6.6
[0.6.4]: https://github.com/adshares/adpanel/compare/v0.6.1...v0.6.4
[0.6.1]: https://github.com/adshares/adpanel/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/adshares/adpanel/compare/v0.5.4...v0.6.0
[0.5.4]: https://github.com/adshares/adpanel/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/adshares/adpanel/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/adshares/adpanel/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/adshares/adpanel/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/adshares/adpanel/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/adshares/adpanel/compare/v0.1.0...v0.4.0
[0.1.0]: https://github.com/adshares/adpanel/releases/tag/v0.1.0
