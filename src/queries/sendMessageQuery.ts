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
