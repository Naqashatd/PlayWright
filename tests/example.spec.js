// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
  await page.goto('https://mytestingthoughts.com/Sample/home.html');

  // Expect a title "to contain" a substring.
 // await expect(page).toHaveTitle(/Playwright/);

  // // create a locator
  // const getStarted = page.locator('text=Get Started');

  // // Expect an attribute "to be strictly equal" to the value.
  // await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // // Click the get started link.
  // await getStarted.click();
  
  // // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
});
test('Enter First Name',async ({ page })=>{
  await page.locator("input[placeholder='First Name']").fill('QA')
})
test('Enter Last Name',async ({ page })=>{
  await page.locator("input[placeholder='Last Name']").fill('Test')
})
test('Select Gender as Male',async ({ page })=>{
    await page.locator('#inlineRadioMale').check()
})
test('Select Department as Departmenr of Engineering',async ({ page })=>{
  await page.selectOption("select[name='department']",'Department of Engineering')
})
test('Enter Username',async ({ page })=>{
  await page.locator("input[placeholder='Username']").fill('QaTest568')
})
test('Enter Password',async ({ page })=>{
  await page.locator("input[placeholder='Password']").fill('Password1')
})
test('ReEnter in Confirm Password',async ({ page })=>{
    await page.locator("input[placeholder='Confirm Password']").fill('Password1')
})
test('Enter Email',async ({ page })=>{
    await page.locator("input[placeholder='E-Mail Address']").fill('TestQa@email.com')
})
test('Enter Phone Number',async ({ page })=>{
    await page.locator("input[placeholder='(639)']").fill('‎13324558954')
})
test('Enter Additional Information',async ({ page })=>{
    await page.locator("#exampleFormControlTextarea1").fill('Just for testing Purpose')
})
