import client from 'redaxios';
import { get, find, last, chunk } from 'lodash';

import { FIELD_TYPES } from '../common/field_types';
import {
    buildSamplerAggregation,
    getSamplerAggregationsResponsePath,
} from './query_utils';
import { stringHash } from './string';
import { Moment } from 'moment';
import { isEmpty } from './object';

const SAMPLER_TOP_TERMS_SHARD_SIZE = 5000;

export interface HistogramField {
    fieldName: string;
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES];
}

export function getSafeAggregationName(
    fieldName: string,
    index: number
): string {
    return fieldName.match(/^[a-zA-Z0-9-_.]+$/) ? fieldName : `field_${index}`;
}

export const getNonTextFieldStats = async (
    fields: HistogramField[],
    query: any,
    earliest: Moment | undefined,
    latest: Moment | undefined,
    samplerShardSize: number
) => {
    const MAX_PERCENT = 100;
    const PERCENTILE_SPACING = 5;
    let count = 0;
    const percents = Array.from(
        Array(MAX_PERCENT / PERCENTILE_SPACING),
        () => (count += PERCENTILE_SPACING)
    );

    const aggs = fields.reduce((aggs, field) => {
        const id = stringHash(field.fieldName);

        if (field.type === FIELD_TYPES.NUMBER || field.type === FIELD_TYPES.DATE) {
            aggs[`${id}_field_stats`] = {
                filter: { exists: { field: field.fieldName } },
                aggs: {
                    actual_stats: {
                        stats: { field: field.fieldName },
                    },
                },
            };
        }

        // if (field.type === FIELD_TYPES.NUMBER) {
        //     aggs[`${id}_percentiles`] = {
        //         percentiles: {
        //             field: field.fieldName,
        //             percents,
        //             keyed: false,
        //         },
        //     };
        // }

        if (field.type === FIELD_TYPES.KEYWORD) {
            aggs[`${id}_count`] = {
                value_count: {
                    field: field.fieldName,
                },
            };
        }

        if (
            field.type === FIELD_TYPES.KEYWORD ||
            field.type === FIELD_TYPES.NUMBER
        ) {
            aggs[`${id}_cardinality`] = {
                cardinality: {
                    field: field.fieldName,
                },
            };

            const top = {
                terms: {
                    field: field.fieldName,
                    size: 10,
                    order: {
                        _count: 'desc',
                    },
                },
            };

            if (samplerShardSize > 1) {
                aggs[`${id}_top`] = {
                    sampler: {
                        shard_size: SAMPLER_TOP_TERMS_SHARD_SIZE,
                    },
                    aggs: {
                        top,
                    },
                };
            } else {
                aggs[`${id}_top`] = top;
            }
        }

        return aggs;
    }, {} as Record<string, object>);

    const filterCriteria = buildBaseFilterCriteria(earliest, latest, query);
    const { data } = await client.post('http://localhost:9200/li-*/_search', {
        query: {
            bool: {
                filter: filterCriteria,
            },
        },
        aggs: buildSamplerAggregation(aggs, samplerShardSize),
        size: 0,
    });

    const aggregations = data.aggregations;
    const aggsPath = getSamplerAggregationsResponsePath(samplerShardSize);

    const stats = fields.map((field) => {
        const id = stringHash(field.fieldName);
        const stats: any = {
            fieldName: field.fieldName,
            fieldType: field.type,
        };

        if (field.type === FIELD_TYPES.NUMBER || field.type === FIELD_TYPES.DATE) {
            const docCount = get(
                aggregations,
                [...aggsPath, `${id}_field_stats`, 'doc_count'],
                0
            );
            const fieldStatsResp = get(
                aggregations,
                [...aggsPath, `${id}_field_stats`, 'actual_stats'],
                {}
            );

            stats.count = docCount;

            if (field.type === FIELD_TYPES.NUMBER) {
                stats.min = get(fieldStatsResp, 'min', 0);
                stats.max = get(fieldStatsResp, 'max', 0);
                stats.avg = get(fieldStatsResp, 'avg', 0);
            } else {
                stats.earliest = get(fieldStatsResp, 'min', 0);
                stats.latest = get(fieldStatsResp, 'max', 0);
            }
        }

        if (field.type === FIELD_TYPES.KEYWORD) {
            stats.count = get(aggregations, [...aggsPath, `${id}_count`, 'value'], 0);
        }

        if (
            field.type === FIELD_TYPES.KEYWORD ||
            field.type === FIELD_TYPES.NUMBER
        ) {
            const topAggsPath = [...aggsPath, `${id}_top`];
            if (samplerShardSize > 1) {
                topAggsPath.push('top');
            }

            const topValues = get(aggregations, [...topAggsPath, 'buckets'], []);
            const cardinality = get(
                aggregations,
                [...aggsPath, `${id}_cardinality`, 'value'],
                0
            );

            stats.topValues = topValues;
            stats.cardinality = cardinality;
        }

        // if (field.type === FIELD_TYPES.NUMBER) {
        //     if (stats.count > 0) {
        //         const percentiles = get(
        //             aggregations,
        //             [...aggsPath, `${id}_percentiles`, 'values'],
        //             []
        //         );
        //         const medianPercentile: { value: number; key: number } | undefined =
        //             find(percentiles, {
        //                 key: 50,
        //             });
        //         stats.median =
        //             medianPercentile !== undefined ? medianPercentile!.value : 0;
        //         stats.distribution = processDistributionData(
        //             percentiles,
        //             PERCENTILE_SPACING,
        //             stats.min
        //         );
        //     }
        // }

        return stats;
    });

    return stats;
};

const getFieldExamples = async (
    field: HistogramField,
    query: any,
    earliest: Moment | undefined,
    latest: Moment | undefined,
    samplerShardSize: number,
    maxExamples = 10
) => {
    const filterCriteria: any[] = buildBaseFilterCriteria(
        earliest,
        latest,
        query
    );

    filterCriteria.push({
        exists: {
            field: field.fieldName,
        } as any,
    } as any);

    const { data } = await client.post('http://localhost:9200/li-*/_search', {
        size: Math.max(100, maxExamples),
        _source: [field.fieldName],
        query: {
            bool: {
                filter: filterCriteria,
            },
        },
    });

    const stats = {
        fieldName: field.fieldName,
        fieldType: field.type,
        examples: [] as any[],
    };

    if (data.hits.total.value > 0) {
        const hits = data.hits.hits;
        for (let i = 0; i < hits.length; i++) {
            const example: object[] | undefined = get(
                hits[i]._source,
                field.fieldName
            );

            if (example !== undefined && stats.examples.indexOf(example) === -1) {
                stats.examples.push(example);
                if (stats.examples.length === maxExamples) {
                    break;
                }
            }
        }
    }

    return [stats];
};

const getTotalCount = async (
    query: any,
    earliest: Moment | undefined,
    latest: Moment | undefined
) => {
    const filterCriteria = buildBaseFilterCriteria(earliest, latest, query);
    const { data } = await client.post('http://localhost:9200/li-*/_search', {
        size: 0,
        track_total_hits: true,
        query: {
            bool: {
                filter: filterCriteria,
            },
        },
    });

    return {
        totalCount: get(data, ['hits', 'total', 'value'], 0),
    };
};

export const getFieldStats = async (
    fields: HistogramField[],
    query: any,
    earliest: Moment | undefined,
    latest: Moment | undefined,
    samplerShardSize: number = -1
) => {
    const nonTextFields = fields.filter(
        (field) => field.type !== FIELD_TYPES.TEXT
    );
    const textFields = fields.filter((field) => field.type === FIELD_TYPES.TEXT);

    const promisses: Promise<any>[] = [];
    const result = {
        totalCount: 0,
        fields: [],
    };

    promisses.push(getTotalCount(query, earliest, latest));

    chunk(nonTextFields, 3).forEach((fields) => {
        promisses.push(
            getNonTextFieldStats(fields, query, earliest, latest, samplerShardSize)
        );
    });

    textFields.forEach((field) => {
        promisses.push(
            getFieldExamples(field, query, earliest, latest, samplerShardSize)
        );
    });

    const stats = await Promise.all(promisses);

    stats.forEach((s) => {
        if (Array.isArray(s)) {
            // @ts-ignore
            result.fields.push(...s);
        } else if (s && 'totalCount' in s) {
            result.totalCount = s.totalCount;
        }
    });

    return result;
};

interface Distribution {
    percentiles: any[];
    minPercentile: number;
    maxPercentile: number;
}

export function buildBaseFilterCriteria(
    earliest?: Moment,
    latest?: Moment,
    query?: any
) {
    const filterCriteria: any[] = [];
    if (earliest && latest) {
        filterCriteria.push({
            range: {
                '@timestamp': {
                    gte: earliest.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                    lte: latest.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                },
            },
        });
    }

    if (query && !isEmpty(query)) {
        filterCriteria.push(query);
    }

    return filterCriteria;
}

const processDistributionData = (
    percentiles: Array<{ value: number }>,
    percentileSpacing: number,
    minValue: number
): Distribution => {
    const distribution: Distribution = {
        percentiles: [],
        minPercentile: 0,
        maxPercentile: 100,
    };
    if (percentiles.length === 0) {
        return distribution;
    }

    let percentileBuckets: Array<{ value: number }> = [];
    let lowerBound = minValue;
    if (lowerBound >= 0) {
        distribution.minPercentile = 0;
        distribution.maxPercentile = 90;
        percentileBuckets = percentiles.slice(0, percentiles.length - 2);

        const lastValue = (last(percentileBuckets) as any).value;
        const upperBound = lowerBound + 1.5 * (lastValue - lowerBound);
        const filteredLength = percentileBuckets.length;
        for (let i = filteredLength; i < percentiles.length; i++) {
            if (percentiles[i].value < upperBound) {
                percentileBuckets.push(percentiles[i]);
                distribution.maxPercentile += percentileSpacing;
            } else {
                break;
            }
        }
    } else {
        const dataMin = lowerBound;
        lowerBound = percentiles[0].value;
        distribution.minPercentile = 5;
        distribution.maxPercentile = 95;
        percentileBuckets = percentiles.slice(1, percentiles.length - 1);

        const lastValue: number = (last(percentileBuckets) as any).value;
        const maxDiff = 0.25 * (lastValue - lowerBound);
        if (lowerBound - dataMin < maxDiff) {
            percentileBuckets.splice(0, 0, percentiles[0]);
            distribution.minPercentile = 0;
            lowerBound = dataMin;
        }

        if (percentiles[percentiles.length - 1].value - lastValue < maxDiff) {
            percentileBuckets.push(percentiles[percentiles.length - 1]);
            distribution.maxPercentile = 100;
        }
    }

    const totalBuckets = percentileBuckets.length;
    let lastBucketValue = lowerBound;
    let numEqualValueBuckets = 0;
    for (let i = 0; i < totalBuckets; i++) {
        const bucket = percentileBuckets[i];

        if (bucket.value.toPrecision(15) !== lastBucketValue.toPrecision(15)) {
            if (numEqualValueBuckets > 0) {
                distribution.percentiles.push({
                    percent: numEqualValueBuckets * percentileSpacing,
                    minValue: lastBucketValue,
                    maxValue: lastBucketValue,
                });
            }

            distribution.percentiles.push({
                percent: percentileSpacing,
                minValue: lastBucketValue,
                maxValue: bucket.value,
            });

            lastBucketValue = bucket.value;
            numEqualValueBuckets = 0;
        } else {
            numEqualValueBuckets++;
            if (i === totalBuckets - 1) {
                distribution.percentiles.push({
                    percent: numEqualValueBuckets * percentileSpacing,
                    minValue: lastBucketValue,
                    maxValue: lastBucketValue,
                });
            }
        }
    }

    return distribution;
};
