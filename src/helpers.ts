const hbs = require('hbs');
const {formatNum} = require('./utils/numbers');

hbs.registerHelper('formatNum', formatNum)

