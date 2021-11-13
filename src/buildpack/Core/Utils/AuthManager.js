export default class AuthManager {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    async grabLogin(id) {
        if (!id) {
            return await this.fileManager.retrieveFile('default-acc.json', false);
        }
    }
    async saveLogin(data, id) {
        if (!id) {
            return await this.fileManager.createFile(data, 'default-acc.json', false, false);
        }
    }
}