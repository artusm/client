import moment from 'moment';
import dateMath, { Unit } from '@elastic/datemath';

const ES_INTERVAL_STRING_REGEX = new RegExp(
    '^([1-9][0-9]*)\\s*(' + dateMath.units.join('|') + ')$'
);

export class InvalidEsCalendarIntervalError extends Error {
    constructor(
        public readonly interval: string,
        public readonly value: number,
        public readonly unit: Unit,
        public readonly type: string
    ) {
        super(`Invalid calendar interval: ${interval}, value must be 1`);

        this.name = 'InvalidEsCalendarIntervalError';
        this.value = value;
        this.unit = unit;
        this.type = type;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidEsCalendarIntervalError);
        }

        Object.setPrototypeOf(this, InvalidEsCalendarIntervalError.prototype);
    }
}

export class InvalidEsIntervalFormatError extends Error {
    constructor(public readonly interval: string) {
        super(`Invalid interval format: ${interval}`);

        this.name = 'InvalidEsIntervalFormatError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidEsIntervalFormatError);
        }

        Object.setPrototypeOf(this, InvalidEsIntervalFormatError.prototype);
    }
}

export function parseEsInterval(interval: string) {
    const matches = String(interval).trim().match(ES_INTERVAL_STRING_REGEX);

    if (!matches) {
        throw new InvalidEsIntervalFormatError(interval);
    }

    const value = parseFloat(matches[1]);
    const unit = matches[2] as Unit;
    const type = dateMath.unitsMap[unit].type;

    if (type === 'calendar' && value !== 1) {
        throw new InvalidEsCalendarIntervalError(interval, value, unit, type);
    }

    return {
        value,
        unit,
        type:
            (type === 'mixed' && value === 1) || type === 'calendar'
                ? ('calendar' as 'calendar')
                : ('fixed' as 'fixed'),
    };
}

const unitsDesc = dateMath.unitsDesc;
const largeMax = unitsDesc.indexOf('M');

export interface EsInterval {
    expression: string;
    unit: Unit;
    value: number;
}

export function convertDurationToNormalizedEsInterval(
    duration: moment.Duration,
    targetUnit?: Unit
): EsInterval {
    for (let i = 0; i < unitsDesc.length; i++) {
        const unit = unitsDesc[i];
        const val = duration.as(unit);

        if (val >= 1 && Math.floor(val) === val) {
            if (val === 1 && targetUnit && unit !== targetUnit) {
                continue;
            }

            if (i <= largeMax && val !== 1) {
                continue;
            }

            return {
                value: val,
                unit,
                expression: val + unit,
            };
        }
    }

    const ms = duration.as('ms');
    return {
        value: ms,
        unit: 'ms',
        expression: ms + 'ms',
    };
}

export function convertIntervalToEsInterval(interval: string): EsInterval {
    const { value, unit } = parseEsInterval(interval);
    return {
        value,
        unit,
        expression: interval,
    };
}
