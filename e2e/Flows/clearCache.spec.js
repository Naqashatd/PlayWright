// import { test, expect } from '@playwright/test';

// test.describe('Comprehensive Cache Strategy Validation', () => {
//     const domain = 'test-3.cwcdn.com';
//     const testPaths = [
//         '/test',          // Configured cached path
//         '/non-cached',    // Not configured for caching
//         '/image.jpg',     // Static image
//         '/script.js',     // Static JS
//         '/style.css',     // Static CSS
//         '/api/data'       // API endpoint
//     ];
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

//     test('Configure cache strategy and validate x-cache-status', async ({ request }) => {
//         // Configure cache strategy in UI
//         await test.step('Configure cache strategy in console', async () => {
//             await page.goto('https://console.asians.group/#/domain/list');
//             await page.locator('div:nth-child(2) > .btn').first().click();
//             await page.getByRole('button', { name: 'Clear cache' }).click();
//             await expect(page.getByText('Clear cache action is running')).toBeVisible();
//             await expect(page.getByText('Clear cache action was')).toBeVisible();
//             await page.getByRole('button', { name: 'icon: save Save' }).click();
//             await page.waitForTimeout(9000);
//         });

//         // Test all endpoints
//         await test.step('Verify x-cache-status for all endpoints', async () => {
//             // First pass - initial requests
//             const initialResults = await Promise.all(
//                 testPaths.map(async (path) => {
//                     const response = await request.get(`https://${domain}${path}`);
//                     return {
//                         path,
//                         status: response.status(),
//                         cacheStatus: response.headers()['x-cache-status']
//                     };
//                 })
//             );

//             console.log('Initial request results:');
//             initialResults.forEach(result => {
//                 console.log(`${result.path}: ${result.cacheStatus}`);
//                 if (result.path === '/test') {
//                     expect(['MISS',"REFRESH"]).toContain(result.cacheStatus);
//                 }
//             });

//             // Second pass - repeat requests
//             const secondResults = await Promise.all(
//                 testPaths.map(async (path) => {
//                     const response = await request.get(`https://${domain}${path}`);
//                     return {
//                         path,
//                         status: response.status(),
//                         cacheStatus: response.headers()['x-cache-status']
//                     };
//                 })
//             );

//             console.log('\nSecond request results:');
//             secondResults.forEach(result => {
//                 console.log(`${result.path}: ${result.cacheStatus}`);
//                 if (result.path === '/test') {
//                     expect(result.cacheStatus).toBe('HIT');
//                 }
//               //  All other paths should not be HIT
//                 // else {
//                 //     expect(result.cacheStatus).not.toBe('HIT');
//                 // }
//             });
//         });

//         // Additional test cases
//         await test.step('Verify different HTTP methods', async () => {
//             const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'];
            
//             for (const method of methods) {
//                 const response = await request.fetch(`https://${domain}/test`, {
//                     method: method
//                 });
//                 console.log(`${method} request cache status: ${response.headers()['x-cache-status']}`);
                
//                 if (method === 'GET' || method === 'HEAD') {
//                     expect(['HIT', 'MISS','REFRESH']).toContain(response.headers()['x-cache-status']);
//                 } else {
//                     expect(['BYPASS', 'MISS']).toContain(response.headers()['x-cache-status']);
//                 }
//             }
//         });

//         await test.step('Verify cache TTL behavior', async () => {
//             const firstResponse = await request.get(`https://${domain}/test`);
//            // expect(['HIT', 'MISS','REFRESH']).toContain(firstResponse.headers()['x-cache-status']);
//             expect(firstResponse.headers()['x-cache-status']).toBe('MISS');
            
//             const secondResponse = await request.get(`https://${domain}/test`);
//             expect(secondResponse.headers()['x-cache-status']).toBe('HIT');
            
//             await new Promise(resolve => setTimeout(resolve, 61000)); // 61 seconds
            
//             const thirdResponse = await request.get(`https://${domain}/test`);
//            // expect(['HIT', 'MISS','REFRESH']).toContain(thirdResponse.headers()['x-cache-status']);
//             expect(thirdResponse.headers()['x-cache-status']).toBe('MISS');
//         });

//         await test.step('Verify cache purge', async () => {
//             // Implementation would go here if purge API is available
//             // await request.post(`https://api.console.asians.group/purge/${domain}`);
            
//             const postPurgeResponse = await request.get(`https://${domain}/test`);
//             expect(postPurgeResponse.headers()['x-cache-status']).toBe('MISS');
//           // expect(['HIT', 'MISS','REFRESH']).toContain(postPurgeResponse.headers()['x-cache-status']);
//         });
//     });
// });