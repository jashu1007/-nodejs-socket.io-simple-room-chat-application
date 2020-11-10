const socket = io();
const chatBox = document.querySelector('.chatbox');
const usersBox = document.querySelector('.users');
const chatForm = document.querySelector('.chatForm');

window.scrollY = chatBox.innerHeight;
socket.emit('userJoin');

chatForm.onsubmit = (e) => {
  e.preventDefault();
  const chatMessage = e.target.chatMessage.value;

  if (!chatMessage) {
    alert('please enter a message');
  } else {
    socket.emit('chatMessage', chatMessage);

    e.target.chatMessage.value = '';
    e.target.chatMessage.focus;

    chatBox.scrollY = chatBox.innerHeight;
  }
};

socket.on('message', ({ user, message, time }) => {
  let div = document.createElement('div');
  div.className = 'chatMessage';
  div.innerHTML = `
  <div class="col-md-10 mx-auto card my-2 pt-3">
    <div class="col-md-12 py-0 d-flex">
      <p class="text-primary">${user}</p>
      <p class="time">&nbsp;${time}</p>
    </div>
    <p class=" font-weight-bold col-md-12 py-0">${message}</p>
  </div>
  `;
  chatBox.append(div);
});

socket.on('users', (roomUsers) => {
  usersBox.innerHTML = `<h1 class="text-center lead my-4">users</h1>`;
  roomUsers.map((user) => {
    usersBox.innerHTML += `<p class="small text-center"> ${user.username} </p>`;
  });
  console.log(roomUsers);
});
