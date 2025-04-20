import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { DomainSettingsPage } from '../../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Cache Strategy Turn Off Flow', () => {
    let page;
    let authPage;
    let domainSettingsPage;
    const domain = 'test-3.cwcdn.com';
    const testPaths = [
        '/test',          // Configured cached path
        '/non-cached',    // Not configured for caching
        '/image.jpg',     // Static image
        '/script.js',     // Static JS
        '/style.css',     // Static CSS
        '/api/data'       // API endpoint
    ];

    // Common setup for all tests
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        authPage = new AuthPage(page);
        domainSettingsPage = new DomainSettingsPage(page);
        await authPage.login('qa.assessment@asians.cloud', 'qaengineer123');
    });



    // Flow 5: Cache Strategy Turn Off Tests
    test.describe('Cache Strategy Turn Off Flow', () => {
        test.beforeEach(async () => {
            await domainSettingsPage.navigateToDomainList();
            await domainSettingsPage.searchDomain(domain);
            await domainSettingsPage.configureCacheStrategyOFF();
            await domainSettingsPage.navigateToDomain();
            await page.waitForTimeout(65000);
        });

        test('should not return cache headers when strategy is turned off', async ({ request }) => {
            const initialResults = await Promise.all(
                testPaths.map(async (path) => {
                    const response = await request.get(`https://${domain}${path}`);
                    return {
                        path,
                        status: response.status(),
                        cacheStatus: response.headers()['x-cache-status']
                    };
                })
            );

            initialResults.forEach(result => {
                expect.soft(result.cacheStatus).toBeUndefined();
            });
        });
    });
});