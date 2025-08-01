import test, { expect, Locator } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("input fields", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();

  const inputField = page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" });

  await inputField.fill("abc@123.com");
  await inputField.clear();
  await inputField.pressSequentially("sachin@123.com", { delay: 100 });

  //generic assertion
  const inputVal = await inputField.inputValue();
  expect(inputVal).toEqual("sachin@123.com");

  //locator assertion
  await expect(inputField).toHaveValue("sachin@123.com");
});

test("radio buttons", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();

  const formGrid = page.locator("nb-card", { hasText: "Using the Grid" });

  const radioButton1 = formGrid.getByLabel("Option 1");
  await radioButton1.check({ force: true });
  const radioButtonStatus = await radioButton1.isChecked();
  expect(radioButtonStatus).toBeTruthy();

  //generic assertion
  const radioButton2 = page.getByRole("radio", { name: "Option 2" });
  await radioButton2.check({ force: true });
  const radioButton2Status = await radioButton2.isChecked();
  expect(radioButton2Status).toBeTruthy();
  //   <<OR>>
  expect(await radioButton2.isChecked()).toBeTruthy();

  //Locator Assertion
  await expect(radioButton2).toBeChecked();
  await expect(radioButton1).not.toBeChecked();
});

test("check boxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  const checkobox1 = page.getByRole("checkbox", { name: "Hide on click" });
  const checkobox2 = page.getByRole("checkbox", {
    name: "Prevent arising of duplicate toast",
  });
  const checkobox3 = page.getByRole("checkbox", {
    name: "Show toast with icon",
  });
  await checkobox1.click({ force: true, timeout: 1000 });
  await checkobox2.click({ force: true, timeout: 1000 });
  await checkobox3.click({ force: true, timeout: 1000 });

  await checkobox1.check({ force: true, timeout: 1000 });
  await checkobox2.check({ force: true, timeout: 1000 });
  await checkobox3.check({ force: true, timeout: 1000 });

  await checkobox1.uncheck({ force: true, timeout: 1000 });
  await checkobox2.uncheck({ force: true, timeout: 1000 });
  await checkobox3.uncheck({ force: true, timeout: 1000 });

  await checkobox1.check({ force: true, timeout: 1000 });
  await checkobox2.check({ force: true, timeout: 1000 });
  await checkobox3.check({ force: true, timeout: 1000 });

  const allCheckBoxes: Locator = page.getByRole("checkbox");
  for (let box of await allCheckBoxes.all()) {
    await box.uncheck({ force: true, timeout: 1000 });
    expect(await box.isChecked()).toBeFalsy();
    await box.check({ force: true, timeout: 1000 });
    expect(await box.isChecked()).toBeTruthy();
  }
});

test("dropdowns and lists", async ({ page }) => {
  const themeButton = page.locator("ngx-header nb-select");
  await themeButton.click();
  await page.locator("nb-option-list nb-option", { hasText: "Light" }).click();
  //to take ordered list LI
  //=> page.getByRole('listItem');
  //to take Unordered list Ul
  //=> page.getByRole('list');
  const themeList = page.locator("nb-option-list nb-option");
  await themeButton.click();
  await expect(themeList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  for (let color in colors) {
    await themeList.filter({ hasText: color }).click();

    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", colors[color]);

    if (color !== "Corporate") {
      await themeButton.click();
    }
  }
});
