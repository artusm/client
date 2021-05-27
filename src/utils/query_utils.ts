export function buildSamplerAggregation(
    aggs: any,
    samplerShardSize: number
): any {
    if (samplerShardSize < 1) {
        return aggs;
    }

    return {
        sample: {
            sampler: {
                shard_size: samplerShardSize,
            },
            aggs,
        },
    };
}


export function getSamplerAggregationsResponsePath(samplerShardSize: number): string[] {
    return samplerShardSize > 0 ? ['sample'] : [];
}
