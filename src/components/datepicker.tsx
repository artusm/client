import React, { FC, useEffect, useState } from 'react';
import { EuiSuperDatePicker } from '@elastic/eui';
import dateMath from '@elastic/datemath';
import { Moment } from 'moment';

interface Props {
    isLoading: boolean;
    onChange?: (start: Moment, end: Moment) => void;
    defaultStart?: string;
    defaultEnd?: string;
}

interface onTimeChangeParams {
    start: string;
    end: string;
}

export const Datepicker: FC<Props> = ({
    isLoading = false,
    onChange = () => {},
    defaultEnd = 'now',
    defaultStart = 'now-30m',
}) => {
    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(defaultEnd);

    const onTimeChange = ({ start, end }: onTimeChangeParams) => {
        setStart(start);
        setEnd(end);
        const startMoment = dateMath.parse(start);

        if (!startMoment || !startMoment.isValid()) {
            throw new Error(`Не удалось распарсить начальную дату: ${startMoment}`);
        }

        const endMoment = dateMath.parse(end, { roundUp: true });
        if (!endMoment || !endMoment.isValid()) {
            throw new Error(`Не удалось распарсить дату окончания: ${endMoment}`);
        }

        if (onChange) {
            onChange(startMoment.utc(), endMoment.utc());
        }
    };

    useEffect(() => {
        onTimeChange({ start, end });
    }, []);

    return (
        <EuiSuperDatePicker
            isLoading={isLoading}
            start={start}
            end={end}
            onTimeChange={onTimeChange}
        />
    );
};
