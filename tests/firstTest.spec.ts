import { expect, test } from "@playwright/test";

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
  const newLocal = "Remember me";
  await page
    .locator("nb-card", { hasText: "Horizontal form" })
    .locator("nb-checkbox")
    .click();

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

  // await page
  //   .locator("nb-card")
  //   .nth(3)
  //   .getByRole("button", { name: "SIGN IN" })
  //   .click();
});

test("locating parent elements", async ({ page }) => {
  // Both Same
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ hasText: "Using the Grid" })
    .getByRole("textbox", { name: "email" })
    .click();
  // Both Same
  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "email" })
    .click();
  // Both Same
  await page
    .locator("nb-card", { hasText: "Basic form" })
    .getByRole("textbox", { name: "email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "email" })
    .click();
  // Both Same
  await page
    .locator("nb-card", { has: page.locator("#exampleInputEmail1") })
    .getByRole("textbox", { name: "email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator("#exampleInputEmail1") })
    .getByRole("textbox", { name: "email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Horizontal form" })
    .getByRole("textbox", { name: "email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign In" })
    .getByRole("button")
    .click();

  // to get out one level from target

  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "email" })
    .click();

  // await page
  // .locator("nb-card").locator('nb-card-body')
  // .locator("form",{has:page.locator('.form-horizontal')})
  // .getByRole("textbox", { name: "email" })
  // .click();
});

test("reusing the locators", async ({ page }) => {
  const baseForm = page.locator("nb-card", { hasText: "Block form" });
  const firstName = baseForm.getByRole("textbox", { name: "First Name" });
  const lastName = baseForm.getByRole("textbox", { name: "Last Name" });
  const email = baseForm.getByRole("textbox", { name: "Email" });
  const Website = baseForm.getByRole("textbox", { name: "Website" });

  await firstName.fill("mohamed Salahudeen");
  await lastName.fill("Jamaldeen");
  await email.fill("abc@123.com");
  await Website.fill("456ujn");
  await baseForm.getByRole("button").filter({ hasText: "SUBMIT" }).click();

  await expect(firstName).toHaveValue("mohamed Salahudeen");
  await expect(lastName).toHaveValue("Jamaldeen");
  await expect(email).toHaveValue("abc@123.com");
  await expect(Website).toHaveValue("456ujn");
});

test("extracting Values", async ({ page }) => {
  //single text value
  const basicForm = page.locator("nb-card", { hasText: "Basic form" });
  const button = await basicForm.locator("button").textContent();
  expect(button).toEqual("Submit");

  //all text values
  const allRadioButtonValues = await page.locator("nb-radio").allTextContents();
  expect(allRadioButtonValues).toContain("Option 1");

  // input values
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("Sala123@gmail.com");
  await expect(emailField).toHaveValue("Sala123@gmail.com");
  // <<<<<<OR>>>>>
  const emailVal = await emailField.inputValue();
  expect(emailVal).toEqual("Sala123@gmail.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");

  const blockForm = page.locator("nb-card", { hasText: "Form without labels" });

  const recipient = blockForm.getByRole("textbox", { name: "Recipients" });

  await recipient.fill("Sachin Tendulkar");

  const recipientVal = await recipient.inputValue();
  expect(recipientVal).toEqual("Sachin Tendulkar");
});

// ASSERTIONS
test("Assertions", async ({ page }) => {
  //General Assertion did not wait
  const basicFormButton = page
    .locator("nb-card", { hasText: "Basic form" })
    .locator("button");
  const text = basicFormButton.textContent();
  expect(text).toEqual('Submit');

  // Locator Assertion ==> wait for 5 secs to finish 
  await expect(basicFormButton).toHaveText('Submit');

  //Soft Assertion ==> will continue even the assertion fails
  await expect.soft(basicFormButton).toHaveText('Submit');
  await basicFormButton.click(); //==> will get executed even though above assertion fails
});

// Auto Waiting 
test('Auto Waiting',async ({page})=>{

})

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
