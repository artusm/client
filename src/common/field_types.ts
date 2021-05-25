export const FIELD_TYPES = {
    DATE: 'date',
    KEYWORD: 'keyword',
    NUMBER: 'number',
    TEXT: 'text',
    UNKNOWN: 'unknown',
} as const;

/**
 * For use as summary_count_field_name in datafeeds which use aggregations.
 */
export const DOC_COUNT = 'doc_count';

/**
 * Elasticsearch field showing number of documents aggregated in a single summary field for
 * pre-aggregated data. For use as summary_count_field_name in datafeeds which do not use aggregations.
 */
export const _DOC_COUNT = '_doc_count';

// List of system fields we don't want to display.
export const OMIT_FIELDS: string[] = ['_source', '_type', '_index', '_id', '_version', '_score'];
