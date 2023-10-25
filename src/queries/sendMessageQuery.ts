import { MessageType } from '@/components/Bot';
import { BASE_URL, sendRequest } from '@/utils/index';

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

export const sendMessageQuery = ({
  chatflowid,
  apiKey,
  body,
}: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${BASE_URL}/external-prediction/${chatflowid}`,
    headers: {
      'x-api-key': apiKey,
    },
    body,
  });

export const addChatMessagesMutation = ({
  apiKey,
  chatflowid,
  body,
}: {
  apiKey: string;
  chatflowid: string;
  body: MessageType;
}) =>
  sendRequest<any>({
    method: 'POST',
    url: `${BASE_URL}/chatmessage-external/${chatflowid}`,
    headers: {
      'x-api-key': apiKey,
    },
    body: {
      ...body,
      sourceDocuments: body.sourceDocuments
        ? JSON.stringify(body.sourceDocuments)
        : undefined,
    },
  });

export const getMessageQuery = ({ chatflowid, apiKey }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${BASE_URL}/chatmessage-external/${chatflowid}`,
    headers: {
      'x-api-key': apiKey,
    },
  });

// export const isStreamAvailableQuery = ({
//   chatflowid,
//   apiKey,
// }: MessageRequest) =>
//   sendRequest<any>({
//     method: 'GET',
//     headers: {
//       'x-api-key': apiKey,
//     },
//     url: `${BASE_URL}/chatflows-streaming/${chatflowid}`,
//   });
