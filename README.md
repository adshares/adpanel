<p align="center">
    <a href="https://adshares.net/" title="Adshares sp. z o.o." target="_blank">
        <img src="https://adshares.net/logos/ads.svg" alt="Adshares" width="100" height="100">
    </a>
</p>
<h3 align="center"><small>Adshares / AdPanel</small></h3>
<p align="center">
    <a href="https://github.com/adshares/adpanel/issues/new?template=bug_report.md&labels=Bug">Report bug</a>
    ·
    <a href="https://github.com/adshares/adpanel/issues/new?template=feature_request.md&labels=New%20Feature">Request feature</a>
    ·
    <a href="https://github.com/adshares/adpanel/wiki">Wiki</a>
</p>
<p align="center">
    <a href="https://travis-ci.com/adshares/adpanel" title="master" target="_blank">
        <img src="https://travis-ci.com/adshares/adpanel.svg?branch=master" alt="Build Status">
    </a>
</p>

AdPanel is a front-end application for advertising inventory management (both Advertiser & Publisher side).
It connects to an active [AdServer](https://github.com/adshares/adserver)'s API.

## Quick Start (on Ubuntu 18.04 LTS)

> Requirements:
> - [Nodejs](https://nodejs.org/en/) 
> - [yarn](https://yarnpkg.com/en/) (or at least npm)
> - A HTTP Server of your choice

Install dependencies
```bash
apt-get -y --no-install-recommends install gettext-base
```

Clone and build static version for `production` environment
```bash
git clone https://github.com/adshares/adpanel.git && cd adpanel
scripts/build.sh https://your.ADSERVER.hostname
```
and point your web server to the location of the `dist` directory.
> Running AdPanel without a web server will result in problems with API communication.

## More Info

- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)
- [Authors](https://github.com/adshares/adpanel/contributors) and [OSS Attribution](https://github.com/adshares/adpanel/oss-attribution/attribution.txt)
- Available [Versions](https://github.com/adshares/adpanel/tags) (we use [Semantic Versioning](http://semver.org/))

### Related projects

- [AdServer](https://github.com/adshares/adserver) - the core logic behind it all

### License

This work is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This work is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
[GNU General Public License](LICENSE) for more details.

You should have received a copy of the License along with this work.
If not, see <https://www.gnu.org/licenses/gpl.html>.
