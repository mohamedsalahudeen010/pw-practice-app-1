import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("locater syntax", async ({ page }) => {
  //by tag name
  await page.locator("input").first().click();

  //by ID name
  await page.locator("#inputEmail1").click();

  //by class name
  await page.locator(".shape-rectangle").first().click();

  //by attribute
  await page.locator("[ng-reflect-full-width]").first().click();
  await page.locator('[placeholder="Email"]').first().click();

  //By Class Whole class
  await page
    .locator(
      '[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]'
    )
    .click();

  //by combining two or more different selectors
  //here four different selectors are combined
  //page.locator('(1)input(2)#inputEmail1(3)[placeholder="Email"](4).shape-rectangle');
  await page
    .locator('input#inputEmail1[placeholder="Email"].shape-rectangle')
    .click();

  //   By using X-path (not recommended)
  //   await page.locator("//*[@id=inputEmail1]").click();

  //by partial text match
  await page.locator(':text("Using")').click();

  //by exact text match
  await page.locator(':text-is("Using the Grid")').click();
});

test("user facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "email" }).first().click();
  await page.getByRole("button", { name: "SIGN IN" }).first().click();

  await page.getByLabel("Password").first().click();

  await page.getByPlaceholder("Website").first().click();

  //   await page.getByTestId("anyID").first().click();
  //add test id as data-testid='anyID' where do you want to target

  await page.getByText("Block Form").click();

  await page.getByTitle("IoT Dashboard").click();
});

test("locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();
  // above both are same

  await page
    .locator("nb-card")
    .getByRole("button", { name: "SIGN IN" })
    .first()
    .click();

    await page
    .locator("nb-card").nth(3)
    .getByRole("button", { name: "SIGN IN" })
    .click();
});
//To Group
// test.describe("Group tests1", () => {
//   test("first test", () => {});
//   test("second test", () => {});
//   test("third test", () => {});
// });
// test.describe("Group tests2", () => {
//   test("first test", () => {});
//   test("second test", () => {});
//   test("third test", () => {});
// });
