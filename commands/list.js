module.exports = {
     name : "소환"
    , description : "보리봇 호출시"
    , execute(message) {
        return message.channel.send(`${message.author}님 무슨일 이신가요`);
    }
}
