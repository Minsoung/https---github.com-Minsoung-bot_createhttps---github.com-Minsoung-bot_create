module.exports = {
    name : "가문원시트"
  , description : "가문원 시트호출"

  , Sheet_Call(msg,Discord) {
        return msg.channel.send("https://docs.google.com/spreadsheets/d/1pZ5jfuVydOrfvvrEHr-f7cw_lpEPGeFGOvBKDH07bx0/edit?usp=sharing");
    }
}