import { test, expect, Page, chromium } from '@playwright/test'

function captureErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

test('desktop page renders its scenes and section navigation without errors', async ({ page }) => {
  const errors = captureErrors(page)
  await page.goto('/')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toHaveText('Reality,Redesigned.')
  await expect(heading).toHaveCSS('opacity', '1')
  const box = await heading.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  await expect(page.locator('#hero canvas')).toHaveCount(1)
  await page.screenshot({ path: 'test-results/desktop-top.png' })

  await page.getByRole('link', { name: 'Start building with AETHER' }).click()
  await expect(page).toHaveURL(/#experience$/)
  await page.getByRole('button', { name: 'View Shared Presence' }).click()
  await expect(page.getByRole('heading', { name: 'Shared Presence' })).toBeVisible()
  for (const id of ['showcase', 'features', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#${id} h2`)).toHaveCSS('opacity', '1')
  }
  for (const card of await page.locator('#showcase .group').all()) {
    await card.scrollIntoViewIfNeeded()
    await expect(card).toHaveCSS('opacity', '1')
  }
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(page.locator('footer').getByRole('link', { name: 'AETHER Home' }).locator('..')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true })
  expect(errors).toEqual([])
})

test('mobile layout fits and the menu closes using its button, Escape and resize', async ({ page }) => {
  const errors = captureErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toHaveCSS('opacity', '1')
  const box = await heading.boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await page.screenshot({ path: 'test-results/mobile-top.png' })

  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.locator('#mobile-menu')).toBeVisible()
  await page.getByRole('button', { name: 'Close menu' }).click()
  await expect(page.locator('#mobile-menu')).not.toBeVisible()

  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-menu')).not.toBeVisible()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Features', exact: true }).click()
  await expect(page).toHaveURL(/#features$/)
  await expect(page.locator('#mobile-menu')).not.toBeVisible()

  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.setViewportSize({ width: 1280, height: 800 })
  await expect(page.locator('#mobile-menu')).not.toBeVisible()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await page.setViewportSize({ width: 390, height: 844 })
  for (const id of ['hero', 'showcase', 'features', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true })
  expect(errors).toEqual([])
})

test('manifest references an existing icon', async ({ request }) => {
  const response = await request.get('/site.webmanifest')
  expect(response.ok()).toBe(true)
  const manifest = await response.json()
  for (const icon of manifest.icons) {
    const asset = await request.get(icon.src)
    expect(asset.ok()).toBe(true)
    expect(asset.headers()['content-type']).toContain(icon.type)
  }
})

test('the page remains usable without WebGL', async () => {
  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
    args: ['--disable-webgl'],
  })
  try {
    const page = await browser.newPage()
    const errors = captureErrors(page)
    await page.goto('http://127.0.0.1:3000')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1')
    await page.getByRole('link', { name: 'Start building with AETHER' }).click()
    await expect(page).toHaveURL(/#experience$/)
    await expect(page.locator('canvas')).toHaveCount(0)
    expect(errors).toEqual([])
  } finally {
    await browser.close()
  }
})
