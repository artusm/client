import React, { useEffect, useState } from 'react';
import Header from '../../components/root/Header';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiSearchBar,
    EuiCallOut,
} from '@elastic/eui';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';
import client from 'redaxios';
import { get } from 'get-wild';
import Chart from 'react-apexcharts';

import SearchBar from '../../components/search-bar';
import { Datepicker } from '../../components/datepicker';
import { convertDatesToLocal } from '../../utils/date';
import { DEFAULT_CONFIG, TimeBuckets } from '../../utils/time_buckets';
import { buildBaseFilterCriteria } from '../../utils/agg-intervals';

const loadData = async (query: QueryContainer, startTime, endTime) => {
    const timeBuckets = new TimeBuckets(DEFAULT_CONFIG);

    timeBuckets.setBounds({
        min: startTime,
        max: endTime,
    });

    let filterCriteria = buildBaseFilterCriteria(startTime, endTime, query);

    const { data } = await client.post('http://localhost:9200/li-*/_search', {
        size: 0,
        query: {
            bool: {
                filter: filterCriteria,
            },
        },
        aggs: {
            histogram: {
                histogram: {
                    field: '@timestamp',
                    interval: timeBuckets.getInterval().asMilliseconds(),
                },
            },
        },
    });

    const dates = convertDatesToLocal(
        get(data, 'aggregations.histogram.buckets.*.key_as_string') ?? []
    );
    const xxl1 = get(data, 'aggregations.histogram.buckets.*.doc_count') ?? [];

    return {
        dates,
        xxl1,
        dateFormat: timeBuckets.getScaledDateFormat(),
    };
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
    };

    useEffect(() => {
        if (!error && query && startTime && endTime) {
            const load = async () => {
                try {
                    const data = await loadData(query, startTime, endTime);
                    setData(data);
                } catch (e) {
                    setError(e);
                }

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
    };
};

const StatPage = () => {
    const { isLoading, data, onTimeChange, onSearch, error } = useData();

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Статистика темпа добавления логов',
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
                            {error && (
                                <EuiCallOut
                                    iconType="faceSad"
                                    color="danger"
                                    title={`Ошибка при поиске: ${error?.message}`}
                                />
                            )}
                            {data && (
                                <Chart
                                    // @ts-ignore
                                    options={getOptions(data)}
                                    series={getSeries(data)}
                                    type="area"
                                    width="1200"
                                />
                            )}
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

function getOptions(data) {
    return {
        chart: {
            height: 350,
            type: 'area',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime',
            categories: data.dates,
            labels: {
                datetimeUTC: false,
                format: data.dateFormat,
            },
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: data.dateFormat,
            },
        },
    };
}

function getSeries(data) {
    return [
        {
            name: 'Количество',
            data: data.xxl1,
        },
    ];
}

export default StatPage;
