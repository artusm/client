import './field-stat-item.css';
import React, { FC } from 'react';
import { EuiFlexItem, EuiPanel } from '@elastic/eui';
import moment from 'moment';

import { FieldHeader } from './field-header';
import { FIELD_TYPES } from '../../../../common/field_types';
import { DocumentsCount } from './documents-count';
import { DistinctValues } from './distinct-values';
import { NumberStat } from './number-stat';
import { ExampleList } from './ExampleList';
import { TopValue, TopValues } from '../TopValues';

interface FieldStatData {
    count?: number;
    cardinality?: number;
    examples?: string[];
    min?: number;
    max?: number;
    avg?: number;
    topValues?: TopValue[];
    earliest?: number;
    latest?: number;
    distribution: any;
}

interface FieldStatItemProps {
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
    fieldName?: string;
    data?: FieldStatData;
    totalCount: number;
}

export const FieldStatItem: FC<FieldStatItemProps> = ({
                                                          type,
                                                          fieldName,
                                                          data,
                                                          totalCount,
                                                      }) => {
    return (
        <EuiFlexItem style={{ minWidth: 360 }}>
            <EuiPanel className="mlFieldDataCard">
                <FieldHeader type={type} fieldName={fieldName} />
                <div className="mlFieldDataCard__content">
                    <div className="mlFieldDataCard__stats">
                        {getBody(type, totalCount, data, fieldName)}
                    </div>
                </div>
            </EuiPanel>
        </EuiFlexItem>
    );
};

function getBody(
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES],
    totalCount: number,
    data?: FieldStatData,
    fieldName?: string
) {
    if (type === 'date')
        return (
            <>
                {data?.earliest && (
                    <div>
                        Самая раняя дата:{' '}
                        {moment.unix(data.earliest / 1000).format('DD-MM-YYYY HH:mm:ss')}
                    </div>
                )}
                {data?.latest && (
                    <div>
                        Самая поздняя дата:{' '}
                        {moment.unix(data.latest / 1000).format('DD-MM-YYYY HH:mm:ss')}
                    </div>
                )}
            </>
        );
    if (type === 'text') return <ExampleList examples={data?.examples} />;

    return (
        <>
            <DocumentsCount count={data?.count ?? 0} totalCount={totalCount} />
            <DistinctValues distinctCount={data?.cardinality} />
            {type === 'number' && data && (data.avg || data.min || data.max) && (
                <NumberStat avg={data?.avg} max={data?.max} min={data?.min} />
            )}
            {data?.topValues && (
                <TopValues
                    topValues={data?.topValues}
                    count={data.count}
                    barColor={getColor(type)}
                />
            )}
        </>
    );
}

function getColor(
    type: string
): 'primary' | 'secondary' | 'danger' | 'subdued' | 'accent' {
    if (type === 'keyword') return 'secondary';

    return 'primary';
}
