# chatManagerTelegramBot
There is an example of telegram bot helper to send templates by sms using node-telegram-bot-api  and some sms-api.

## Foreword
- First of all, thanks a lot for [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)'s great work.

Also thanks for an amaising video tutorial [YouTube: Пишем Telegram бота на NodeJS [RUS]](https://www.youtube.com/watch?v=RS1nmDMf69U&list=PL6AOr-PZtK-mM2QC1ixyfa5CtJZGK61aN)

#  **Installation**

##  Install with npm

$ npm install sms-helper-telegram-bot
***
#  **Description**

* [Creating new bot with BotFather](#Creating+new+bot+with+BotFather)
* [Start bot](#Start+bot)
* [Keyboard](#Keyboard)
* [Parsing phone number](#Parsing+phone+number)
* [Send request](#Send+request)
***
<a name="Creating+new+bot+with+BotFather"></a>
### Creating new bot with BotFather
First of all you should create your bot using @BotFather in Telegram.

- Use the <code>/newbot</code> command to create a new bot. The BotFather will ask you for a name and username, then generate an authorization token for your new bot.

- The name of your bot is displayed in contact details and elsewhere.

- The Username is a short name, to be used in mentions and telegram.me links. Usernames are 5-32 characters long and are case insensitive, but may only include Latin characters, numbers, and underscores. Your bot's username must end in <code>‘bot’</code>, e.g. <code>‘sohamsmarcopolo_bot’</code> or <code>‘sohamsmarcopoloBot’</code>.

- The token is a string along the lines of <code>110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw</code> that is required to authorize the bot and send requests to the Bot API.

<img src="https://github.com/vito2005/chatManagerTelegramBot/blob/master/img/sc-2-55935622ad2333ca6b762fcf19ee8d7f-bd193.jpg" height="700" width = "400">

Generating an authorization token
If your existing token is compromised or you lost it for some reason, use the <code>/token</code> command to generate a new one.

- To edit some information you can use these commands:

<code>/setname</code> – change your bot's name.

<code>/setdescription</code> — change the bot's description, a short text of up to 512 characters, describing your bot. Users will see this text at the beginning of the conversation with the bot, titled ‘What can this bot do?’.

<code>/setabouttext</code> — change the bot's about info, an even shorter text of up to 120 characters. Users will see this text on the bot's profile page. When they share your bot with someone, this text is sent together with the link.


<a name="Start+bot"></a>
### Start bot
***
- This app use <code>a 'config' module</code>.
To start bot you should use your token in <code>./config/default.json</code> file. Paste your token in "token:" line.
````js
defailt.json

 "token": "your token"
````
- The app uses API SMS. In this example it is http://sms.ru/sms/send. After registration you'll get <code>api_id</code>.
- Using <code>node-telegram-bot-api</code> module:
```js
const TelegramBot = require('node-telegram-bot-api');
```
   and creating a new bot :
   
```js
const bot = new TelegramBot (TOKEN, {
    polling: true,

    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: config.get('url'),
            socksPort: config.get('port'),
            socksUsername: config.get('user'),
            socksPassword: config.get('pw')
        }
    }
});
```
Here we listen <code>/start</code> comand:

````js
bot.onText(/\/start/,  (msg, [source, match])=> {
    const {chat: {id}} = msg;
                bot.sendMessage(id, `Введите настройки для sms провайдера. api-id:`, {
                    reply_markup: {
                        force_reply: true
                    }
                }).then(addApiId => {
                    bot.onReplyToMessage(addApiId.chat.id, addApiId.message_id, msg => {
                        settings.api_id = msg.text;
                        bot.sendMessage(addApiId.chat.id, 'Выберете шаблон',{
                            reply_markup:{
                                inline_keyboard
                            }
                        })
                    })
                })
});
```` 

Next you can start the bot using <code>/start</code> command. 

The bot'll request your <code>api_id</code>.
<img src="https://github.com/vito2005/chatManagerTelegramBot/blob/master/img/2018-08-09_16-37-12.jpg">

- Paste it and you can use the bot. The bot'll suggest choosing some template.

<img src="https://github.com/vito2005/chatManagerTelegramBot/blob/master/img/2018-08-09_16-40-09.jpg">

<a name="Keyboard"></a>
### Keyboard
***
As you saw the Bot suggested a keyboard after setting api_id.
To create it we used a <code>reply_markup</code> option in  <code>bot.sendMessage()</code>.
````js
let inline_keyboard = [
    [
         {
            text: 'Пустой шаблон №1',
            callback_data: COMMAND_TEMPLATE1
        },
        {
            text: 'Пустой шаблон №2',
            callback_data: COMMAND_TEMPLATE2
        }

    ]
    .........
    [
        {
            text: 'Добавить шаблон',
            callback_data: COMMAND_ADDTEMPLATE
        }
    ]
];

......
   bot.sendMessage(addApiId.chat.id, 'Выберете шаблон',{
                            reply_markup:{
                                inline_keyboard
                            }
                        })
````

To use the keyboard we use a <code>callback_query</code> event.
````js
bot.on('callback_query',  query=>{
    const {message: {chat, message_id, text}= {}} = query
    switch (query.data) {
        case COMMAND_TEMPLATE1:
            templates[0] ? sendTemplate(templates[0], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №1');
            break
        case COMMAND_TEMPLATE2:
            templates[1] ? sendTemplate(templates[1], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №2');
            break
        case COMMAND_TEMPLATE3:
            templates[2] ? sendTemplate(templates[2], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №3');
            break
        case COMMAND_TEMPLATE4:
            templates[3] ? sendTemplate(templates[3], chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №4');
            break
        case COMMAND_TEMPLATE5:
            templates[4] ? sendTemplate(templates[4],chat.id) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №5');
            break

        case COMMAND_ADDTEMPLATE:

            bot.sendMessage(chat.id, `Введите текст шаблона №${count+1}`, {
                reply_markup: {
                    force_reply: true
                }
            }).then(addTemplate => {
                const replyListenerId = bot.onReplyToMessage(addTemplate.chat.id, addTemplate.message_id, msg => {
                    bot.removeReplyListener(replyListenerId);
                        templates[count] = msg.text;
                    (count == 0) ? inline_keyboard[count][count].text = msg.text:
                        (count == 1) ? inline_keyboard[0][count].text = msg.text:
                            (count == 2) ? inline_keyboard[1][0].text = msg.text:
                                (count == 3) ? inline_keyboard[1][1].text = msg.text:
                                    (count == 4) ? inline_keyboard[1][2].text = msg.text: console.log(inline_keyboard)
                        count++
                    if (count>4) count = 0;
                    bot.editMessageText('Выберете шаблон',{
                        chat_id: chat.id,
                        message_id:message_id,
                        reply_markup: {
                            inline_keyboard
                        }
                    })
                })
            })
            break
        default:
    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})
````

<a name="Parsing+phone+number"></a>
### Parsing phone number
***
Also you can just call a keyboard  writing a phone number.
There are a simple regexp filter for phone numbers:
````js
let regexp = /((\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?)/gim;
````
and listen event with some correction to suggest the keyboard.
````js
bot.onText(regexp, (msg, [source, match]) =>{
    if (!phonenumber){
        const {chat: {id}} = msg;
        phonenumber = match;
        phonenumber = phonenumber.replace(/[\D]/g,'');
        phonenumber = (phonenumber.length == 10)? '+7' + phonenumber: '+7' + phonenumber.slice(1)

        bot.sendMessage(id, 'Выберете шаблон для отправки на номер:'+ phonenumber,{
            reply_markup:{
                inline_keyboard
            }
        })
    }
})
````
<a name="Send+request"></a>
### Send request
Using a <code>request</code> module
````js
const request = require('request');
````
We can send post request to SMS API (You should use settings of your sms api provider).
````js
    const requestSms = (id)=>{
        request.post(postQuery, {
            form: formApi_id
        }, function (err, httpResponse, body) {
            if (err) {
                console.error('Error !!!!!!:', err);
                return;
            }
            let res = JSON.parse(body);
            let responce;
           
            if (res.sms) {
                for (var phoneinsms in res.sms) {
                    responce = (res.sms[phoneinsms].status_code == 100) ? 'Сообщение на номер ' + phoneinsms + ' успешно отправлено. Ваш баланс: ' + res.balance :
                        'ERROR: ' + res.sms[phoneinsms].status_text + '. Ваш баланс: ' + res.balance
                }
            }
            else {
                responce = res.status +':' +res.status_text
            }
            bot.sendMessage(id, responce);
            phonenumber = null;
            formApi_id.to = null;
        })
    }
````

License
The MIT License (MIT)

Copyright © 2018 alexbuki




