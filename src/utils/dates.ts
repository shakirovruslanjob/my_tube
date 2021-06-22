import moment from "moment"
export const fromNow = (date) => {
    return moment(date).fromNow()
}