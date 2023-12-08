import { createSignal, createEffect, For, onMount, Show } from 'solid-js';
import { sendMessageQuery, IncomingInput } from '@/queries/sendMessageQuery';
import { v4 as uuidv4 } from 'uuid';
import { TextInput } from './inputs/textInput';
import { GuestBubble } from './bubbles/GuestBubble';
import { BotBubble } from './bubbles/BotBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';
import { SourceBubble } from './bubbles/SourceBubble';
import {
  BotMessageTheme,
  TextInputTheme,
  UserMessageTheme,
} from '@/features/bubble/types';
import { Badge } from './Badge';
import { Popup } from '@/features/popup';
import { DeleteButton } from '@/components/SendButton';
import { Avatar } from './avatars/Avatar';

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

const defaultWelcomeMessage = 'Hi there! How can I help?';

export const Bot = (props: BotProps & { class?: string }) => {
  let chatContainer: HTMLDivElement | undefined;
  let bottomSpacer: HTMLDivElement | undefined;
  let botContainer: HTMLDivElement | undefined;

  const [userInput, setUserInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [sourcePopupOpen, setSourcePopupOpen] = createSignal(false);
  const [sourcePopupSrc, setSourcePopupSrc] = createSignal({});
  const [messages, setMessages] = createSignal<MessageType[]>(
    [
      {
        content: props.welcomeMessage ?? defaultWelcomeMessage,
        role: 'apiMessage',
      },
    ],
    { equals: false }
  );

  const [chatId, setChatId] = createSignal(uuidv4());

  onMount(() => {
    if (!bottomSpacer) return;
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  };

  /**
   * Add each chat message into localStorage
   */
  const addChatMessage = (allMessage: MessageType[]) => {
    localStorage.setItem(
      `${props.chatflowid}_EXTERNAL`,
      JSON.stringify({ chatId: chatId(), chatHistory: allMessage })
    );
  };

  // Handle errors
  const handleError = (
    content = 'Oops! There seems to be an error. Please try again.'
  ) => {
    setMessages((prevMessages) => {
      const messages: MessageType[] = [
        ...prevMessages,
        { content, role: 'apiMessage' },
      ];
      addChatMessage(messages);
      return messages;
    });
    setLoading(false);
    setUserInput('');
    scrollToBottom();
  };

  // Handle form submission
  const handleSubmit = async (value: string) => {
    setUserInput(value);

    if (value.trim() === '') {
      return;
    }

    setLoading(true);
    scrollToBottom();

    // Send user question and history to API
    const welcomeMessage = props.welcomeMessage ?? defaultWelcomeMessage;
    const messageList = messages().filter(
      (msg) => msg.content !== welcomeMessage
    );

    setMessages((prevMessages) => {
      const messages: MessageType[] = [
        ...prevMessages,
        { content: value, role: 'userMessage' },
      ];
      addChatMessage(messages);
      return messages;
    });

    const body: IncomingInput = {
      question: value,
      history: messageList,
    };

    if (props.chatflowConfig) body.overrideConfig = props.chatflowConfig;

    const { data, error } = await sendMessageQuery({
      chatflowid: props.chatflowid,
      apiKey: props.apiKey,
      body,
    });

    const dataObj: any = data.data;

    if (dataObj) {
      let text = '';
      if (dataObj.text) text = dataObj.text;
      else if (dataObj.json) text = JSON.stringify(dataObj.json, null, 2);
      else text = JSON.stringify(dataObj, null, 2);

      setMessages((prevMessages) => {
        const messages: MessageType[] = [
          ...prevMessages,
          {
            content: text,
            sourceDocuments: dataObj?.sourceDocuments,
            role: 'apiMessage',
          },
        ];
        addChatMessage(messages);
        return messages;
      });
      setLoading(false);
      setUserInput('');
      scrollToBottom();
    }
    if (error) {
      console.error(error);
      const err: any = error;
      const errorData =
        typeof err === 'string'
          ? err
          : err.response.data ||
            `${err.response.status}: ${err.response.statusText}`;
      handleError(errorData);
      return;
    }
  };

  const clearChat = () => {
    try {
      localStorage.removeItem(`${props.chatflowid}_EXTERNAL`);
      setChatId(uuidv4());
      setMessages([
        {
          content: props.welcomeMessage ?? defaultWelcomeMessage,
          role: 'apiMessage',
        },
      ]);
    } catch (error: any) {
      const errorData =
        error.response.data ||
        `${error.response.status}: ${error.response.statusText}`;
      console.error(`error: ${errorData}`);
    }
  };

  // Auto scroll chat to bottom
  createEffect(() => {
    if (messages()) scrollToBottom();
  });

  createEffect(() => {
    if (props.fontSize && botContainer)
      botContainer.style.fontSize = `${props.fontSize}px`;
  });

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    const chatMessage = localStorage.getItem(`${props.chatflowid}_EXTERNAL`);
    if (chatMessage) {
      const objChatMessage = JSON.parse(chatMessage);
      setChatId(objChatMessage.chatId);
      const loadedMessages = objChatMessage.chatHistory.map(
        (message: MessageType) => {
          const chatHistory: MessageType = {
            content: message.content,
            role: message.role,
          };
          if (message.sourceDocuments)
            chatHistory.sourceDocuments = message.sourceDocuments;
          return chatHistory;
        }
      );
      setMessages([...loadedMessages]);
    }

    // eslint-disable-next-line solid/reactivity
    return () => {
      setUserInput('');
      setLoading(false);
      setMessages([
        {
          content: props.welcomeMessage ?? defaultWelcomeMessage,
          role: 'apiMessage',
        },
      ]);
    };
  });

  const isValidURL = (url: string): URL | undefined => {
    try {
      return new URL(url);
    } catch (err) {
      return undefined;
    }
  };

  const removeDuplicateURL = (message: MessageType) => {
    const visitedURLs: string[] = [];
    const newSourceDocuments: any = [];

    message.sourceDocuments.forEach((source: any) => {
      if (
        isValidURL(source.metadata.source) &&
        !visitedURLs.includes(source.metadata.source)
      ) {
        visitedURLs.push(source.metadata.source);
        newSourceDocuments.push(source);
      } else if (!isValidURL(source.metadata.source)) {
        newSourceDocuments.push(source);
      }
    });
    return newSourceDocuments;
  };

  return (
    <>
      <div
        ref={botContainer}
        class={
          'relative flex w-full h-full text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container ' +
          props.class
        }
      >
        <div class="flex w-full h-full justify-center">
          <div
            style={{ 'padding-bottom': '100px' }}
            ref={chatContainer}
            class="overflow-y-scroll min-w-full w-full min-h-full px-3 pt-10 relative scrollable-container chatbot-chat-view scroll-smooth"
          >
            <For each={[...messages()]}>
              {(message, index) => (
                <>
                  {message.role === 'userMessage' && (
                    <GuestBubble
                      message={message.content}
                      backgroundColor={props.userMessage?.backgroundColor}
                      textColor={props.userMessage?.textColor}
                      showAvatar={props.userMessage?.showAvatar}
                      avatarSrc={props.userMessage?.avatarSrc}
                    />
                  )}
                  {message.role === 'apiMessage' && (
                    <BotBubble
                      message={message.content}
                      backgroundColor={props.botMessage?.backgroundColor}
                      textColor={props.botMessage?.textColor}
                      showAvatar={props.botMessage?.showAvatar}
                      avatarSrc={props.botMessage?.avatarSrc}
                    />
                  )}
                  {message.role === 'userMessage' &&
                    loading() &&
                    index() === messages().length - 1 && <LoadingBubble />}
                  {message.sourceDocuments &&
                    message.sourceDocuments.length && (
                      <div
                        style={{
                          display: 'flex',
                          'flex-direction': 'row',
                          width: '100%',
                        }}
                      >
                        <For each={[...removeDuplicateURL(message)]}>
                          {(src) => {
                            const URL = isValidURL(src.metadata.source);
                            return (
                              <SourceBubble
                                pageContent={
                                  URL ? URL.pathname : src.pageContent
                                }
                                metadata={src.metadata}
                                onSourceClick={() => {
                                  if (URL) {
                                    window.open(src.metadata.source, '_blank');
                                  } else {
                                    setSourcePopupSrc(src);
                                    setSourcePopupOpen(true);
                                  }
                                }}
                              />
                            );
                          }}
                        </For>
                      </div>
                    )}
                </>
              )}
            </For>
          </div>
          <div
            style={{
              display: 'flex',
              'flex-direction': 'row',
              'align-items': 'center',
              height: '50px',
              position: props.isFullPage ? 'fixed' : 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              background: props.bubbleBackgroundColor,
              color: props.bubbleTextColor,
              'border-top-left-radius': props.isFullPage ? '0px' : '6px',
              'border-top-right-radius': props.isFullPage ? '0px' : '6px',
            }}
          >
            <Show when={props.titleAvatarSrc}>
              <>
                <div style={{ width: '15px' }} />
                <Avatar initialAvatarSrc={props.titleAvatarSrc} />
              </>
            </Show>
            <Show when={props.title}>
              <span class="px-3 whitespace-pre-wrap font-semibold max-w-full">
                {props.title}
              </span>
            </Show>
            <div style={{ flex: 1 }} />
            <DeleteButton
              sendButtonColor={props.bubbleTextColor}
              type="button"
              isDisabled={messages().length === 1}
              class="my-2 ml-2"
              on:click={clearChat}
            >
              <span style={{ 'font-family': 'Poppins, sans-serif' }}>
                Clear
              </span>
            </DeleteButton>
          </div>
          <TextInput
            backgroundColor={props.textInput?.backgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            fontSize={props.fontSize}
            defaultValue={userInput()}
            onSubmit={handleSubmit}
          />
        </div>
        <Badge
          badgeBackgroundColor={props.badgeBackgroundColor}
          poweredByTextColor={props.poweredByTextColor}
          botContainer={botContainer}
        />
        <BottomSpacer ref={bottomSpacer} />
      </div>
      {sourcePopupOpen() && (
        <Popup
          isOpen={sourcePopupOpen()}
          value={sourcePopupSrc()}
          onClose={() => setSourcePopupOpen(false)}
        />
      )}
    </>
  );
};

type BottomSpacerProps = {
  ref: HTMLDivElement | undefined;
};
const BottomSpacer = (props: BottomSpacerProps) => {
  return <div ref={props.ref} class="w-full h-32" />;
};
