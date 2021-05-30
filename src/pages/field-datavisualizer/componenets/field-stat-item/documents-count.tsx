import React, {FC} from 'react';
import { EuiIcon, EuiSpacer, EuiText } from '@elastic/eui';
import { getPercentLabel } from '../TopValues';

interface Props {
    count: number;
    totalCount: number;
}

export const DocumentsCount: FC<Props> = ({ count, totalCount }) => {
    return (
        <>
            <div>
                <EuiText size="xs" color="subdued">
                    <EuiIcon type="document" />
                    {count} документов ({getPercentLabel(count, totalCount)})
                </EuiText>
            </div>
            <EuiSpacer size="xs" />
        </>
    );
};
