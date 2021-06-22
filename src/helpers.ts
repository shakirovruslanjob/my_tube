import { fromNow } from "./utils/dates";

const hbs = require('hbs');
const {formatNum} = require('./utils/numbers');

hbs.registerHelper('formatNum', formatNum);
hbs.registerHelper('fromNow', fromNow)

