import React, {FC} from "react";
import {EuiFlexGroup, EuiFlexItem} from "@elastic/eui";

interface Props {
    min?: number;
    avg?: number;
    max?: number;
}

export const NumberStat: FC<Props> = ({ min = 0, max = 0, avg = 0}) => {
    return (
        <>
            <EuiFlexGroup direction={'column'} gutterSize={'xs'}>
                <EuiFlexGroup gutterSize="xs">
                    <EuiFlexItem>
                        <b>
                            мин.
                        </b>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <b>
                            сред.
                        </b>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <b>
                            макс.
                        </b>
                    </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup gutterSize="xs">
                    <EuiFlexItem>{min}</EuiFlexItem>
                    <EuiFlexItem>{avg}</EuiFlexItem>
                    <EuiFlexItem>{max}</EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexGroup>
        </>
    )
};

