export declare const isNotDefined: <T>(value: T | null | undefined) => value is null | undefined;
export declare const isDefined: <T>(value: T | null | undefined) => value is NonNullable<T>;
export declare const isEmpty: (value: string | undefined | null) => value is undefined;
export declare const isNotEmpty: (value: string | undefined | null) => value is string;
export declare const sendRequest: <ResponseData>(params: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: Record<string, unknown> | FormData;
}) => Promise<{
    data?: ResponseData | undefined;
    error?: Error | undefined;
}>;
export declare const BASE_URL = "https://api.nocodingai.com/langchain";
//# sourceMappingURL=index.d.ts.map