import { expect, test } from '@playwright/test';
// Import `sauceVisualCheck` from our visual plugin
import { sauceVisualCheck } from '@saucelabs/visual-playwright';

test('cart test', async ({ page }, testInfo) => {
  await page.goto('https://www.dominos.com/');


  await page.getByLabel('Menu').click();
  await page.getByRole('button', { name: 'Order Now' }).click();
  //await page.getByRole('button', { name: "Carryout, Pick-up your order at a nearby Domino's." }).click();
  await page.getByRole('button', { name: 'Delivery, Get your order'}).click();

  // Locate the main dialog and the scrollable inner container
const dialogContainer = page.locator('[data-testid="dialog-container"]');

// Step 1: Force the dialog to its full content height.
// We are calculating the total content height and setting the main container's height to that value.
const [headerHeight, scrollableHeight] = await page.evaluate(() => {
    // 1. Find the elements inside the dialog
    const header = document.querySelector('[data-testid="dialog-container"] .border-b');
    const scrollable = document.querySelector('[data-testid="dialog-container"] .overflow-y-auto');

    // 2. Measure heights
    const headerH = header ? header.offsetHeight : 0;
    const scrollableH = scrollable ? scrollable.scrollHeight : 0;
    const totalHeight = headerH + scrollableH;

    // 3. Apply the height override to the main dialog container
    const dialog = document.querySelector('[data-testid="dialog-container"]');
    if (dialog) {
        dialog.style.height = `${totalHeight}px`;
        dialog.style.maxHeight = 'unset';
    }
    // Return the calculated height for the viewport resize (Step 2)
    return [headerH, scrollableH];
});

const totalDialogHeight = headerHeight + scrollableHeight;


// Step 2: Resize the viewport to the size of the entire (now expanded) DOM.
const pageScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const viewportSize = page.viewportSize();

// Set the viewport to the maximum height needed.
if (viewportSize) {
    await page.setViewportSize({ width: viewportSize.width, height: pageScrollHeight });
}


// Step 3: Take the final full-page screenshot.
// With the dialog expanded and the viewport resized, this should now work.
await page.screenshot({ path: 'final-full-capture.png', fullPage: true });

  await sauceVisualCheck(page, testInfo, "delivery page", {
    //captureDom: true,
    screenshotOptions: {
      fullPage: true,
    },
    //clipSelector: '[data-testid="dialog-container"]'
    });  


  // await sauceVisualCheck(page, testInfo, "carry out page", {
  //   captureDom: true,
  //   screenshotOptions: {
  //     fullPage: true,
  //   },
  //   clipSelector: '[data-testid="dialog-container"]'
  //   });  
  // await page.getByTestId('input-field-zipCode').fill('78209');
//   await page.getByRole('textbox', { name: 'Zip Code' }).fill('78209')
//   await page.getByText('Find a store').click();
//   // await page.getByTestId('clickable-card').click();
//   // await page.getByRole('button', { name: '3255 Harry Wurzbach Road, San Antonio, TX 78209' }).click();
//   // await page.getByTestId('dialog-container').getByRole('button', { name: '3255 Harry Wurzbach Road, San Antonio, TX 78209' }).click();
//   await page.getByText('3255 Harry Wurzbach Road', { exact: true }).click();
//   await page.getByRole('button', { name: 'Confirm Carryout' })
//   await sauceVisualCheck(page, testInfo, "inventory page", {
//       captureDom: true,
//     });
//   await page.getByTestId('Specialty-img-sm').click();
//   await page.getByTestId('clickable-card').click();
//   await page.getByText('Add To Cart').click();
//   await page.getByLabel('View cart - 1 item').click();
//   await sauceVisualCheck(page, testInfo, "clipped element", {
//       captureDom: true,
//       // screenshotOptions: {
//       //   fullPage: false,
//       // },
//       clipSelector: '[data-testid="dialogue-container"]',
//     });
//   // await sauceVisualCheck(page, testInfo, "clipped element", {
//   //     captureDom: true,
//   //     clipSelector: '[data-testid="cart-container"]',
//   //   });
// // });

// // test('get started link', async ({ page }) => {
// //   await page.goto('https://playwright.dev/');

// //   // Click the get started link.
// //   await page.getByRole('link', { name: 'Get started' }).click();

// //   // Expects page to have a heading with the name of Installation.
// //   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

