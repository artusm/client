import React, { FC, useEffect, useState } from 'react';
import { EuiSelectable, EuiBadge } from '@elastic/eui';
import { loadEslList } from '../../../query/load-esl-list';

interface Props {
    onChangeEsl: (esl: number) => void;
    isGlobalLoading: boolean;
}

export const EslList: FC<Props> = ({
    onChangeEsl = () => {},
    isGlobalLoading = false,
}) => {
    const [isLoading, setIsloading] = useState(true);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const load = async () => {
            const esls = await loadEslList({
                "query": {
                    "exists": {
                        "field": "esl_database_status.temp"
                    }
                }
            });

            const options = esls.map((b) => ({
                label: `${b.esl}`,
                esl: b.esl,
                append: <EuiBadge>{b.docCount}</EuiBadge>,
            }));

            // @ts-ignore
            setOptions(options);
            setIsloading(false);
        };

        load();
    }, []);

    const onChange = (options) => {
        const esl = options.find((o) => o.checked === 'on');

        if (onChangeEsl) {
            onChangeEsl(esl.esl);
        }
    };

    return (
        <EuiSelectable
            searchable
            isLoading={isLoading || isGlobalLoading}
            options={options}
            height="full"
            loadingMessage={
                isGlobalLoading ? 'Загружаются данные' : 'Идет загрузка esl'
            }
            singleSelection={true}
            onChange={onChange}
        >
            {(list, search) => (
                <>
                    {search}
                    {list}
                </>
            )}
        </EuiSelectable>
    );
};
