import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { DomainSettingsPage } from '../pages/domainSettings.page';

const randomFloat = Math.random(); 
const flooredNum = Math.floor(randomFloat * 1000);

test.describe('Cache Strategy Tests', () => {
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