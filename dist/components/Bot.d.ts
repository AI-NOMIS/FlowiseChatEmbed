import { BotMessageTheme, TextInputTheme, UserMessageTheme } from '@/features/bubble/types';
export type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting';
export type MessageType = {
    content: string;
    role: messageType;
    sourceDocuments?: any;
};
export type BotProps = {
    chatflowid: string;
    apiKey: string;
    chatflowConfig?: Record<string, unknown>;
    welcomeMessage?: string;
    botMessage?: BotMessageTheme;
    userMessage?: UserMessageTheme;
    textInput?: TextInputTheme;
    poweredByTextColor?: string;
    badgeBackgroundColor?: string;
    bubbleBackgroundColor?: string;
    bubbleTextColor?: string;
    title?: string;
    titleAvatarSrc?: string;
    fontSize?: number;
    isFullPage?: boolean;
};
export declare const Bot: (props: BotProps & {
    class?: string;
}) => import("solid-js").JSX.Element;
//# sourceMappingURL=Bot.d.ts.map