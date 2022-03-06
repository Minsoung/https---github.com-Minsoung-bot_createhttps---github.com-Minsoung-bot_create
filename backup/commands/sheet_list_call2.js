module.exports = {
    name : "막사이전"
  , description : "막사이전TiP 시트호출"

  , Sheet_Call2(msg,Discord) {
        return msg.channel.send("https://docs.google.com/presentation/d/1_2T1mQO3SzjHEgN2vzN8oIxDzvPo7fBMLekXO7y_0fE/edit?usp=sharing");
    }
}