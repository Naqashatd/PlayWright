import { test, expect } from '@playwright/test';
import { AuthPage } from '../../pages/auth.page';
import { DomainSettingsPage } from '../../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Custom Cache Path Configuration Flow', () => {
    let page;
    let authPage;
    let domainSettingsPage;
    const domain = 'test-1.cwcdn.com';
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


    // Flow 4: Custom Cache Path Configuration Tests
    test.describe('Custom Cache Path Configuration Flow', () => {
        const newPath = '/test' + flooredNum;

        test.beforeEach(async () => {
            await domainSettingsPage.navigateToDomainList();
            await domainSettingsPage.searchDomain(domain);
            await domainSettingsPage.configureCustomCachePath(newPath);
            await page.waitForTimeout(65000);
        });

        test('should properly cache custom configured paths', async ({ request }) => {
            const initialResults = await Promise.all(
                testPaths.map(async (path) => {
                    const response = await request.get(`https://${domain}${newPath}`);
                    return {
                        path,
                        status: response.status(),
                        cacheStatus: response.headers()['x-cache-status']
                    };
                })
            );

            console.log('Custom path request results:');
            initialResults.forEach(result => {
                console.log(`${result.path}: ${result.cacheStatus}`);
                if (result.path === '/test') {
                    expect.soft(['HIT','BYPASS','REFRESH','MISS']).toContain(result.cacheStatus);
                }
            });
        });

        test('should maintain proper cache behavior for non-custom paths', async ({ request }) => {
            await domainSettingsPage.navigateToDomain();
            const secondResults = await Promise.all(
                testPaths.map(async (path) => {
                    const response = await request.get(`https://${domain}${path}`);
                    return {
                        path,
                        status: response.status(),
                        cacheStatus: response.headers()['x-cache-status']
                    };
                })
            );

            console.log('\nSecond request results for custom path:');
            secondResults.forEach(result => {
                console.log(`${result.path}: ${result.cacheStatus}`);
                if (result.path === '/test') {
                    expect.soft(result.cacheStatus).toBe('HIT');
                }
                if (result.path === '/non-cached' || result.path === '/api/data') {
                    expect.soft(['HIT','BYPASS','REFRESH','MISS']).toContain(result.cacheStatus);
                }
            });
        });
    });
});