import React, {useEffect, useState} from 'react';
import Header from "../../components/root/Header";
import {
    EuiFlexGroup,
    EuiFlexItem, EuiIcon,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader, EuiPanel, EuiStat,
    EuiSearchBar,
    EuiCallOut
} from "@elastic/eui";
import moment from "moment";
import {humanNumber} from "../../utils/human-number";
import SearchBar from "./components/search-bar";
import {Datepicker} from "./components/datepicker";
import {QueryContainer} from "@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl";
import client from "redaxios";
import {get} from "get-wild";
import {merge} from 'lodash';
import Chart from "react-apexcharts";

const convertDatesToLocal = (dates) => {
    if (dates && Array.isArray(dates)) {
        return dates.map(d => moment(d).utcOffset(180).format('YYYY-MM-DD HH:mm:ss'))
    }

    return [];
}
function isEmpty(obj) {
    for(let prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}
const loadData = async (query: QueryContainer, startTime, endTime) => {
    try {
        let newQuery = {
            "bool": {
                "filter": [
                    {
                        "range": {
                            "@timestamp": {
                                "gte": startTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                                "lte": endTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                            }
                        }
                    }
                ]
            }
        };

        if (!isEmpty(query?.match_all)) {
            newQuery = merge(newQuery, query);
        }


        const {data} = await client.post('http://localhost:9200/li-*/_search', {
            "size": 0,
            "query": newQuery,
            "aggs": {
                "histogram": {
                    "auto_date_histogram": {
                        "field": "@timestamp",
                        "buckets": 20
                    }
                }
            }
        });

        const dates = convertDatesToLocal(get(data, 'aggregations.histogram.buckets.*.key_as_string') ?? []);
        const xxl1 = get(data, 'aggregations.histogram.buckets.*.doc_count') ?? [];

        return {
            dates,
            xxl1
        };
    } catch (e) {
        return [];
    }
};

const useData = () => {
    const [error, setError] = useState<any>(null);
    const [query, setQuery] = useState<QueryContainer>({});
    const [isLoading, setIsLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [data, setData] = useState<any>(null);

    const onTimeChange = (start, end) => {
        setStartTime(start);
        setEndTime(end);
    };

    const onSearch = (query, error) => {
        if (query) {
            setQuery(EuiSearchBar.Query.toESQuery(query));
        }
        setError(error);
    }

    useEffect(() => {
        if (!error && query && startTime && endTime) {
            const load = async () => {
                try {
                    const data = await loadData(query, startTime, endTime);
                    setData(data)
                } catch (e) {}

                setIsLoading(false);
            };
            setIsLoading(true);
            load();
        }
    }, [error, query, startTime, endTime]);

    return {
        isLoading,
        data,
        onTimeChange,
        error,
        onSearch,
        query,
    }
}

const StatPage = () => {
    const {isLoading, data, onTimeChange, onSearch, error, query} = useData();
    useEffect(() => {
        // @ts-ignore
        window.server.shutdown();

        return () => {
            //@ts-ignore
            console.log(window.server.start)
        }
    }, [])
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Главная",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="visualizeApp"
                        pageTitle="Статистика темпа добавления логов"
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <EuiFlexGroup alignItems="center">
                                <EuiFlexItem>
                                    <SearchBar onSearch={onSearch} />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <Datepicker isLoading={isLoading} onChange={onTimeChange} />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            {error && <EuiCallOut
                                iconType="faceSad"
                                color="danger"
                                title={`Ошибка при поиске: ${error?.message}`}
                            />}
                            {JSON.stringify(query)}
                            {JSON.stringify(data)}
                            {data && <Chart
                                // @ts-ignore
                                options={getOptions(data)}
                                series={getSeries(data)}
                                type="area"
                                width="1200"
                            />}
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    )
};

function getOptions(data) {
    return {
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: data.dates,
            labels: {
                datetimeUTC: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd.MM.yy HH:mm'
            },
        },
    }
}

function getSeries(data) {
    return [
        {
            name: "Количество",
            data: data.xxl1
        }
    ]
}

export default StatPage;
