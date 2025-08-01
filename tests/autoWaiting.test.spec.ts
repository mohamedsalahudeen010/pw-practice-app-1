import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successMessage = page.locator(".bg-success");
  await successMessage.click();
  //here for textContent playwright will wait for 30 secs so that success message coming after 15secs gets detected and gets passed
  const text = await successMessage.textContent();

  expect(text).toEqual("Data loaded with AJAX get request.");
});

test("auto waiting 2", async ({ page }) => {
  const successMessage = page.locator(".bg-success");
  await successMessage.waitFor({ state: "attached" });
  await successMessage.click();
  //here for allTextContents playwright won't wait so we need to wait manually
  const text = await successMessage.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test("auto waiting 3 with Locator Assertion 1", async ({ page }) => {
  //here WKT for locator assertion PW wait for 5secs but here the success loaded after 15secs so we use WAITFOR
  const successMessage = page.locator(".bg-success");
  await successMessage.waitFor({ state: "attached" });
  await expect(successMessage).toHaveText("Data loaded with AJAX get request.");
});

// <<<<<<<<<<<OR>>>>>>>>>>>
test("auto waiting 3 with Locator Assertion 2", async ({ page }) => {
  //here WKT for locator assertion PW wait for 5secs but here the success loaded after 15secs so we use { timeout: 20000 }
  const successMessage = page.locator(".bg-success");
  await expect(successMessage).toHaveText(
    "Data loaded with AJAX get request.",
    { timeout: 20000 }
  );
});

test("alternative waits", async ({ page }) => {
  const successMessage = page.locator(".bg-success");

  //wait for element
  // await page.waitForSelector('.bg-success');

  //wait fro Response => will wait for particular Response from BE
  // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

  //wait for network calls to be completed ('NOT RECOMMENDED)  ==> wait for all the network calls to be completed
  //   await page.waitForLoadState("networkidle"); // ==> wait for all the network calls to be completed

  //TimeOut
  await page.waitForTimeout(16000);

  const text = await successMessage.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});
