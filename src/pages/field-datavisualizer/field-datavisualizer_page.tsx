import React, {FC, useEffect, useState} from "react";
import Header from "../../components/root/Header";
import {
    EuiPage,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSearchBar,
    EuiCallOut,
    EuiSpacer,
    EuiText,
    EuiLoadingContent,
    EuiProgress
} from "@elastic/eui";
import {FieldStatItem} from "./componenets/field-stat-item/field-stat-item";
import {FIELD_TYPES} from "../../common/field_types";
import {getFieldStats, HistogramField} from "../../utils/agg-intervals";
import {QueryContainer} from "@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl";
import SearchBar from "../../components/search-bar";
import {Datepicker} from "../../components/datepicker";
import {ShardSizeFilter} from "./componenets/search_panel/shard_size_select";

const FieldDataVisualizerPage = () => {
    const {isLoading, data, onSearch, error, onTimeChange, setSamplerShardSize, samplerShardSize, query} = useData();

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Аналитика полей",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="visBarHorizontalStacked"
                        pageTitle="Аналитика полей"
                        description="Ф"
                        rightSideItems={[<Datepicker isLoading={isLoading} onChange={onTimeChange} />]}
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <EuiFlexGroup gutterSize="m" alignItems="center" data-test-subj="mlDataVisualizerSearchPanel">
                                <EuiFlexItem>
                                    <SearchBar onSearch={onSearch} />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <ShardSizeFilter samplerShardSize={samplerShardSize} setSamplerShardSize={setSamplerShardSize} />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiText grow={false}>Всего: <b>{isLoading ? <EuiLoadingContent lines={1} /> : (data.totalCount)}</b></EuiText>
                                </EuiFlexItem>

                            </EuiFlexGroup>
                            {error && (
                                <EuiCallOut
                                    iconType="faceSad"
                                    color="danger"
                                    title={`Ошибка при поиске: ${error?.message}`}
                                />
                            )}
                            {isLoading && <EuiProgress size="xs" color="accent" />}
                            {JSON.stringify(query)}
                            <EuiSpacer size={'l'} />
                            <EuiFlexGroup alignItems="center" gutterSize="s" direction="row" wrap={true}>
                                <List isLoading={isLoading} data={data} />
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};




const fields: HistogramField[] = [
    {
        fieldName: '@timestamp',
        type: FIELD_TYPES.DATE,
    },
    {
        fieldName: 'message',
        type: FIELD_TYPES.TEXT,
    },
    {
        fieldName: 'offset',
        type: FIELD_TYPES.NUMBER,
    },
    {
        fieldName: 'level',
        type: FIELD_TYPES.KEYWORD,
    },
    {
        fieldName: 'esl_database_status.idx',
        type: FIELD_TYPES.KEYWORD
    },
    {
        fieldName: 'read_at',
        type: FIELD_TYPES.DATE,
    },
    {
        fieldName: 'esl',
        type: FIELD_TYPES.NUMBER,
    },
    {
        fieldName: 'machine.hostname',
        type: FIELD_TYPES.KEYWORD,
    },
    {
        fieldName: 'log_type',
        type: FIELD_TYPES.KEYWORD,
    },
    {
        fieldName: 'source',
        type: FIELD_TYPES.KEYWORD,
    },
    {
        fieldName: 'type',
        type: FIELD_TYPES.KEYWORD,
    }
];


const initialState = {
    totalCount: 0,
    fields: [],
}

const useData = () => {
    const [samplerShardSize, setSamplerShardSize] = useState(-1);
    const [error, setError] = useState<any>(null);
    const [query, setQuery] = useState<QueryContainer>({});
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(initialState);

    const onSearch = (query, error) => {
        if (query) {
            setQuery(EuiSearchBar.Query.toESQuery(query));
        }
        setError(error);
    };

    const onTimeChange = (start, end) => {
        setStartTime(start);
        setEndTime(end);
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await getFieldStats(fields, query, startTime!, endTime!, samplerShardSize);
                setData(data);
            } catch (e) {
                setError(e);
            }
            setIsLoading(false);
        }
        if (!error && query && startTime && endTime) {
            load();
        }
    }, [query, startTime, endTime, error, samplerShardSize]);

    return {
        isLoading,
        data,
        error,
        onSearch,
        onTimeChange,
        setSamplerShardSize,
        samplerShardSize,
        query
    }
}

interface ListProps {
    isLoading: boolean;
    data?: any;
}

const List: FC<ListProps> = ({ isLoading = false, data }) => {
    if (isLoading) return (<div>Загурзка</div>);

    const {totalCount, fields} = data;

    return (
        <>
            {fields.map((f, i) => (
                <FieldStatItem key={f.fieldName} type={f.fieldType} fieldName={f.fieldName} data={f} totalCount={totalCount} />
            ))}
        </>
    )
};

export default FieldDataVisualizerPage;
