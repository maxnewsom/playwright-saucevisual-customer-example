/**
 * Searches for common scrollable elements (like modals) and removes their 
 * height constraints, then resizes the viewport to fit the new total height.
 * * NOTE: This is a best-effort approach based on common web patterns. 
 * It may not work for every unique modal implementation.
 * * @param {import('@playwright/test').Page} page The Playwright Page object.
 */
import { test as base } from "@playwright/test";

export async function expandContentAndResizeViewport(page) {
    // 1. Force all potential scrollable containers to their full height.
    await page.evaluate(() => {
        // Common selectors for scrollable containers (e.g., modals, drawers)
        const selectors = [
            '.modal-body', 
            '.overflow-y-auto', 
            '[role="dialog"] .scrollable', 
            '[data-testid$="container"] .overflow-y-scroll' // Broad check for your specific case
        ];
        
        // Find all matching elements and expand them
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Ensure the inner content expands
                element.style.height = 'auto';
                element.style.maxHeight = 'unset';
                element.style.overflowY = 'visible'; // Sometimes necessary
                
                // Set the height explicitly to its content height (scrollHeight)
                if (element.scrollHeight > element.clientHeight) {
                     element.style.height = `${element.scrollHeight}px`;
                }
            });
        });

        // Also, un-constrain the top-level containers that might have fixed max-heights
        const topLevelSelectors = [
            '[data-testid="dialog-container"]', 
            '[role="dialog"]',
            '.modal'
        ];

        topLevelSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.maxHeight = 'unset';
                // Set the container's height to its new content height
                if (element.scrollHeight > element.clientHeight) {
                    element.style.height = `${element.scrollHeight}px`;
                }
            });
        });
    });

    // 2. Resize the viewport to the maximum scroll height of the entire document.
    const viewportSize = page.viewportSize();

    if (viewportSize) {
        const pageScrollHeight = await page.evaluate(() => {
            return Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight
            );
        });

        if (pageScrollHeight > viewportSize.height) {
            await page.setViewportSize({ 
                width: viewportSize.width, 
                height: pageScrollHeight 
            });
            console.log(`Viewport resized to: ${viewportSize.width}x${pageScrollHeight}`);
        }
    }
}