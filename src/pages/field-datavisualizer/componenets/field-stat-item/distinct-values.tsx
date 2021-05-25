import React, {FC} from "react";
import {EuiIcon, EuiSpacer, EuiText} from "@elastic/eui";

interface Props {
    distinctCount?: number
}

export const DistinctValues: FC<Props> = ({ distinctCount }) => {
    if (distinctCount) {
        return (
            <>
                <div>
                    <EuiText size="xs" color="subdued">
                        <EuiIcon type={"database"} />
                        {distinctCount} уникальных значений
                    </EuiText>
                </div>
                <EuiSpacer size={"m"} />
            </>
        )
    }

    return null;
};

