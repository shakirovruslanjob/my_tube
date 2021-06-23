const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

export const formatDate = (date) => {
    return moment(date).fromNow()
}

export const formatDuration = (duration) => {
    return moment.duration(duration).format('h:m:ss', {stopTrim: 'm'});   
}