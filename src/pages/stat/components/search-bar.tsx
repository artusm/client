import React, {FC} from 'react';
import {EuiHealth, EuiSearchBar} from "@elastic/eui";
import { get } from "get-wild";
import client from "redaxios";

interface Props {
    onSearch?: (query: string, error: any) => void;
}


const loadEslList = async () => {
    try {
        const {data} = await client.post('http://localhost:9200/li-*/_search', {
            "size": 0,
            "aggs": {
                "langs": {
                    "composite": {
                        "size": 3000,
                        "sources": [
                            {
                                "esl": {
                                    "terms": {
                                        "field": "esl"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });

        console.log(data)

        return get(data, "aggregations.langs.buckets");
    } catch (e) {
        console.log(e)
        return [];
    }
};


const initialQuery = EuiSearchBar.Query.MATCH_ALL;

const loadFilterEsl = () => {
    return new Promise(async (resolve) => {
        const esl = await loadEslList();
        resolve(
            esl.map((b) => ({
                value: b.key.esl,
                view: (<span className="eui-textTruncate eui-displayBlock">
            {b.key.esl}
        </span>)
            }))
        );

    });
};

const filters = [
    {
        type: 'field_value_selection',
        field: 'esl',
        name: 'ESL',
        multiSelect: false,
        operator: 'eq',
        cache: 10000,
        options: () => loadFilterEsl(),
        loadingMessage: 'Загрузка...',
        value: 0,
    },
    {
        type: 'field_value_toggle_group',
        field: 'level',
        items: [
            {
                value: 'DEBUG',
                name: 'DEBUG',
            },
            {
                value: 'INFO',
                name: 'INFO',
            },
            {
                value: 'WARNING',
                name: 'WARNING',
            },
            {
                value: 'ERROR',
                name: 'ERROR',
            },
        ],
    },
    {
        type: 'field_value_toggle_group',
        field: 'log_type',
        items: [
            {
                value: 'ray',
                name: 'ray',
            },
            {
                value: 'access',
                name: 'access',
            },
            {
                value: 'driver',
                name: 'driver',
            },
        ],
    },
]




const schema = {
    strict: true,
    fields: {
        esl: {
            type: 'number'
        },
        '@timestamp': {
            type: 'date'
        },
        log_type: {
            type: 'string'
        },
        level: {
            type: 'string'
        },
        message: {
            type: 'string'
        },
        read_at: {
            type: 'date'
        },
        source: {
            type: 'string'
        },
        offset: {
            type: 'number'
        },
        'machine.hostname': {
            type: 'string'
        },
        type: {
            type: 'string'
        },


    },
};

const SearchBar: FC<Props> = ({ onSearch }) => {
    const onChange = ({ query, error }) => {
        if (onSearch) {
            onSearch(query, error);
        }
    };

    return (
        <EuiSearchBar
            defaultQuery={initialQuery}
            box={{
                placeholder: 'Пример: esl:2000000312321 message:test',
                schema
            }}
            // @ts-ignore
            filters={filters}
            onChange={onChange}
        />
    )
};

export default SearchBar;
