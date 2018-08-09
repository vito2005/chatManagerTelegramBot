# chatManagerTelegramBot
This is a telegram bot helper to send templates by sms using node-telegram-bot-api  and some sms-api.

#  **Installation**

##  Install with npm

$ npm install sms-helper-telegram-bot
***
#  **Description**

* [Creating new bot with BotFather](#Creating+new+bot+with+BotFather)
* [Start bot](#Start+bot)
* [Create templates](#Create+templates)
* [Keyboard](#Keyboard)
* [Parsing phone number](#Parsing+phone+number)
* [Force reply](#Force+reply)
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
To start bot you should use your token in ./config/default.json file. Paste your token in "token:" line.
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
const bot = new TelegramBot(token, {polling: true});
```
We listen <code>/start</code> comand:

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


<a name="Create+templates"></a>
### Create templates
***
<a name="Keyboard"></a>
### Keyboard
***
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
<a name="Force+reply"></a>
### Force reply
***
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





