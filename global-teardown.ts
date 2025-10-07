import { FullConfig } from '@playwright/test';
import { sauceVisualTeardown } from "@saucelabs/visual-playwright";

export default async function globalTeardown(config: FullConfig) {
    // If you already have a teardown, append this line somewhere in your teardown block.
    await sauceVisualTeardown();
}