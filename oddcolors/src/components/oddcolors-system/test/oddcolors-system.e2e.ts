import { newE2EPage } from '@stencil/core/testing';

describe('oddcolors-system', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<oddcolors-system></oddcolors-system>');

    const element = await page.find('oddcolors-system');
    expect(element).toHaveClass('hydrated');
  });
});
