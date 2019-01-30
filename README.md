<p align="center">
    <a href="https://adshares.net/" title="Adshares sp. z o.o." target="_blank">
        <img src="https://adshares.net/logos/ads.svg" alt="Adshares" width="100" height="100">
    </a>
</p>
<h3 align="center"><small>Adshares - AdPanel</small></h3>
<p align="center">
    <a href="https://github.com/adshares/adpanel/issues/new?template=bug_report.md&labels=Bug">Report bug</a>
    ·
    <a href="https://github.com/adshares/adpanel/issues/new?template=feature_request.md&labels=New%20Feature">Request feature</a>
    ·
    <a href="https://github.com/adshares/adpanel/wiki">Wiki</a>
</p>
<p align="center">
    <a href="https://travis-ci.org/adshares/adpanel" title="master" target="_blank">
        <img src="https://travis-ci.org/adshares/adpanel.svg?branch=master" alt="Build Status">
    </a>
</p>

## Quick Start

When starting from scratch:

```bash
bin/init.sh --build --run
```

To rebuild everything:

```bash
bin/init.sh --clean --force --build --run
```

- Omit the `--run` option to generate a static version into `dist` directory without running a server. 
- To see logs add `--logs` at the end of the above `init.sh` command.
- To follow them,  use `--logs-follow`.

With the default settings the panel will be available:
- [http://localhost:8102/](http://localhost:8102/)

## Documentation

- [Wiki](https://github.com/adshares/adpanel/wiki)
- [Changelog](CHANGELOG.md)
- [Testing](https://github.com/adshares/adpanel/wiki/Testing)
- [Attribution](https://github.com/adshares/adpanel/oss-attribution/attribution.txt)

## Contributing

- Please follow our [Contributing Guidelines](docs/CONTRIBUTING.md)

### Authors

- **[Tomek Grzechowski](https://github.com/yodahack)**
- **[Maciej Pilarczyk](https://github.com/m-pilarczyk)**
- **[Paweł Zaremba](https://github.com/pawzar)**
- **[Katarzyna Marciniszyn ](https://github.com/Meskat)**
- **[Paweł Podkalicki](https://github.com/PawelPodkalicki)**
- **[Przemysław Furtak](https://github.com/c3zi)**


...and other [contributors](https://github.com/adshares/adpanel/contributors).

### Versioning

- We use [Semantic Versioning](http://semver.org/).
- See available [versions](https://github.com/adshares/adpanel/tags). 

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

## Related projects

- [AdServer](https://github.com/adshares/adserver)
- [PHP ADS Client](https://github.com/adshares/adpanel-php-client)

