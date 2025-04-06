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

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        authPage = new AuthPage(page);
        domainSettingsPage = new DomainSettingsPage(page);
        await authPage.login('qa.assessment@asians.cloud', 'qaengineer123');
    });

    test.afterAll(async () => {
        await page.close();
    });


test('HTTP Methods cache behavior', async ({ request }) => {
    await domainSettingsPage.navigateToDomainList();
    await domainSettingsPage.cachestrategyToggleCheck();
    await page.waitForTimeout(60000);
    await domainSettingsPage.navigateToDomain() ;
    
    await page.waitForTimeout(30000);
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];
    
    for (const method of methods) {
        const response = await request.fetch(`https://${domain}/test`, {
            method: method
        });
        console.log(`${method} request cache status: ${response.headers()['x-cache-status']}`);
        
        if (method === 'GET' || method === 'HEAD') {
            expect.soft(['HIT', 'MISS']).toContain(response.headers()['x-cache-status']);
        } else {
            expect.soft(['BYPASS', 'MISS']).toContain(response.headers()['x-cache-status']);
        }
    }
});

test('Cache TTL behavior', async ({ request }) => {
    const firstResponse = await request.get(`https://${domain}/test`);
    expect.soft(firstResponse.headers()['x-cache-status']).toBe('MISS');
    
    const secondResponse = await request.get(`https://${domain}/test`);
    expect.soft(secondResponse.headers()['x-cache-status']).toBe('HIT');
    
    await new Promise(resolve => setTimeout(resolve, 61000)); // 61 seconds
    
    const thirdResponse = await request.get(`https://${domain}/test`);
    expect.soft(thirdResponse.headers()['x-cache-status']).toBe('MISS');
});
});