import { test, expect } from '@playwright/test';

test('El portal principal debería cargar correctamente', async ({ page }) => {
  await page.goto('/');
  // WISP Manager basic title or redirection logic assumption test
  await expect(page).toHaveURL(/.*dashboard|.*login/i);
});
