import React, { FC } from 'react';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiSuperSelect,
} from '@elastic/eui';

interface Props {
    samplerShardSize: number;
    setSamplerShardSize(s: number): void;
}

const searchSizeOptions = [1000, 5000, 10000, 100000, -1].map((v) => {
    return {
        value: String(v),
        inputDisplay:
            v > 0 ? (
                <span>Размер выборки (на сегмент): {v}</span>
            ) : (
                <span>Искать везде</span>
            ),
    };
});

export const ShardSizeFilter: FC<Props> = ({
                                               samplerShardSize,
                                               setSamplerShardSize,
                                           }) => {
    return (
        <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
            <EuiFlexItem grow={false} style={{ width: 270 }}>
                <EuiSuperSelect
                    options={searchSizeOptions}
                    valueOfSelected={String(samplerShardSize)}
                    onChange={(value) => setSamplerShardSize(+value)}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
