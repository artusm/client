import React from "react";
import {EuiIcon, EuiSpacer, EuiText} from "@elastic/eui";
import {getPercentLabel} from "../TopValues";

interface Props {
    count?: number;
    totalCount?: number
}

export const DocumentsCount = ({count, totalCount}) => {
    return (
        <>
            <div>
                <EuiText size="xs" color="subdued">
                    <EuiIcon type={"document"} />
                    {count} документов ({getPercentLabel(count, totalCount)})
                </EuiText>
            </div>
            <EuiSpacer size={"xs"} />
        </>
    )
};

