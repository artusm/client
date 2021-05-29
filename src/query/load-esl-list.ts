import client from 'redaxios';
import { get } from 'get-wild';

const DEFAULT_SIZE = 3000;

interface EslList {
    esl: number;
    docCount: number;
}

export const loadEslList = async (): Promise<EslList[]> => {
    try {
        const { data } = await client.post('http://localhost:9200/li-*/_search', {
            size: 0,
            aggs: {
                esls: {
                    composite: {
                        size: DEFAULT_SIZE,
                        sources: [
                            {
                                esl: {
                                    terms: {
                                        field: 'esl',
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        });

        const buckets = get(data, 'aggregations.esls.buckets');

        return buckets.map((bucket) => ({
            esl: bucket.key.esl,
            docCount: bucket.doc_count,
        }));
    } catch (e) {
        return [];
    }
};
