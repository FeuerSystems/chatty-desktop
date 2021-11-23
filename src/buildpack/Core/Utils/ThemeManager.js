export default class ThemeManager {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    async getTheme() {
        return await this.fileManager.retrieveFile('theme.json', false);
    }
}