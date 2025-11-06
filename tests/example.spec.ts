// import { expect, test } from '@playwright/test';
// Import `sauceVisualCheck` from our visual plugin
import { sauceVisualCheck } from '@saucelabs/visual-playwright';
import { test, expect } from '../custom-test';
//import { test, expect } from '../expand-content-resize';
import { expandContentAndResizeViewport } from '../expand-content-resize'

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


// Step 3: Take the final full-page screenshot with Playwright.
// With the dialog expanded and the viewport resized, this should now work.
await page.screenshot({ path: 'final-full-capture.png', fullPage: true });

// Step 4: Take final full-page screenshot with Sauce Visual, clipped to the dialog container
  await sauceVisualCheck( page, testInfo, "delivery page", {
    //captureDom: true,
    screenshotOptions: {
      fullPage: true,
    },
    clipSelector: '[data-testid="dialog-container"]'
    });  



})

test('alternate', async ({ page }, testInfo) => {
  await page.goto('https://www.dominos.com/');


  await page.getByLabel('Menu').click();
  await page.getByRole('button', { name: 'Order Now' }).click();
  //await page.getByRole('button', { name: "Carryout, Pick-up your order at a nearby Domino's." }).click();
  await page.getByRole('button', { name: 'Delivery, Get your order'}).click();

await expandContentAndResizeViewport(page);
  
  await sauceVisualCheck( page, testInfo, "delivery page", {
    //captureDom: true,
    screenshotOptions: {
      fullPage: true,
    },
    clipSelector: '[data-testid="dialog-container"]'
    });  
});

