import { newSpecPage } from '@stencil/core/testing';
import { OddcolorsSystem } from '../oddcolors-system';

describe('oddcolors-system', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OddcolorsSystem],
      html: `<oddcolors-system></oddcolors-system>`,
    });
    expect(page.root).toEqualHtml(`
      <oddcolors-system>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </oddcolors-system>
    `);
  });
});
