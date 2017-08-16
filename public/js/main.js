const socket = io();
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'zh-CN'; //  //en-US
recognition.interimResults = false;
const button = document.getElementById('btn');
const talkList = $('.talk-list');
let isStop = true; //是否已经暂停

button.addEventListener('click', () => {
    if (isStop) {
        recognition.start();
        isStop = false;
    }
});
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    socket.emit('chat message', text);
    addTalk(text);
});
recognition.addEventListener('end', (e) => {
    isStop = true;
});

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

function addTalk(t) {
    let html = `<div class="item-ren">
     <span class="output-you">${t}</span>
      <span class="ren">
         <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-ren"></use>
        </svg>
      </span>
     </div>`
    talkList.append(html);
}

function addReply(t) {
    let html = `<div class="item-bot">
        <span class="bot">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-qy-wxjq-l"></use>
          </svg>
        </span>
    <span class="output-bot">${t}</span></div>`
    talkList.append(html);
}
socket.on('bot reply', function(replyText) {
    addReply(replyText);
    synthVoice(replyText);
});