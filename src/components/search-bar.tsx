import React, {FC, useMemo} from "react";
import { EuiSearchBar } from "@elastic/eui";
import { loadEslList } from "../query/load-esl-list";
import {FIELD_TYPES} from "../common/field_types";

interface Props {
    onSearch?: (query: string, error: any) => void;
    extraFilters?: any[];
}

const initialQuery = EuiSearchBar.Query.MATCH_ALL;

const loadFilterEsl = () => {
    return new Promise(async (resolve) => {
        const esls = await loadEslList();
        resolve(
            esls.map((esl) => ({
                value: esl.esl,
                view: (
                    <span className="eui-textTruncate eui-displayBlock">{esl.esl}</span>
                ),
            }))
        );
    });
};

const DEFAULT_FILTERS = [
    {
        type: "field_value_selection",
        field: "esl",
        name: "ESL",
        multiSelect: false,
        operator: "eq",
        cache: 10000,
        options: () => loadFilterEsl(),
        loadingMessage: "Загрузка...",
        value: 0,
    },
    {
        type: "field_value_selection",
        field: "level",
        name: "LEVEL",
        operator: "eq",
        multiSelect: 'or',
        options: ['DEBUG', 'INFO', 'WARNING', 'ERROR'].map((level) => ({
            value: level,
            view: (
                <span className="eui-textTruncate eui-displayBlock">{level}</span>
            ),
        })),
        loadingMessage: "Загрузка...",
        cache: 10000,
    },
    {
        type: "field_value_selection",
        field: "log_type",
        name: "Тип лога",
        operator: "eq",
        multiSelect: 'or',
        options: ['ray', 'access', 'driver'].map((logType) => ({
            value: logType,
            view: (
                <span className="eui-textTruncate eui-displayBlock">{logType}</span>
            ),
        })),
        loadingMessage: "Загрузка...",
        cache: 10000,
    },
];

const schema = {
    strict: false,
    fields: {
        esl: {
            type: FIELD_TYPES.NUMBER,
        },
        "@timestamp": {
            type: FIELD_TYPES.DATE,
        },
        log_type: {
            type: "string",
        },
        level: {
            type: "string",
        },
        message: {
            type: "string",
        },
        read_at: {
            type: FIELD_TYPES.DATE,
        },
        source: {
            type: "string",
        },
        offset: {
            type: FIELD_TYPES.NUMBER,
        },
        "machine.hostname": {
            type: "string",
        },
        type: {
            type: FIELD_TYPES.NUMBER,
        },
        'esl_status.PROTONV': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.BOOTMODE': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.BOOTVER': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.APPVER': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.HWTYPE': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.DispType': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ImageType': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Crc32Img': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Crc32Fw': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.DispCol': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ScDimX': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ScDimY': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Uptime': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.TotalTime': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.DrawSum': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Vmin': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Vlast': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Temp': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Rssi': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.Errcode': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ErrTime': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ErrFileID': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_status.ErrLine': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.id': {
            type: "string"
        },
        'esl_database_status.idx': {
            type: "string"
        },
        'esl_database_status.driver': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.online': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.type': {
            type: "string"
        },
        'esl_database_status.size': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.display_type': {
            type: "string"
        },
        'esl_database_status.height': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.width': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.proton_version': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.hw_version': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.sw_version': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.boot_version': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.boot_mode': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.esl_disp_type': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.esl_image_type': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.esl_disp_col': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.esl_width': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.esl_height': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.draw_count': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.batt_last': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.batt_min': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.temp': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.rssi': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.uptime': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.total_time': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.timestamp': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.err_timestamp': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.errcode': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.err_file': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.err_line': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.pic_crc': {
            type: FIELD_TYPES.NUMBER
        },
        'esl_database_status.fw_crc': {
            type: FIELD_TYPES.NUMBER
        },
        'event.type': {
            type: "string"
        },
        'event.timestamp': {
            type: FIELD_TYPES.NUMBER
        },
        'event.els': {
            type: FIELD_TYPES.NUMBER
        },
        'event.id': {
            type: FIELD_TYPES.NUMBER
        },
        'event.error': {
            type: FIELD_TYPES.NUMBER
        },
        'event.dongle': {
            type: FIELD_TYPES.NUMBER
        },
        'event.slot': {
            type: FIELD_TYPES.NUMBER
        },
    },
};

const SearchBar: FC<Props> = ({ onSearch , extraFilters = []}) => {
    const filters = useMemo(() => {
        return DEFAULT_FILTERS.concat(extraFilters);
    }, [extraFilters])

    const onChange = ({ query, error }) => {
        if (onSearch) {
            onSearch(query, error);
        }
    };

    return (
        <EuiSearchBar
            defaultQuery={initialQuery}
            box={{
                placeholder: "Пример: esl:2000000312321 message:test",
                schema,
            }}
            // @ts-ignore
            filters={filters}
            onChange={onChange}
        />
    );
};

export default SearchBar;
