const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}
// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get users
function getUsers(room) {
  const RoomUsers = [];
  users.map((user) => {
    if (user.room == room) {
      RoomUsers.push(user);
    }
  });

  return RoomUsers;
}

module.exports = {
  userJoin,
  userLeave,
  getUsers,
};
