# Adshares

## INDENTS

Files use 2 space indents as reflected in .editorconfig.

HTML files attributes should be started in new line if there is more than 1 attribute, e.g.

1 attribute:
```
<p 
  class="
    adsh-copy
    adsh-copy--large"
>
  Lorem ipsum
</p>
```

2 or more attributes:
```
<div
  *ngIf="password.valid"
  class="input-valid"
></div>
```

## STYLES

Root style file is located in **/src/styles.scss**

Style files (.scss) use BEM methodology e.g.

```
/* Block */
.adsh-header

/* Block with modifier */
.adsh-header--wide

/* Element in block */
.adsh-header__navigation

/* Element in block with modifier */
.adsh-header__navigation--active

```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.


## Create server mock

To run server mock install node easy mock:
`npm install -g easymock`

Then run
`easymock` in server-mock directory

To add new possible endpoints add new json files in easy-mock direcotry with name consisting of url and method name divided by underscore. Files should countain json response returned from server.

For more info visit: https://github.com/CyberAgent/node-easymock
