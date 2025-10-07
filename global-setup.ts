import { FullConfig } from '@playwright/test';
import { sauceVisualSetup } from "@saucelabs/visual-playwright";

export default async function globalSetup(config: FullConfig) {
    // If you already have a setup, append this line somewhere in your setup block.
    await sauceVisualSetup({
        project: 'test project',
        branch: 'test branch'
    });
}