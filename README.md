<!-- markdownlint-disable MD030 -->

# Langchain Chatbot Embed

Javascript library to display Langchain chatbot on your website

![Flowise](https://github.com/FlowiseAI/FlowiseChatEmbed/blob/main/images/ChatEmbed.gif?raw=true)

Install:

```bash
yarn install
```

Dev:

```bash
yarn dev
```

Build:

```bash
yarn build
```

## Embed in your HTML

### PopUp

```html
<script type="module">
  import Chatbot from 'https://cdn.jsdelivr.net/gh/AI-NOMIS/FlowiseChatEmbed@oui/dist/web.js';
  Chatbot.init({
    chatflowid: '<chatflowid>',
    apiKey: '<YOUR-API-KEY>',
  });
</script>
```

### FullPage

```html
<script type="module">
  import Chatbot from './web.js';
  Chatbot.initFull({
    chatflowid: '<chatflowid>',
    apiKey: '<YOUR-API-KEY>',
  });
</script>
<flowise-fullchatbot></flowise-fullchatbot>
```

To enable full screen, add `margin: 0` to <code>body</code> style, and confirm you don't set height and width

```html
<body style="margin: 0">
  <script type="module">
    import Chatbot from './web.js';
    Chatbot.initFull({
      chatflowid: '<chatflowid>',
      apiKey: '<YOUR-API-KEY>',
      theme: {
        chatWindow: {
          // height: 700, don't set height
          // width: 400, don't set width
        },
      },
    });
  </script>
</body>
```

## Configuration

You can also customize chatbot with different configuration

```html
<script type="module">
  import Chatbot from 'https://cdn.jsdelivr.net/gh/AI-NOMIS/FlowiseChatEmbed@oui/dist/web.js';
  Chatbot.init({
    chatflowid: '<chatflowid>',
    apiKey: '<YOUR-API-KEY>',
    chatflowConfig: {
      // topK: 2
    },
    theme: {
      button: {
        backgroundColor: '#3B81F6',
        right: 20,
        bottom: 20,
        size: 'medium',
        iconColor: 'white',
        customIconSrc:
          'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
      },
      chatWindow: {
        welcomeMessage: 'Hello! This is custom welcome message',
        backgroundColor: '#ffffff',
        height: 700,
        width: 400,
        fontSize: 16,
        poweredByTextColor: '#303235',
        botMessage: {
          backgroundColor: '#f7f8ff',
          textColor: '#303235',
          showAvatar: true,
          avatarSrc:
            'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png',
        },
        userMessage: {
          backgroundColor: '#3B81F6',
          textColor: '#ffffff',
          showAvatar: true,
          avatarSrc:
            'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
        },
        textInput: {
          placeholder: 'Type your question',
          backgroundColor: '#ffffff',
          textColor: '#303235',
          sendButtonColor: '#3B81F6',
        },
      },
    },
  });
</script>
```

## License

Source code in this repository is made available under the [MIT License](https://github.com/FlowiseAI/Flowise/blob/master/LICENSE.md).
