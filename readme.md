# Pangaea 2.0 with Spike, Graph Cool & NetlifyCMS

## Setup

- make sure [node.js](http://nodejs.org) is at version >= `6`
- `npm i spike -g`
- clone this repo down and `cd` into the folder
- run `npm install`
- run `spike watch` or `spike compile`

## Structure

All configuration can be found in the `app.js` file. We use [spike-records](https://github.com/static-dev/spike-records), a general purpose plugin for consuming external data, in order to pull in data from GraphCMS. You can see a basic graphql query for the data that we need. We also transform the data to shed the generic wrapper (`data.allRecords.x`) before piping it into templates, and generate a single view for each item using the `template` option.

The primary views and templates are all found in the `views` folder. View syntax is written in [sugarml](https://github.com/reshape/sugarml), a pug-like whitespace-sensitive html syntax parser for [reshape](https://reshape.ml/). There is no lock-in here though, as you can convert to a [sugarfree syntax](https://github.com/static-dev/spike-tpl-sugarfree) with one simple option and keep all the same layout, looping, and local syntax the same. The markup is quite simple, really.

The css is also very simple and is found in `assets/css`. Very roughly written to follow [gps](https://github.com/jescalan/gps) guidelines. There is no javascript at all on this site as it doesn't require interactivity.
