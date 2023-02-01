import { test, expect } from '@playwright/test';

test('Home', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Aaron Krauss/);
  await expect(page.locator('h1')).toContainText(/Aaron Krauss/);
});

test('About', async ({ page }) => {
  await page.goto('/about');

  await expect(page).toHaveTitle(/About/);
  await expect(page.locator('h1')).toContainText(/About/);
});

test('Content', async ({ page }) => {
  await page.goto('/content');

  await expect(page).toHaveTitle(/Content/);
  await expect(page.locator('h1')).toContainText(/Content/);
});

test('Projects', async ({ page }) => {
  await page.goto('/projects');

  await expect(page).toHaveTitle(/Projects/);

  // Ensure that there are figures for the image
  const figures = page.locator('figure');
  await expect(figures).not.toHaveCount(0);
});
