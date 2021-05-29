import Header from '../../components/root/Header';
import {
    EuiCallOut,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiSearchBar,
    EuiBasicTable,
    EuiButtonIcon,
    EuiLoadingContent,
    EuiText,
} from '@elastic/eui';
import { get } from 'lodash';

import { RIGHT_ALIGNMENT } from '@elastic/eui/lib/services';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/search-bar';
import { Datepicker } from '../../components/datepicker';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';
import client from 'redaxios';
import { buildBaseFilterCriteria } from '../../utils/agg-intervals';
import moment, { Moment } from 'moment';
import ReactJson from 'react-json-view';

interface LoadDataOptions {
    earliest: Moment;
    latest: Moment;
    pageSize: number;
    query: QueryContainer;
    pageIndex: number;
    sorting: {
        field: string;
        direction: string;
    };
}

const loadData = async ({
                            earliest,
                            latest,
                            pageSize,
                            query,
                            pageIndex,
                            sorting,
                        }: LoadDataOptions) => {
    let filterCriteria = buildBaseFilterCriteria(earliest, latest, query);

    filterCriteria.push({
        exists: {
            field: 'anomaly_category',
        } as any,
    } as any);

    const from = pageSize * pageIndex;

    const { data } = await client.post('http://localhost:9200/li-*/_search', {
        size: pageSize,
        from,
        query: {
            bool: {
                filter: filterCriteria,
            },
        },
        sort: [
            {
                [sorting.field]: sorting.direction,
            },
        ],
    });

    const hits = get(data, 'hits.hits', []);

    return {
        total: get(data, 'hits.total.value', 0),
        items: hits.map((hit) => ({
            id: hit._id,
            '@timestamp': moment(get(hit, '_source.@timestamp')).calendar(),
            category: get(hit, '_source.anomaly_category'),
            hit: hit,
        })),
    };
};

const useData = () => {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [items, setItems] = useState([]);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [sortField, setSortField] = useState('@timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState({});
    const [earliest, setEarliest] = useState<Moment | null>(null);
    const [latest, setLatest] = useState<Moment | null>(null);

    const onTableChange = ({ page = {}, sort = {} }) => {
        const { index: pageIndex, size: pageSize }: any = page;

        const { field: sortField, direction: sortDirection }: any = sort;

        setPageIndex(pageIndex);
        setPageSize(pageSize);
        setSortField(sortField);
        setSortDirection(sortDirection);
    };

    const onTimeChange = (start, end) => {
        setEarliest(start);
        setLatest(end);
    };

    const onSearch = (query, error) => {
        if (query) {
            setQuery(EuiSearchBar.Query.toESQuery(query));
        }
        setError(error);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setItemIdToExpandedRowMap({});
            try {
                const { items, total } = await loadData({
                    earliest: earliest!,
                    latest: latest!,
                    pageSize,
                    query,
                    pageIndex,
                    sorting: {
                        field: sortField,
                        direction: sortDirection,
                    },
                });

                setItems(items);
                setTotalItemCount(total);
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        };

        if (earliest && latest) {
            load();
        }
    }, [query, pageSize, sortField, sortDirection, pageIndex, earliest, latest]);

    const toggleDetails = (item) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        if (itemIdToExpandedRowMapValues[item.id]) {
            delete itemIdToExpandedRowMapValues[item.id];
        } else {
            const { id, hit } = item;

            itemIdToExpandedRowMapValues[id] = (
                <ReactJson src={hit} theme="railscasts" name={false} />
            );
        }

        setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
    };

    return {
        earliest,
        latest,
        toggleDetails,
        onTableChange,
        isLoading,
        items,
        error,
        pagination: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalItemCount: totalItemCount,
            pageSizeOptions: [10, 15, 20],
        },
        sorting: {
            sort: {
                field: sortField,
                direction: sortDirection,
            },
        },
        onTimeChange,
        onSearch,
        itemIdToExpandedRowMap,
    };
};

const CATEGORIES = {
    emptyStatus: 'Пустой status',
    doubleLog: 'Двойной лог',
};

const searchFilters = [
    {
        type: 'field_value_selection',
        field: 'log_type',
        name: 'Категория',
        operator: 'eq',
        multiSelect: 'or',
        options: [
            {
                value: 'emptyStatus',
                name: 'Пустой status',
            },
            {
                value: 'doubleLog',
                name: 'Двойной лог',
            },
        ].map(({ value, name }) => ({
            value: value,
            view: <span className="eui-textTruncate eui-displayBlock">{name}</span>,
        })),
        loadingMessage: 'Загрузка...',
        cache: 10000,
    },
];

const AnomalyLogsList = () => {
    const {
        error,
        onSearch,
        onTimeChange,
        items,
        isLoading,
        onTableChange,
        toggleDetails,
        pagination,
        sorting,
        itemIdToExpandedRowMap,
    } = useData();

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Логи с аномалиями',
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader iconType="sqlApp" pageTitle="Логи с аномалиями" />

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
                                    <SearchBar onSearch={onSearch} extraFilters={searchFilters} />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <Datepicker
                                        isLoading={isLoading}
                                        onChange={onTimeChange}
                                        defaultStart="now-1h"
                                    />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            {error && (
                                <EuiCallOut
                                    iconType="faceSad"
                                    color="danger"
                                    title={`Ошибка при поиске: ${error?.message}`}
                                />
                            )}
                            {isLoading ? (
                                <EuiLoadingContent lines={1} />
                            ) : (
                                <EuiText grow={false}>
                                    Всего: <b>{pagination.totalItemCount}</b>
                                </EuiText>
                            )}
                            <Table
                                onTableChange={onTableChange}
                                isLoading={isLoading}
                                sorting={sorting}
                                items={items}
                                itemIdToExpandedRowMap={itemIdToExpandedRowMap}
                                pagination={pagination}
                                toggleDetails={toggleDetails}
                            />
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

const Table = ({
    onTableChange,
    sorting,
    items,
    itemIdToExpandedRowMap,
    pagination,
    toggleDetails,
    isLoading,
}) => {
    const columns = [
        {
            field: '@timestamp',
            name: 'timestamp',
            sortable: true,
            mobileOptions: {
                header: false,
                truncateText: false,
                enlarge: true,
                fullWidth: true,
            },
        },
        {
            field: 'id',
            name: 'ID',
            truncateText: true,
        },
        {
            field: 'category',
            name: 'Категория',
            truncateText: true,
            render: (category) => <span>{CATEGORIES[category]}</span>,
        },
        {
            align: RIGHT_ALIGNMENT,
            width: '40px',
            isExpander: true,
            render: (item) => (
                <EuiButtonIcon
                    onClick={() => toggleDetails(item)}
                    iconType={itemIdToExpandedRowMap[item.id] ? 'arrowUp' : 'arrowDown'}
                />
            ),
        },
    ];
    return (
        <EuiBasicTable
            items={items}
            itemId="id"
            itemIdToExpandedRowMap={itemIdToExpandedRowMap}
            isExpandable={true}
            hasActions={true}
            columns={columns}
            loading={isLoading}
            pagination={pagination}
            sorting={sorting}
            onChange={onTableChange}
        />
    );
};

export default AnomalyLogsList;
