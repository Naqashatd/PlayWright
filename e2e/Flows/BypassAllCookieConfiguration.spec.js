import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { DomainSettingsPage } from '../../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Bypass All Cookie Configuration Flow', () => {
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

    // Flow 1: Bypass All Cookie Configuration Tests
    test.describe('Bypass All Cookie Configuration Flow', () => {
        test.beforeEach(async () => {
            await domainSettingsPage.navigateToDomainList();
            await domainSettingsPage.searchDomain(domain);
            await domainSettingsPage.cachestrategyToggleCheck();
            await page.waitForTimeout(6000);
            await domainSettingsPage.configureBypassAllCookie();
            await domainSettingsPage.navigateToDomain();
        });

        test('should bypass cache when cookie is present for configured path', async ({ request }) => {
            const testPath = '/test';
            await page.waitForTimeout(65000);
            
            // First request should be bypassed
            const response1 = await request.get(`https://${domain}${testPath}`);
            expect(response1.headers()['x-cache-status']).toContain('BYPASS');

            // Second request should still be bypassed
            await page.waitForTimeout(5000);
            const response2 = await request.get(`https://${domain}${testPath}`);
            expect(response2.headers()['x-cache-status']).toBe('BYPASS');
        });

        test('should bypass cache for non-configured paths when cookie is present', async ({ request }) => {
            const cachedPath = '/non-cached-path';
            const response = await request.get(`https://${domain}${cachedPath}`);
            expect.soft(response.headers()['x-cache-status']).toBe('BYPASS');
        });
    });
});