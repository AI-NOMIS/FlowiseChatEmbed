import { MessageType } from '@/components/Bot';
export type IncomingInput = {
    question: string;
    history: MessageType[];
    overrideConfig?: Record<string, unknown>;
    socketIOClientId?: string;
};
export type MessageRequest = {
    chatflowid: string;
    apiKey: string;
    body?: IncomingInput;
};
export declare const sendMessageQuery: ({ chatflowid, apiKey, body, }: MessageRequest) => Promise<{
    data?: any;
    error?: Error | undefined;
}>;
export declare const addChatMessagesMutation: ({ apiKey, chatflowid, body, }: {
    apiKey: string;
    chatflowid: string;
    body: MessageType;
}) => Promise<{
    data?: any;
    error?: Error | undefined;
}>;
export declare const getMessageQuery: ({ chatflowid, apiKey }: MessageRequest) => Promise<{
    data?: any;
    error?: Error | undefined;
}>;
//# sourceMappingURL=sendMessageQuery.d.ts.map