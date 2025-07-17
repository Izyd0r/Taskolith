import { test, expect } from '@playwright/test';

test.describe('LoginForm E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Login' }).click();

    await expect(page).toHaveURL('/login');

    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  });

  test('should allow a user to log in successfully', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('JanKowalski');
    await page.getByPlaceholder('Password').fill('SuperSecret2137@#');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show an error message on failed login', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('wronguser');
    await page.getByPlaceholder('Password').fill('wrongPassword@12');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Authentication failed. Please check credentials.')).toBeVisible();
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Password');
    const toggleButton = page.locator('#eye-icon');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toBeEnabled();
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to the sign-up page when the link is clicked', async ({ page }) => {
    await page.getByRole('link', { name: "Don't have an account? Sign Up" }).click();
    await expect(page).toHaveURL(/.*signup/);
  });
});
