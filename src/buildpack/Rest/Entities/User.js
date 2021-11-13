export default class User {
  constructor(name, id, status, friends, auth, online, badges, about, avatar, created, admin) {
    this.name = name;
    this.id = id;
    this.status = status;
    this.friends = friends;
    this.auth = auth,
    this.online = online;
    this.badges = badges;
    this.about = about;
    this.avatar = avatar;
    this.created = created;
    this.admin = admin;
  }
}
