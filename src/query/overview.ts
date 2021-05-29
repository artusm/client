import client from 'redaxios';
import { get } from 'get-wild';

const DEFAULT_SIZE = 3;

interface Counts {
    ray: number;
    access: number;
    driver: number;
    total: number;
}

export const loadLogTypeCounts = async (): Promise<Counts> => {
    try {
        const { data } = await client.post('http://localhost:9200/li-*/_search', {
            size: 0,
            aggs: {
                log_type_count: {
                    terms: {
                        field: 'log_type',
                        size: DEFAULT_SIZE,
                    },
                },
            },
        });

        const buckets = get(data, 'aggregations.log_type_count.buckets');

        const {
            ray = 0,
            access = 0,
            driver = 0,
        } = buckets.reduce((res, { key, doc_count }) => {
            res[key] = doc_count;

            return res;
        }, {} as Record<string, number>);

        return {
            ray,
            access,
            driver,
            total: ray + access + driver,
        };
    } catch (e) {
        return {
            ray: 0,
            access: 0,
            driver: 0,
            total: 0,
        };
    }
};

export const loadErrorCount = async (): Promise<number> => {
    try {
        const { data } = await client.post('http://localhost:9200/li-*/_search', {
            size: 0,
            track_total_hits: true,
            query: {
                bool: {
                    should: [
                        {
                            range: {
                                'esl_status.Errcode': {
                                    gt: 0,
                                },
                            },
                        },
                        {
                            range: {
                                'esl_database_status.errcode': {
                                    gt: 0,
                                },
                            },
                        },
                        {
                            range: {
                                'event.error': {
                                    gt: 0,
                                },
                            },
                        },
                        {
                            match: {
                                level: 'ERROR',
                            },
                        },
                    ],
                },
            },
        });

        return get(data, 'hits.total.value') ?? 0;
    } catch (e) {
        return 0;
    }
};

export const loadAnomalyLogsCount = async () => {
    try {
        const { data } = await client.post('http://localhost:9200/li-*/_search', {
            size: 0,
            track_total_hits: true,
            query: {
                bool: {
                    filter: [
                        {
                            exists: {
                                field: 'anomaly_category',
                            },
                        },
                    ],
                },
            },
        });

        return get(data, 'hits.total.value') ?? 0;
    } catch (e) {
        return 0;
    }
};
