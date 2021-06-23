import hbs from 'hbs';
import {formatNum,} from './utils/numbers';
import { formatDate, formatDuration } from "./utils/dates";

hbs.registerHelper('formatNum', formatNum);
hbs.registerHelper('fromNow', formatDate);
hbs.registerHelper('formatDuration', formatDuration);

