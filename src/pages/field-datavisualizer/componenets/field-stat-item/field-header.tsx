import React, {FC} from 'react';
import {FieldTypeIcon} from "./field_type_icon";
import {FIELD_TYPES} from "../../../../common/field_types";
import {EuiToolTip, EuiText} from "@elastic/eui";

interface FieldHeaderProps {
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
    fieldName?: string;
}

export const FieldHeader: FC<FieldHeaderProps> = ({
    type,
    fieldName,
}) => {

    return (
        <EuiText
            className={`ml-field-title-bar ${type}`}
        >
            <FieldTypeIcon type={type} fieldName={fieldName} />
            <EuiToolTip
                position="left"
                content={fieldName}
            >
                <div
                    className="field-name"
                >
                    {fieldName}
                </div>
            </EuiToolTip>
        </EuiText>
    )
}
