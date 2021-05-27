import React, {FC, useEffect, useState} from "react";
import {EuiToolTip, EuiFlexItem, EuiFlexGroup, EuiText, EuiProgress, EuiSpacer,} from "@elastic/eui";
import classNames from "classnames";
import {ExpandedRowFieldHeader} from "./field-stat-item/ExampleList";
import {buildChartDataFromStats, MetricDistributionChartData} from "../utils/chart_builder";
import moment from "moment";
import {MetricDistributionChart} from "./charts/metric_distribution_chart";

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

const METRIC_DISTRIBUTION_CHART_WIDTH = 150;
const METRIC_DISTRIBUTION_CHART_HEIGHT = 80;

export interface NumberContentPreviewProps {
    fieldName: string;
    fieldFormat: string;
    stats: any[]
}

const SIGFIGS_IF_ROUNDING = 3;

export function formatSingleValue(
    value: number,
    func?: string,
    fieldFormat?: any,
    record?: any // TODO remove record, not needed for file upload
) {
    if (value === undefined || value === null) {
        return '';
    }

    // If the analysis function is time_of_week/day, format as day/time.
    // For time_of_week / day, actual / typical is the UTC offset in seconds from the
    // start of the week / day, so need to manipulate to UTC moment of the start of the week / day
    // that the anomaly occurred using record timestamp if supplied, add on the offset, and finally
    // revert back to configured timezone for formatting.
    if (func === 'time_of_week') {
        const d =
            record !== undefined && record.timestamp !== undefined
                ? new Date(record.timestamp)
                : new Date();
        const utcMoment = moment.utc(d).startOf('week').add(value, 's');
        return moment(utcMoment.valueOf()).format('ddd HH:mm');
    } else if (func === 'time_of_day') {
        const d =
            record !== undefined && record.timestamp !== undefined
                ? new Date(record.timestamp)
                : new Date();
        const utcMoment = moment.utc(d).startOf('day').add(value, 's');
        return moment(utcMoment.valueOf()).format('HH:mm');
    } else {
        if (fieldFormat !== undefined) {
            return fieldFormat.convert(value, 'text');
        } else {
            // If no Kibana FieldFormat object provided,
            // format the value depending on its magnitude.
            const absValue = Math.abs(value);
            if (absValue >= 10000 || absValue === Math.floor(absValue)) {
                // Output 0 decimal places if whole numbers or >= 10000
                if (fieldFormat !== undefined) {
                    return fieldFormat.convert(value, 'text');
                } else {
                    return Number(value.toFixed(0));
                }
            } else if (absValue >= 10) {
                // Output to 1 decimal place between 10 and 10000
                return Number(value.toFixed(1));
            } else {
                // For values < 10, output to 3 significant figures
                let multiple;
                if (value > 0) {
                    multiple = Math.pow(
                        10,
                        SIGFIGS_IF_ROUNDING - Math.floor(Math.log(value) / Math.LN10) - 1
                    );
                } else {
                    multiple = Math.pow(
                        10,
                        SIGFIGS_IF_ROUNDING - Math.floor(Math.log(-1 * value) / Math.LN10) - 1
                    );
                }
                return Math.round(value * multiple) / multiple;
            }
        }
    }
}

export const IndexBasedNumberContentPreview: FC<NumberContentPreviewProps> = ({ stats, fieldFormat, fieldName }) => {
    const defaultChartData: MetricDistributionChartData[] = [];
    const [distributionChartData, setDistributionChartData] = useState(defaultChartData);
    const [legendText, setLegendText] = useState<{ min: number; max: number } | undefined>();

    useEffect(() => {
        const chartData = buildChartDataFromStats(stats, METRIC_DISTRIBUTION_CHART_WIDTH);
        console.log(chartData)
        if (
            Array.isArray(chartData) &&
            chartData[0].x !== undefined &&
            chartData[chartData.length - 1].x !== undefined
        ) {
            setDistributionChartData(chartData);
            setLegendText({
                min: formatSingleValue(chartData[0].x),
                max: formatSingleValue(chartData[chartData.length - 1].x),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="dataGridChart__histogram">
                {/* @ts-ignore */}
                <MetricDistributionChart
                    width={METRIC_DISTRIBUTION_CHART_WIDTH}
                    height={METRIC_DISTRIBUTION_CHART_HEIGHT}
                    chartData={distributionChartData}
                    fieldFormat={fieldFormat}
                    hideXAxis={true}
                />
            </div>
            <div className={'dataGridChart__legend'}>
                {legendText && (
                    <>
                        <EuiSpacer size="s" />
                        <EuiFlexGroup direction={'row'}>
                            <EuiFlexItem className={'dataGridChart__legend'}>
                                {legendText.min}
                            </EuiFlexItem>
                            <EuiFlexItem
                                className={classNames('dataGridChart__legend', 'dataGridChart__legend--numeric')}
                            >
                                {legendText.max}
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </>
                )}
            </div>
        </div>
    );
};

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


