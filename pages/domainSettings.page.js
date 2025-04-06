const { expect } = require('@playwright/test');
export class DomainSettingsPage {
    constructor(page) {
        this.page = page;
        this.editButton = page.locator('div:nth-child(2) > .btn').first();
        this.bypassAllCookieCheckbox = page.getByRole('checkbox', { name: 'Bypass All Cookie' });
        this.enableCacheFullSiteCheckbox = page.getByRole('checkbox', { name: 'Enable Cache FullSite' });
        this.saveButton = page.getByRole('button', { name: 'icon: save Save' });
        this.clearCacheButton = page.getByRole('button', { name: 'Clear cache' });
        this.advancedConfigTab = page.getByRole('tab', { name: 'Advanced configuration' });
        this.cacheStrategySection = page.getByText('Cache strategy');
        this.addNewCachePathButton = page.getByText('Add new cache path');
        this.pathInput = page.getByRole('textbox', { name: '/path, /test' });
        this.addPathButton = page.getByRole('button', { name: 'icon: plus Add' });
        this.cacheSwitch = page.getByRole('switch', { name: 'icon: close' });
        this.cacheStrategyToggle = page.locator("div[class='d-flex align-items-center flex-fill'] span[class='ant-switch-inner']");
        this.toggleoff = page.getByRole('switch', { name: 'icon: close' });
        this.toggleOn = page.getByLabel('Domain name configuration:').getByRole('banner').getByRole('switch', { name: 'icon: check' });
        this.searchField = page.locator('[placeholder="Keyword search"]').nth(1);
        this.searchIconButton = page.locator('(//i[@aria-label="icon: search"]/parent::button)[2]');
    }

    async navigateToDomainList() {
        await this.page.goto('https://console.asians.group/#/domain/list', { waitUntil: 'load' });
    }
    async navigateToDomain() {
        await this.page.goto('https://test-2.cwcdn.com/', { waitUntil: 'load' })
    }

    async navigateToDomainPath() {
        await this.page.goto('https://test-2.cwcdn.com/static', { waitUntil: 'load' })
    }
    async configureBypassAllCookieCheck(enable = true) {
        await this.editButton.click();
        await this.bypassAllCookieCheckbox.check();
        await this.saveButton.click();
        await this.page.waitForTimeout(6000);
    }
    async configureBypassAllCookieUncheck(enable = true) {
        await this.editButton.click();
        await this.bypassAllCookieCheckbox.uncheck();
        await this.saveButton.click();
        await this.page.waitForTimeout(6000);
    }

    async cachestrategyToggleCheck(){
        await this.editButton.click();
    if (await this.toggleoff.isVisible()) {
      await this.toggleoff.click();
    }
        await this.saveButton.click();
    }

    async configureCacheFullSiteCheck(enable = true) {
        await this.editButton.click();
        if (await this.bypassAllCookieCheckbox.isChecked()) {
                        await this.bypassAllCookieCheckbox.uncheck();
                    }
        await this.page.getByRole('checkbox', { name: 'Enable Cache FullSite' }).check();
        await this.saveButton.click();

        //await expect(this.page.getByText('Domain saved successfully')).toBeVisible();
        await this.page.waitForTimeout(6000);
    }

    async configureCacheFullSiteUncheck(enable = true) {
        await this.editButton.click();
        await this.enableCacheFullSiteCheckbox.uncheck();
        await this.saveButton.click();

        //await expect(this.page.getByText('Domain saved successfully')).toBeVisible();
        await this.page.waitForTimeout(6000);
    }
    async clearCache() {
        await this.editButton.click();

        await this.clearCacheButton.click();
      //  await expect(this.page.getByText('Clear cache action is running')).toBeVisible();
        await this.saveButton.click();
        await this.page.waitForTimeout(6000);
    }

    async configureCustomCachePath(path) {
        await this.editButton.click();
        await this.advancedConfigTab.click();
       await this.addNewCachePathButton.click();
        await this.pathInput.fill(path);
       await this.addPathButton.click();
  
        await this.saveButton.click();
        await this.page.waitForTimeout(6000);
    }
    async configureCacheStrategyOFF() {
        await this.editButton.click();
        await this.advancedConfigTab.click();
       await this.toggleOn.click();
  
        await this.saveButton.click();
        await this.page.waitForTimeout(6000);
    }

    async searchDomain(domain){
        await this.searchField.fill(domain);
        await this.searchField.press('Enter');
        for (let i = 0; i < 3; i++){
            await this.searchIconButton.waitFor({state:"attached", timeout:10000})
            await this.page.waitForTimeout(1000)
            await this.searchIconButton.click();
        }
        await this.searchIconButton.click();
    }
}
