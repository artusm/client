import React, { FC } from 'react';
import { EuiToken, EuiToolTip } from '@elastic/eui';
import { FIELD_TYPES } from '../../../../common/field_types';

interface FieldTypeIconProps {
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
    fieldName?: string;
}

interface FieldTypeIconContainerProps {
    iconType: string;
    color: string;
    [key: string]: any;
}

export const FieldTypeIcon: FC<FieldTypeIconProps> = ({
    type,
    fieldName,
}) => {
    let iconType = 'questionInCircle';
    let color = 'euiColorVis6';

    switch (type) {
        case FIELD_TYPES.DATE:
            iconType = 'tokenDate';
            color = 'euiColorVis7';
            break;
        case FIELD_TYPES.TEXT:
            iconType = 'document';
            color = 'euiColorVis9';
            break;
        case FIELD_TYPES.KEYWORD:
            iconType = 'tokenText';
            color = 'euiColorVis0';
            break;
        case FIELD_TYPES.NUMBER:
            iconType = 'tokenNumber';
            color = fieldName !== undefined ? 'euiColorVis1' : 'euiColorVis2';
            break;
        case FIELD_TYPES.UNKNOWN:
            break;
    }

    const containerProps = {
        iconType,
        color,
    };

    return (
        <EuiToolTip
            position="left"
            content={`Тип: ${type}`}
        >
            <FieldTypeIconContainer {...containerProps} />
        </EuiToolTip>
    );
};

const FieldTypeIconContainer: FC<FieldTypeIconContainerProps> = ({
    iconType,
    color,
    ...rest
}) => {
    return (
        <span {...rest}>
            <span className="field-type-icon">
                <EuiToken iconType={iconType} shape="square" size="s" color={color} />
            </span>
        </span>
    );
};
