//Global Timeout ==> Time limit for whole test
// 1.we can add time  timeout:30000, in defineConfig in playwright.config file

//Test Timeout ==> Time limit for Single test (30 secs);
// 1.we can add time  timeout:30000, in defineConfig in playwright.config file
// 2. we can define by test.setTimeout(5000);
// 3. test.slow(); //==> increase the test timout 3 times

// Action Timeout ==> limit for an action : eg check(),click(),fill();
// 1.we can add time  use:{ actionTimeout:5000}, in defineConfig in playwright.config file

// Navigation Timeout ==> limit for an Navigation Action : eg goto();
// 1.we can add time  use:{navigationTimeout:5000,}, in defineConfig in playwright.config file

// Expect Timeout ==> limit for locator assertion : eg  expect(text).toHaveText("Data loaded with AJAX get request.");
// 1.we can add time  expect:{timeout:20000} default:5000, in defineConfig in playwright.config file
// 2.await success.click({ timeout: 16000 });

// Action,Navigation,Expect TimeOut < Test TimeOut < Global TimeOut

import test, { expect } from "@playwright/test";

//to increase the test Suite time out
test.beforeEach(async ({ page }, testInfo) => {
  page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
  testInfo.setTimeout(testInfo.timeout + 3000); //=> Increase the test suit time by 3 secs
});

test("time outs", async ({ page }) => {
  test.setTimeout(600000);
  const success = page.locator(".bg-success");
  await success.click({ timeout: 16000 }); //=> Increase the Expect Timeout time by 16 secs
});

test("time outs slow", async ({ page }) => {
  test.slow(); //==> increase the test timout 3 times
  const success = page.locator(".bg-success");
  await success.click({ timeout: 16000 });
});
