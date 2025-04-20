// import { test, expect } from '@playwright/test';
// import { AuthPage } from '../pages/auth.page';
// import { DomainSettingsPage } from '../pages/domainSettings.page';
// const randomFloat = Math.random(); 
// const flooredNum = Math.floor(randomFloat * 1000);

// const path = require('path');

// test.describe('Cache Strategy Tests', () => {
//     let page;
//     let authPage;
//     let domainSettingsPage;
//     const domain = 'test-2.cwcdn.com';
//     const testPaths = [
//         '/test',          // Configured cached path
//         '/non-cached',    // Not configured for caching
//         '/image.jpg',     // Static image
//         '/script.js',     // Static JS
//         '/style.css',     // Static CSS
//         '/api/data'       // API endpoint
//     ];

//     test.beforeAll(async ({ browser }) => {
//         page = await browser.newPage();
//         const context = await browser.newContext({
//             recordVideo: {
//                 dir: path.join(__dirname, 'videos'),
//                 size: { width: 1280, height: 720 }
//               }
//           });
//         authPage = new AuthPage(page);
//         domainSettingsPage = new DomainSettingsPage(page);
//         await authPage.login('qa.assessment@asians.cloud', 'qaengineer123');
//     });

//     test.afterAll(async () => {
//         await page.close();
//         //await context.close(); // flushes and saves the video
//     });

//     test('Bypass All Cookie configuration', async ({ request }) => {

//         await domainSettingsPage.navigateToDomainList();
//         await domainSettingsPage.searchDomain(domain);
//         await page.waitForTimeout(3000);
//         await domainSettingsPage.configureBypassAllCookieCheck();
        
//         await domainSettingsPage.navigateToDomain();
//         await page.waitForTimeout(15000);
//         await page.reload({ waitUntil: 'load' });
//         await domainSettingsPage.navigateToDomain();
//         // Make initial request and check for MISS
//         const response1 = await request.get(`https://${domain}/`);
//         const xCacheStatus1 = response1.headers()['x-cache-status'];
//        // in actual it should have first one
//        // expect(xCacheStatus1).toBe('MISS');
//        expect(xCacheStatus1).toContain('BYPASS');

//     });

//     test('Cache FullSite configuration', async ({ request }) => {
//         await domainSettingsPage.navigateToDomainList();
//         await domainSettingsPage.searchDomain(domain);
//         await page.waitForTimeout(3000);
//         await domainSettingsPage.configureBypassAllCookieUncheck();
//         await page.waitForTimeout(3000);
//         await domainSettingsPage.configureCacheFullSiteCheck();
//         await domainSettingsPage.navigateToDomain();
//         await page.waitForTimeout(15000);
//         await page.reload({ waitUntil: 'load' });
//         await domainSettingsPage.navigateToDomain();
        
//         await page.waitForTimeout(15000);
//         //await domainSettingsPage.navigateToDomain();
//         // Make second request and check for HIT
//         const response2 = await request.get(`https://${domain}/`);
//         const xCacheStatus2 = response2.headers()['x-cache-status'];
//         expect(xCacheStatus2).toContain('REFRESH');

//         // await domainSettingsPage.navigateToDomain();
//         // // Test with different path that shouldn't be cached
//         // const nonCachedPath = '/non-cached-path';
//         // const response3 = await request.get(`https://${domain}${nonCachedPath}`);
//         // const xCacheStatus3 = response3.headers()['x-cache-status'];
//         // expect.soft(xCacheStatus3).not.toBe('HIT');
//     });
//     test('Clear Cache functionality', async ({ request }) => {
//         await domainSettingsPage.navigateToDomainList();
//         await domainSettingsPage.searchDomain(domain);
//         await domainSettingsPage.clearCache();
//         await page.waitForTimeout(15000);
//        // await domainSettingsPage.navigateToDomain();
//         // First pass - initial requests
//         const initialResults = await Promise.all(
//             testPaths.map(async () => {
//                 const response = await request.get(`https://${domain}/`);
//                 return {
                    
//                     status: response.status(),
//                     cacheStatus: response.headers()['x-cache-status']
//                 };
//             })
//         );

//         console.log('Initial request results:');
//         initialResults.forEach(result => {
         
            
//                 expect.soft(['MISS','REFRESH','HIT']).toContain(result.cacheStatus);
            
//         });
//     });
//     test('Custom Cache Path check', async ({ request }) => {
//         await domainSettingsPage.navigateToDomainList();
//         await domainSettingsPage.searchDomain(domain);
//         await page.waitForTimeout(3000);
//         await domainSettingsPage.configureCacheFullSiteUncheck();
//         await domainSettingsPage.navigateToDomainPath();
//         // Test all endpoints
//         // First pass - initial requests
//         const initialResults = await Promise.all(
//             testPaths.map(async () => {
//                 const response = await request.get(`https://${domain}/`);
//                 return {
                    
//                     status: response.status(),
//                     cacheStatus: response.headers()['x-cache-status']
//                 };
//             })
//         );

//         console.log('Initial request results:');
//         initialResults.forEach(result => {
            
//                 expect.soft(['MISS','REFRESH', 'HIT']).toContain(result.cacheStatus);
            
//         });
//     });
// });