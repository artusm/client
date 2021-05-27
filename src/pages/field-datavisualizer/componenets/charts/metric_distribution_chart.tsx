/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { FC } from 'react';

import {
    AreaSeries,
    Axis,
    Chart,
    CurveType,
    Position,
    ScaleType,
    Settings,
    TooltipValue,
    TooltipValueFormatter,
} from '@elastic/charts';

interface Props {
    chartPoint: MetricDistributionChartData | undefined;
    maxWidth: number;
    fieldFormat?: any; // Kibana formatter for field being viewed
}

export const MetricDistributionChartTooltipHeader: FC<Props> = ({
                                                                    chartPoint,
                                                                    maxWidth,
                                                                    fieldFormat,
                                                                }) => {
    if (chartPoint === undefined) {
        return null;
    }

    return (
        <div style={{ maxWidth }}>
            {chartPoint.dataMax > chartPoint.dataMin ? (
                "{percent}% of documents have values between {minValFormatted} and {maxValFormatted}"

            ) : (
                "{percent}% of documents have a value of {valFormatted}"
            )}
        </div>
    );
};

interface ChartTooltipValue extends TooltipValue {
    skipHeader?: boolean;
}

export interface MetricDistributionChartData {
    x: number;
    y: number;
    dataMin: number;
    dataMax: number;
    percent: number;
}

interface Props {
    width: number;
    height: number;
    chartData: MetricDistributionChartData[];
    fieldFormat?: any; // Kibana formatter for field being viewed
    hideXAxis?: boolean;
}

const SPEC_ID = 'metric_distribution';

export const MetricDistributionChart: FC<Props> = ({
                                                       width,
                                                       height,
                                                       chartData,
                                                       fieldFormat,
                                                       hideXAxis,
                                                   }) => {
    const seriesName =  'distribution'

    console.log('c', chartData)


    return (
        <div>
            <Chart size={{ width, height }}>
                <Settings />
                <Axis
                    id="bottom"
                    position={Position.Bottom}
                    tickFormat={(d) => d}
                />
                <Axis id="left" position={Position.Left} tickFormat={(d) => d.toFixed(3)} />
                <AreaSeries
                    id={SPEC_ID}
                    name={seriesName}
                    xScaleType={ScaleType.Linear}
                    yScaleType={ScaleType.Linear}
                    xAccessor="x"
                    yAccessors={['y']}
                    data={chartData.length > 0 ? chartData : [{ x: 0, y: 0 }]}
                    curve={CurveType.CURVE_STEP_AFTER}
                />
            </Chart>
        </div>
    );
};
