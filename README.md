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

***
<a name="Start+bot"></a>
### Start bot
***
- This app use <code>a 'config' module</code>.
To start bot you should use your token in ./config/default.json file. Paste your token in "token:" line.
````
js
 "token": "your token"
````
- The app uses API SMS. In this example it is http://sms.ru/sms/send. After registration you'll get <code>api_id</code>.
-Next you can start the bot using <code>/start</code> command. The bot'll request your <code>api_id</code>.
Paste it and you can use the bot.

<a name="Create+templates"></a>
### Create templates
***
<a name="Keyboard"></a>
### Keyboard
***
<a name="Parsing+phone+number"></a>
### Parsing phone number
***
<a name="Force+reply"></a>
### Force reply
***
<a name="Send+request"></a>
### Send request





