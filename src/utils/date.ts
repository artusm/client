import moment from "moment";

export const convertDatesToLocal = (dates: string[]): string[] => {
    if (dates && Array.isArray(dates)) {
        return dates.map(d => moment(d).utcOffset(180).format('YYYY-MM-DD HH:mm:ss'))
    }

    return [];
}
