import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { DomainSettingsPage } from '../../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Full Site Cache Configuration Flow', () => {
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
 
    // Common teardown for all tests
    test.afterAll(async () => {
        await page.close();
    });
    // Flow 2: Full Site Cache Configuration Tests
    test.describe('Full Site Cache Configuration Flow', () => {
        test.beforeEach(async () => {
            await domainSettingsPage.navigateToDomainList();
            await domainSettingsPage.searchDomain(domain);
            await domainSettingsPage.configureCacheFullSite();
        });

        test('should cache content on first MISS and serve HIT on subsequent requests', async ({ request }) => {
            const testPath = '/test';
            await page.waitForTimeout(75000);
            
            // First request should be MISS or REFRESH
            const response1 = await request.get(`https://${domain}${testPath}`);
            expect.soft(['MISS','REFRESH']).toContain(response1.headers()['x-cache-status']);

            // Second request should be HIT
            const response2 = await request.get(`https://${domain}${testPath}`);
            expect.soft(response2.headers()['x-cache-status']).toBe('HIT');
        });
    });
});