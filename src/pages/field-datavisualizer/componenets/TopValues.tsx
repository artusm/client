import React, {FC, useEffect, useState} from "react";
import {EuiToolTip, EuiFlexItem, EuiFlexGroup, EuiText, EuiProgress,} from "@elastic/eui";
import classNames from "classnames";
import {ExpandedRowFieldHeader} from "./field-stat-item/ExampleList";

export interface TopValue {
    key: any,
    doc_count: number;
}

interface Props {
    topValues?: TopValue[]
    count?: number
    barColor?: 'primary' | 'secondary' | 'danger' | 'subdued' | 'accent';
}

export function getPercentLabel(docCount: number, count: number): string {
    const percent = (100 * docCount) / count;
    if (percent >= 0.1) {
        return `${roundToDecimalPlace(percent, 1)}%`;
    } else {
        return '< 0.1%';
    }
}

function roundToDecimalPlace(num?: number, dp: number = 2): number | string {
    if (num === undefined) return '';
    if (num % 1 === 0) {
        return num;
    }

    if (Math.abs(num) < Math.pow(10, -dp)) {
        return Number.parseFloat(String(num)).toExponential(2);
    }
    const m = Math.pow(10, dp);
    return Math.round(num * m) / m;
}





export const TopValues: FC<Props> = ({ topValues, count, barColor }) => {

    const progressBarMax = count;
    return (
        <EuiFlexItem>
            <ExpandedRowFieldHeader>
                Наиболее встречающиеся значения
            </ExpandedRowFieldHeader>

            <div className={'mlFieldDataTopValuesContainer'}>
                {Array.isArray(topValues) &&
                topValues.map((value) => (
                    <EuiFlexGroup gutterSize="xs" alignItems="center" key={value.key}>
                        <EuiFlexItem
                            grow={false}
                            className={classNames(
                                'eui-textTruncate',
                                'mlTopValuesValueLabelContainer',
                                `mlTopValuesValueLabelContainer--small`
                            )}
                        >
                            <EuiToolTip content={value.key} position="right">
                                <EuiText size="xs" textAlign={'right'} color="subdued">
                                    {value.key}
                                </EuiText>
                            </EuiToolTip>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiProgress
                                value={value.doc_count}
                                max={progressBarMax}
                                color={barColor}
                                size="m"
                            />
                        </EuiFlexItem>
                        {progressBarMax !== undefined && (
                            <EuiFlexItem
                                grow={false}
                                className={classNames('eui-textTruncate', 'mlTopValuesPercentLabelContainer')}
                            >
                                <EuiText size="xs" textAlign="left" color="subdued">
                                    {getPercentLabel(value.doc_count, progressBarMax)}
                                </EuiText>
                            </EuiFlexItem>
                        )}
                    </EuiFlexGroup>
                ))}
            </div>
        </EuiFlexItem>
    );
};


