# QingSelect

[![Latest Version](https://img.shields.io/npm/v/qing-select.svg)](https://www.npmjs.com/package/qing-select)
[![Build Status](https://img.shields.io/travis/mycolorway/qing-select.svg)](https://travis-ci.org/mycolorway/qing-select)
[![Coveralls](https://img.shields.io/coveralls/mycolorway/qing-select.svg)](https://coveralls.io/github/mycolorway/qing-select)
[![David](https://img.shields.io/david/mycolorway/qing-select.svg)](https://david-dm.org/mycolorway/qing-select)
[![David](https://img.shields.io/david/dev/mycolorway/qing-select.svg)](https://david-dm.org/mycolorway/qing-select#info=devDependencies)

QingSelect is a ui component inherited from QingModule.

## Usage

```html
<script type="text/javascript" src="node_modules/jquery/dist/jquery.js"></script>
<script type="text/javascript" src="node_modules/qing-module/dist/qing-module.js"></script>
<script type="text/javascript" src="node_modules/qing-select/dist/qing-select.js"></script>

<select id="select-one">
  <option>Please Select</option>
  <option value="volvo" data-hint="car 1">Volvo</option>
  <option value="saab" data-hint="car 2">Saab</option>
  <option value="mercedes" data-hint="car 3">Mercedes</option>
  <option value="audi" data-hint="car 4" selected>Audi</option>
</select>
```

```js
var selectOne = new QingSelect({
  el: '#select-one'
});

selectOne.on('change', function(e, selection) {
  console.log(selection);
});
```

## Options

__el__

Selector/Element/jQuery Object, required, specify the html element.

__renderer__

Function, specify the callback for customizing html structure. Component wrapper will be pass to callback as the only param.

__optionRenderer__

Function, callback function for customizing option item in popover. Two params will be passed to callback: option element and option data.

__remote__

false/Hash, `false` by default, set a hash to enable remote data source mode. The hash may contain three key/value pairs:

```js
{
  url: 'xxx', // ajax api url, required
  searchKey: 'name', // param key for the user input search value, required
  params: {} // extra params passing to the server, optional
}
```

This option is required unless `el` option is present.

__totalOptionSize__

Number, specify total list size of option list with remote search.

__maxListSize__

Number, `20` by default, specify max option size in popover, the options exceed the opacity will be hidden, and the total option count tip will be presented instead.

__popoverOffset__

Number, `6` by default, specify pixels the popover offset to result box.

__searchableSize__

Number, `8` by default, search box in popover will show if total option count is greater than searchableSize.

__popoverAppendTo__

Selector/Element/jQuery Object, `'body'` by default, specify the container which popover will be appended to.

__locales__

Hash, set custom locale texts for a single instance. If you want to set default locales for all simple-select instances, use `QingSelect.locales` instead.


## Methods

__selectOption__ (`String` value | `Option` option)

Select an option, pass value or option object as param.

__unselectOption__ (`String` value | `Option` option)

Unselect an option, pass value or option object as param.

__destroy__ ()

Destroy component, restore element to original state.

## Events

__change__

Triggered when the selection is changed with selection data as param.


## Installation

Install via npm:

```bash
npm install --save qing-select
```

## Development

Clone repository from github:

```bash
git clone https://github.com/mycolorway/qing-select.git
```

Install npm dependencies:

```bash
npm install
```

Run default gulp task to build project, which will compile source files, run test and watch file changes for you:

```bash
gulp
```

Now, you are ready to go.

## Publish

When you want to publish new version to npm, please make sure all tests have passed, and you need to do these preparations:

* Add release information in `CHANGELOG.md`. The format of markdown contents will matter, because build scripts will get version and release content from the markdown file by regular expression. You can follow the format of the older releases.

* Put your [personal API tokens](https://github.com/blog/1509-personal-api-tokens) in `/.token.json`(listed in `.gitignore`), which is required by the build scripts to request [Github API](https://developer.github.com/v3/) for creating new release:

```json
{
  "github": "[your github personal access token]"
}
```

Now you can run `gulp publish` task, which will do these work for you:

* Get version number from `CHANGELOG.md` and bump it into `package.json`.
* Get release information from `CHANGELOG.md` and request Github API to create new release.

If everything goes fine, you can see your release at [https://github.com/mycolorway/qing-module/releases](https://github.com/mycolorway/qing-module/releases). At the End you can publish new version to npm with the command:

```bash
npm publish
```

Please be careful with the last step, because you cannot delete or republish a version on npm.
