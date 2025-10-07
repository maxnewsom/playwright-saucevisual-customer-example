import { test as base } from "@playwright/test";
import { sauceVisualFixtures, SauceVisualFixtures } from "@saucelabs/visual-playwright";

export const test = base.extend<SauceVisualFixtures>({
    // Set up the Sauce Visual fixture, and optionally customize the global options which are sent
    // with each sauce visual check to reduce duplication.
    ...sauceVisualFixtures({
        // You can append some of the options available in the 'Check Options' section below. Ex:
         captureDom: true,
        // delay: 200,
    }),
});

export { expect } from "@playwright/test";