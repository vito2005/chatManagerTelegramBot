
const  Agent = require( 'socks5-https-client/lib/Agent');
const config = require('config');
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
let phonenumber;
let templates = [];
let count = 0;
let settings ={};


// let host = 'gate.smsaero.ru/v2/sms/send';
// let login = 'vito2005@yandex.ru';
// let pw = 'Fn0reHOFluHS3rVtaZTFfojwU9vu';
// let sign = 'SMS Aero';
// let channel = 'DIRECT';


const sendTemplate = function(template){

    let formApi_id ={
        api_id: settings.api_id,
        to: phonenumber,
        msg: template
    };

    let formStandart = {
        number: phonenumber,
        text: template,
        sign: settings.sign,
        channel: settings.channel
    };

    let postQuery = settings.api_id? `https://${settings.host}`: `https://${settings.login}:${settings.pw}@${settings.host}`;


    request.post(postQuery, {
        form: settings.api_id? formApi_id: formStandart


    }, function(err, httpResponse, body) {
        if (err) {
            console.error('Error:', err);
            return;
        }
        console.log(body);
    })


}

const TOKEN = config.get('token');

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

const COMMAND_TEMPLATE1 = 'template1';
const COMMAND_TEMPLATE2 = 'template2';
const COMMAND_TEMPLATE3 = 'template3';
const COMMAND_TEMPLATE4 = 'template4';
const COMMAND_TEMPLATE5 = 'template5';
const COMMAND_ADDTEMPLATE = 'addTemplate';

const inline_keyboard = [
    [
        {
            text: 'Шаблон №1',
            callback_data: COMMAND_TEMPLATE1
        },
        {
            text: 'Шаблон №2',
            callback_data: COMMAND_TEMPLATE2
        }

    ],[
        {
            text: 'Шаблон №3',
            callback_data: COMMAND_TEMPLATE3
        },
        {
            text: 'Шаблон №4',
            callback_data: COMMAND_TEMPLATE4
        },
        {
            text: 'Шаблон №5',
            callback_data: COMMAND_TEMPLATE4
        }

    ],[
        {
            text: 'Добавить шаблон',
            callback_data: COMMAND_ADDTEMPLATE
        }
    ]
];

bot.onText(/\/start/,  (msg, [source, match])=> {
    const {chat: {id}} = msg;
    bot.sendMessage(id, `Введите настройки для sms api. host:`, {
        reply_markup: {
            force_reply: true
        }
    })
        .then(addHost => {
            const replyListenerId = bot.onReplyToMessage(addHost.chat.id, addHost.message_id, msg => {
                settings.host = msg.text;
                bot.sendMessage(id, `Введите настройки для sms api. api-id:`, {
                    reply_markup: {
                        force_reply: true
                    }
                }).then(addApiId => {
                    bot.onReplyToMessage(addApiId.chat.id, addApiId.message_id, msg => {
                        settings.api_id = msg.text;
                        if (settings.api_id) {
                            bot.removeReplyListener(replyListenerId);
                            return Promise.resolve()
                        }
                        bot.sendMessage(id, `Введите настройки для sms api. login:`, {
                            reply_markup: {
                                force_reply: true
                            }
                        }).then(addLogin => {
                            bot.onReplyToMessage(addLogin.chat.id, addLogin.message_id, msg => {
                                settings.login = msg.text;
                                bot.sendMessage(id, `Введите настройки для sms api. password:`, {
                                    reply_markup: {
                                        force_reply: true
                                    }
                                }).then(addPW => {
                                    bot.onReplyToMessage(addPW.chat.id, addPW.message_id, msg => {
                                        settings.pw = msg.text;
                                        bot.sendMessage(id, `Введите настройки для sms api. sign:`, {
                                            reply_markup: {
                                                force_reply: true
                                            }
                                        }).then(addSign => {
                                            bot.onReplyToMessage(addSign.chat.id, addSign.message_id, msg => {
                                                settings.sign = msg.text;
                                                bot.sendMessage(id, `Введите настройки для sms api. channel:`, {
                                                    reply_markup: {
                                                        force_reply: true
                                                    }
                                                }).then(addChannel => {
                                                    bot.onReplyToMessage(addChannel.chat.id, addChannel.message_id, msg => {
                                                        settings.channel = msg.text;
                                                        bot.removeReplyListener(replyListenerId);
                                                    })
                                                })
                                            })

                                        })
                                    })
                                })
                            })
                        })

                    })
                })
            })
        })
})

bot.onText(/\/settings/, (msg, [source, match]) =>{
    const {chat: {id}} = msg;
    let settingsMessage = (Object.keys(settings).length == 0) ? 'No settings. Please set settings by a /start command': settings;

    bot.sendMessage(id, 'Настройки sms api: '+ JSON.stringify(settingsMessage), {
    })

});

let regexp = /((\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?)/gim;

bot.onText(regexp, (msg, [source, match]) =>{
    const {chat: {id}} = msg;
    phonenumber = match;
    phonenumber = phonenumber.replace(/[\D]/g,'');
    phonenumber = (phonenumber.length == 10)? '+7' + phonenumber: '+7' + phonenumber.slice(1)

    bot.sendMessage(id, 'Выберете шаблон для отправки на номер:'+ phonenumber,{
        reply_markup:{
            inline_keyboard
        }
    })

})

bot.on('callback_query',  query=>{
    console.log('query', query)
    const {message: {chat, message_id, text}= {}} = query
    switch (query.data) {
        case COMMAND_TEMPLATE1:
            templates[0] ? sendTemplate(templates[0]) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №1');
            break
        case COMMAND_TEMPLATE2:
            templates[1] ? sendTemplate(templates[1]) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №2');
            break
        case COMMAND_TEMPLATE3:
            templates[2] ? sendTemplate(templates[2]) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №3');
            break
        case COMMAND_TEMPLATE4:
            templates[3] ? sendTemplate(templates[3]) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №4');
            break
        case COMMAND_TEMPLATE5:
            templates[4] ? sendTemplate(templates[4]) : bot.sendMessage(chat.id, 'Необходимо ввести текст шаблона №5');
            break


        case COMMAND_ADDTEMPLATE:

            bot.sendMessage(chat.id, `Введите текст шаблона №${count+1}`, {
                reply_markup: {
                    force_reply: true
                }
            }).then(addTemplate => {
                const replyListenerId = bot.onReplyToMessage(addTemplate.chat.id, addTemplate.message_id, msg => {
                    bot.removeReplyListener(replyListenerId);
                        templates[count] = msg.text
                        count++
                    if (count>4) count = 0;



                    console.log('template text', msg.text, templates)
                })
            })
            break
        default:
    }
    bot.answerCallbackQuery({
        callback_query_id: query.id//,
        //text: `Alert message is here: "${query.data}"`
    })
})
