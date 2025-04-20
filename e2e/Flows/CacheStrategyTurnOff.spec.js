import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { DomainSettingsPage } from '../../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Clear Cache Functionality Flow', () => {
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
     // Flow 3: Clear Cache Functionality Tests
     test.describe('Clear Cache Functionality Flow', () => {
        test.beforeEach(async () => {
            await domainSettingsPage.navigateToDomainList();
            await domainSettingsPage.searchDomain(domain);
            await domainSettingsPage.clearCache();
        });

        test('should show MISS or REFRESH status after cache clearance', async ({ request }) => {
            await page.waitForTimeout(75000);
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

            console.log('Initial request results after cache clearance:');
            initialResults.forEach(result => {
                console.log(`${result.path}: ${result.cacheStatus}`);
                if (result.path === '/test') {
                    expect.soft(['MISS','REFRESH']).toContain(result.cacheStatus);
                }
            });
        });
    });
});