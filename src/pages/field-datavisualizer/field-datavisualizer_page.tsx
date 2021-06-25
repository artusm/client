import React, {FC, useEffect, useMemo, useState} from 'react';
import Header from '../../components/root/Header';
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
    EuiProgress, EuiFormRow,
    EuiSwitch,
} from '@elastic/eui';
import { FieldStatItem } from './componenets/field-stat-item/field-stat-item';
import { FIELD_TYPES } from '../../common/field_types';
import { getFieldStats, HistogramField } from '../../utils/agg-intervals';
import { QueryContainer } from '@elastic/eui/src/components/search_bar/query/ast_to_es_query_dsl';
import SearchBar from '../../components/search-bar';
import { Datepicker } from '../../components/datepicker';
import { ShardSizeFilter } from './componenets/search_panel/shard_size_select';

const isEmpty = (data: any) => {
    return !(data.count > 0 || data.earliest || (data.topValues && data.topValues.length));
}

const FieldDataVisualizerPage = () => {
    const {
        isLoading,
        data,
        onSearch,
        error,
        onTimeChange,
        setSamplerShardSize,
        samplerShardSize,
    } = useData();
    const [isSwitchChecked, setIsSwitchChecked] = useState(false);
    const onSwitchChange = () => {
        setIsSwitchChecked(!isSwitchChecked);
    };

    const dataToDisplay = useMemo(() => {
        let nonEmptyFields = data.fields.filter((f) => !isEmpty(f))

        return {
            fields: isSwitchChecked ? data.fields : nonEmptyFields,
            nonEmptyFields: nonEmptyFields.length,
            totalFieldsCount: data.fields.length,
            totalCount: data.totalCount
        }
    }, [isSwitchChecked, data])

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Аналитика полей',
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="visBarHorizontalStacked"
                        pageTitle="Аналитика полей"
                        description="Ф"
                        rightSideItems={[
                            <Datepicker isLoading={isLoading} onChange={onTimeChange} />,
                        ]}
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <EuiFlexGroup gutterSize="m" alignItems="center">
                                <EuiFlexItem>
                                    <SearchBar onSearch={onSearch} />
                                </EuiFlexItem>

                                <EuiFlexItem grow={false}>
                                    <ShardSizeFilter
                                        samplerShardSize={samplerShardSize}
                                        setSamplerShardSize={setSamplerShardSize}
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                    <EuiText grow={false}>
                                        Всего:{' '}
                                        <b>
                                            {isLoading ? (
                                                <EuiLoadingContent lines={1} />
                                            ) : (
                                                data.totalCount
                                            )}
                                        </b>
                                    </EuiText>
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
                            <EuiSpacer size="l" />
                            <EuiSwitch
                                name="switch"
                                label="Пустые поля"
                                checked={isSwitchChecked}
                                onChange={onSwitchChange}
                            />
                            {dataToDisplay?.nonEmptyFields || 0} / {dataToDisplay?.totalFieldsCount || 0}
                            <EuiSpacer size="l" />
                            <EuiFlexGroup
                                alignItems="center"
                                gutterSize="s"
                                direction="row"
                                wrap={true}
                            >
                                <List isLoading={isLoading} data={dataToDisplay} />
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

const buildField = (
    fieldName: string,
    type: typeof FIELD_TYPES[keyof typeof FIELD_TYPES]
): HistogramField => ({
    fieldName,
    type,
});

const fields: HistogramField[] = [
    buildField('@timestamp', FIELD_TYPES.DATE),
    buildField('message', FIELD_TYPES.TEXT),
    buildField('offset', FIELD_TYPES.NUMBER),
    buildField('level', FIELD_TYPES.KEYWORD),
    buildField('read_at', FIELD_TYPES.DATE),
    buildField('esl', FIELD_TYPES.NUMBER),
    buildField('machine.hostname', FIELD_TYPES.KEYWORD),
    buildField('log_type', FIELD_TYPES.KEYWORD),
    buildField('source', FIELD_TYPES.KEYWORD),
    buildField('type', FIELD_TYPES.KEYWORD),
    // buildField('esl_status.PROTONV', FIELD_TYPES.NUMBER),
    // buildField('esl_status.BOOTMODE', FIELD_TYPES.NUMBER),
    // buildField('esl_status.BOOTVER', FIELD_TYPES.NUMBER),
    // buildField('esl_status.APPVER', FIELD_TYPES.NUMBER),
    // buildField('esl_status.HWTYPE', FIELD_TYPES.NUMBER),
    // buildField('esl_status.DispType', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ImageType', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Crc32Img', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Crc32Fw', FIELD_TYPES.NUMBER),
    // buildField('esl_status.DispCol', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ScDimX', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ScDimY', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Uptime', FIELD_TYPES.NUMBER),
    // buildField('esl_status.TotalTime', FIELD_TYPES.NUMBER),
    // buildField('esl_status.DrawSum', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Vmin', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Vlast', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Temp', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Rssi', FIELD_TYPES.NUMBER),
    // buildField('esl_status.Errcode', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ErrTime', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ErrFileID', FIELD_TYPES.NUMBER),
    // buildField('esl_status.ErrLine', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.id', FIELD_TYPES.KEYWORD),
    buildField('esl_database_status.idx', FIELD_TYPES.KEYWORD),
    buildField('esl_database_status.driver', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.online', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.type', FIELD_TYPES.KEYWORD),
    buildField('esl_database_status.size', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.display_type', FIELD_TYPES.KEYWORD),
    buildField('esl_database_status.height', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.width', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.proton_version', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.hw_version', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.sw_version', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.boot_version', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.boot_mode', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.esl_disp_type', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.esl_image_type', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.esl_disp_col', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.esl_width', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.esl_height', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.draw_count', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.batt_last', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.batt_min', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.temp', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.rssi', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.uptime', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.total_time', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.timestamp', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.err_timestamp', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.errcode', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.err_file', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.err_line', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.pic_crc', FIELD_TYPES.NUMBER),
    buildField('esl_database_status.fw_crc', FIELD_TYPES.NUMBER),
    buildField('event.type', FIELD_TYPES.KEYWORD),
    buildField('event.timestamp', FIELD_TYPES.NUMBER),
    buildField('event.esl', FIELD_TYPES.NUMBER),
    buildField('event.id', FIELD_TYPES.NUMBER),
    buildField('event.error', FIELD_TYPES.NUMBER),
    buildField('event.dongle', FIELD_TYPES.NUMBER),
    buildField('event.slot', FIELD_TYPES.NUMBER),
];

const initialState = {
    totalCount: 0,
    fields: [],
};

const useData = () => {
    const [samplerShardSize, setSamplerShardSize] = useState(5000);
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
                const data = await getFieldStats(
                    fields,
                    query,
                    startTime!,
                    endTime!,
                    samplerShardSize
                );
                setData(data);
            } catch (e) {
                setError(e);
            }
            setIsLoading(false);
        };
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
        query,
    };
};

interface ListProps {
    isLoading: boolean;
    data?: any;
}

const List: FC<ListProps> = ({ isLoading = false, data }) => {

    if (isLoading) return <div>Загурзка</div>;

    const { totalCount, fields } = data;

    return (
        <>

            {fields.map((f) => (
                <FieldStatItem
                    key={f.fieldName}
                    type={f.fieldType}
                    fieldName={f.fieldName}
                    data={f}
                    totalCount={totalCount}
                />
            ))}
        </>
    );
};

export default FieldDataVisualizerPage;
