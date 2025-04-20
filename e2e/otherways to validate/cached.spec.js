// import { test, expect } from '@playwright/test';

// test.describe('Cache Strategy Validation', () => {
//     let page;

//     test.beforeAll(async ({ browser }) => {
//         page = await browser.newPage();
        
//         // Login sequence
//         await page.goto('https://user.asians.group/auth/realms/asians/protocol/openid-connect/auth?client_id=public&redirect_uri=https%3A%2F%2Fconsole.asians.group%2F%23%2F&state=625a8e65-456b-414a-8fa1-0db99c3dcbe3&response_mode=fragment&response_type=code&scope=openid&nonce=c0e2d0c0-4788-4f4f-8007-220821189d7a');
//         await page.getByRole('textbox', { name: 'Email' }).fill('qa.assessment@asians.cloud');
//         await page.getByRole('textbox', { name: 'Password' }).fill('qaengineer123');
//         await page.getByRole('button', { name: 'Sign In' }).click();
//         await page.waitForTimeout(55000);
//     });

//     test.afterAll(async () => {
//         await page.close();
//     });

//     test('Configure cache strategy and validate x-cache-status', async () => {
//         // Configure cache strategy
//         await page.goto('https://console.asians.group/#/domain/list');
//         await page.locator('div:nth-child(2) > .btn').first().click();
//         await page.getByRole('checkbox', { name: 'Bypass All Cookie' }).uncheck();
//         await page.getByRole('checkbox', { name: 'Enable Cache FullSite' }).check();
//         await page.getByRole('button', { name: 'icon: save Save' }).click();
//        // await page.getByText('Save Success').click();

//         // Wait for configuration to apply
//         await page.waitForTimeout(9000);

//         // Test domain
//         const domain = 'test-3.cwcdn.com';
//         const testPath = '/test';

//         // Make initial request and check for MISS
//         const response1 = await page.request.get(`https://${domain}${testPath}`);
//         const xCacheStatus1 = response1.headers()['x-cache-status'];
//         expect(['MISS',"REFRESH"]).toContain(xCacheStatus1);
//        // expect(['MISS']).toContain(xCacheStatus1);

//         // Make second request and check for HIT
//         const response2 = await page.request.get(`https://${domain}${testPath}`);
//         const xCacheStatus2 = response2.headers()['x-cache-status'];
//         expect(xCacheStatus2).toBe('HIT');

//         // Test with different path that shouldn't be cached
//         const nonCachedPath = '/non-cached-path';
//         const response3 = await page.request.get(`https://${domain}${nonCachedPath}`);
//         const xCacheStatus3 = response3.headers()['x-cache-status'];
//         expect(xCacheStatus3).not.toBe('HIT');
//     });
// });