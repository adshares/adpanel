# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.4.6] - 2023-03-16
### Fixed
- Administrator access to billing history

## [2.4.5] - 2023-03-15
### Added
- Server maintenance page
- Default message for rejected site

## [2.4.4] - 2023-02-28
### Added
- Warning before deposit if automatic withdrawal is active

## [2.4.3] - 2023-02-21
### Fixed
Display admin role on screen smaller than 1800px

## [2.4.2] - 2023-02-14
### Changed
- Links do landing page

## [2.4.1] - 2023-02-13
### Changed
- Validate site's domain using medium
- Change panel logo to 1 option png
### Fixed
- Filtering campaigns by available media

## [2.4.0] - 2023-02-09
### Added
- Displaying user id on account settings section
- Access to AdController for moderator
- Filtering campaigns by medium
### Changed
- Total rebuild of panel look (color palette, elements sizes, arrangement of elements)
- Font change to Montserrat 
- Improved navigation
- Update labels
- Font awesome icons instead of image assets
- Allow creating campaigns for any vendor of medium
### Fixed
- External links
- Forbidden to add parcel with incomplete coordinates
- Click conversion choice
- Do not display double error on token error

## [2.3.0] - 2023-01-26
### Added
- Site's statuses (pending approval, rejected)
- Targeting chip representing domain routes to page on click
### Changed
- Load direct link ad content during campaign load
### Fixed
- Set chart's date filter
- Sites' order on dashboard after status change
- Set conversion's mutable value
- Handle HTTP 403 error
- Check user's role during impersonation

## [2.2.4] - 2022-12-29
### Fixed
- OAuth redirection during adserver initialization

## [2.2.3] - 2022-12-19
### Removed
- Filtering user list by confirmation status
- Actions on users

## [2.2.2] - 2022-12-13
### Changed
- Show placements for metaverse
- Rename ad units to placements

## [2.2.1] - 2022-12-08
### Fixed
- Handle session

## [2.2.0] - 2022-12-07
### Added
- Deleting referral links
- Referral links pagination
- OAuth2
- OAuth2 access tokens list
### Changed
- Extract reload from build script
- Replaced CSS prefix `dwmth` with `ap`
### Removed
- Preview of next release (rebranding)
### Fixed
- Unnecessary admin approval message

## [2.1.1] - 2022-10-04
### Changed
- Rebranding script attaches custom styles
### Fixed
- Do not display resend email activation while not applicable

## [2.1.0] - 2022-09-28
### Added
- Change user roles
- Load login info from API
### Changed
- Dynamically load currency and other AdServer's options
- Decrease index replace delay
- Display regular users' flows based on their interest (advertiser/publisher)
### Removed
- Configuration moved to AdController

## [1.18.8] - 2022-08-17
### Fixed
- Disable saving bid strategy while name is empty

## [1.18.7] - 2022-07-29
### Fixed
- New ad unit size error

## [1.18.6] - 2022-07-20
### Fixed
- Handling missing ad unit's size
### Removed
- Ad units' tags from site details

## [1.18.5] - 2022-07-08
### Added
- Checkbox for control size matching

## [1.18.4] - 2022-06-30
### Added
- Redirection to AdController during initialization
### Fixed
- License details url
- Registration with wallet in restricted mode

## [1.18.2] - 2022-06-02
### Added
- Opportunity to sort and filter tables in query parameters
- Remembering selected filters when switching tabs
### Changed
- Format impressions amount (thousand separators)
### Fixed
- Direct deal for metaverse
- Metamask connection

## [1.18.0] - 2022-06-02
### Changed
- Angular 13
### Fixed
- Setting date range for charts
- User label when no e-mail

## [1.17.1] - 2022-05-30
### Fixed
- Newsletter subscription
- DCL builder link
- Edit site's option for manual approval

### Added
- Link to wiki guide on how to add an HTML file 

## [1.17.0] - 2022-05-19
### Added
- Links to publisher sites in publisher panel
- Configuration default site classification and filtering options on admin panel
- Opportunity for admin to ban, unban and delete users
### Changed
- Wallet login buttons visibility
- Angular 7
- Bid strategy depends on medium
### Fixed
- Displayed coordinates when edit site basic info
- Metaverse site creation when wallet not connected
- Forbid buttons to change balance during impersonation
- Error while targeting/filtering is not available
- Image view on upload advertisement

## [1.16.1] - 2022-04-07
### Added
- Creating and editing metaverse site
### Changed
- Uploaded file's size limit from adserver

## [1.16.0] - 2022-04-05
### Added
- 3d models upload and preview
### Changed
- Angular 6

## [1.15.0] - 2022-03-23
### Added
- Cookie3 support
- Custom metaverses support
### Changed
- Targeting supports taxonomy v2
### Fixed
- Video preview overflow
- Pages order while creating site (navigation)
- Targeting option indicator while removing complex option

## [1.14.1] - 2022-02-16
### Fixed
- Fix missing switch return

## [1.14.0] - 2022-02-15
### Added
- Video ads support
### Changed
- 2FA requirement when setting password
- 2FA requirement when connecting the wallet

## [1.13.2] - 2022-02-10
### Changed
- Token on referral links list is link
### Fixed
- Minor issues

## [1.12.0] - 2022-01-19
### Added
- Filtering for only accepted banners
- Auto CPM

## [1.11.2] - 2022-01-13
### Added
- Withdrawal to the cryptocurrency wallet
- Terms in the footer
- Automatic size detection for HTML banners

## [1.11.1] - 2022-01-10
### Added
- Create an account with the cryptocurrency wallet

## [1.11.0] - 2021-12-31
### Added
- Connecting your account with the cryptocurrency wallet
- Log in to your account with the cryptocurrency wallet
- Auto registration
- Auto withdrawal
### Fixed
- Remove register link in private mode

## [1.10.8] - 2021-12-10
### Fixed
- CSS & impersonated mode

## [1.10.7] - 2021-12-09
### Added
- Moderator role
- Agency role

## [1.10.6] - 2021-09-22
### Fixed
- Navigate to dashboard after login
- Admin report for inactive campaigns

## [1.10.5] - 2021-09-02
### Added
- Campaign cloning

## [1.10.4] - 2021-09-01
### Added
- Fallback script rate option

## [1.10.3] - 2021-08-26
### Fixed
- Minor fixes

## [1.10.2] - 2021-08-25
### Added
- Campaign name in admin reports

## [1.10.1] - 2021-08-24
### Added
- Hourly interval admin report
### Fixed
- Minor fixes

## [1.10.0] - 2021-08-20
### Added
- Invoices & deposit in FIAT

## [1.9.2] - 2021-08-13
### Added
- Aduser info in admin report

## [1.9.1] - 2021-08-12
### Fixed
- Minor fixes

## [1.9.0] - 2021-08-05
### Added
- Refund referral program
- Restricted & private registration modes
- Manual account confirmation

## [1.7.1] - 2021-06-15
### Added
- Outdated campaign warning & activation

## [1.7.0] - 2021-06-01
### Added
- Edit index.html, notify an administrator about change
- Dialog after adding the site informing about verification of the site
- Allow to add a site on mobile
- Backup the previous project version during build
- Bid strategy definition for administrator
- Site's domain validation
### Changed
- Advertisement preview in dialog
- Fetch domain rank (page rank) from adserver
- Handling connection errors (dialog after a period of errors)
- Target URL is clickable
- Taxonomy processing, allow multi level
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


[Unreleased]: https://github.com/adshares/adpanel/compare/v2.4.6...develop
[2.4.6]: https://github.com/adshares/adpanel/compare/v2.4.5...v2.4.6
[2.4.5]: https://github.com/adshares/adpanel/compare/v2.4.4...v2.4.5
[2.4.4]: https://github.com/adshares/adpanel/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/adshares/adpanel/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/adshares/adpanel/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/adshares/adpanel/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/adshares/adpanel/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/adshares/adpanel/compare/v2.2.4...v2.3.0
[2.2.4]: https://github.com/adshares/adpanel/compare/v2.2.3...v2.2.4
[2.2.3]: https://github.com/adshares/adpanel/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/adshares/adpanel/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/adshares/adpanel/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/adshares/adpanel/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/adshares/adpanel/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/adshares/adpanel/compare/v1.18.8...v2.1.0
[1.18.8]: https://github.com/adshares/adpanel/compare/v1.18.7...v1.18.8
[1.18.7]: https://github.com/adshares/adpanel/compare/v1.18.6...v1.18.7
[1.18.6]: https://github.com/adshares/adpanel/compare/v1.18.5...v1.18.6
[1.18.5]: https://github.com/adshares/adpanel/compare/v1.18.4...v1.18.5
[1.18.4]: https://github.com/adshares/adpanel/compare/v1.18.2...v1.18.4
[1.18.2]: https://github.com/adshares/adpanel/compare/v1.18.0...v1.18.2
[1.18.0]: https://github.com/adshares/adpanel/compare/v1.17.1...v1.18.0
[1.17.1]: https://github.com/adshares/adpanel/compare/v1.17.0...v1.17.1
[1.17.0]: https://github.com/adshares/adpanel/compare/v1.16.1...v1.17.0
[1.16.1]: https://github.com/adshares/adpanel/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/adshares/adpanel/compare/v1.15.0...v1.16.0
[1.15.0]: https://github.com/adshares/adpanel/compare/v1.14.1...v1.15.0
[1.14.1]: https://github.com/adshares/adpanel/compare/v1.14.0...v1.14.1
[1.14.0]: https://github.com/adshares/adpanel/compare/v1.13.2...v1.14.0
[1.13.2]: https://github.com/adshares/adpanel/compare/v1.12.0...v1.13.2
[1.12.0]: https://github.com/adshares/adpanel/compare/v1.11.2...v1.12.0
[1.11.2]: https://github.com/adshares/adpanel/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/adshares/adpanel/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/adshares/adpanel/compare/v1.10.8...v1.11.0
[1.10.8]: https://github.com/adshares/adpanel/compare/v1.10.7...v1.10.8
[1.10.7]: https://github.com/adshares/adpanel/compare/v1.10.6...v1.10.7
[1.10.6]: https://github.com/adshares/adpanel/compare/v1.10.5...v1.10.6
[1.10.5]: https://github.com/adshares/adpanel/compare/v1.10.4...v1.10.5
[1.10.4]: https://github.com/adshares/adpanel/compare/v1.10.3...v1.10.4
[1.10.3]: https://github.com/adshares/adpanel/compare/v1.10.2...v1.10.3
[1.10.2]: https://github.com/adshares/adpanel/compare/v1.10.1...v1.10.2
[1.10.1]: https://github.com/adshares/adpanel/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/adshares/adpanel/compare/v1.9.2...v1.10.0
[1.9.2]: https://github.com/adshares/adpanel/compare/v1.9.1...v1.9.2
[1.9.1]: https://github.com/adshares/adpanel/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/adshares/adpanel/compare/v1.7.1...v1.9.0
[1.7.1]: https://github.com/adshares/adpanel/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/adshares/adpanel/compare/v1.6.2...v1.7.0
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
