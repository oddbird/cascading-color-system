import { Component, h, State, Prop } from "@stencil/core";

@Component({
  tag: "oddcolors-system",
  styleUrl: "./../../../../demo/css/styles.css",
  shadow: true,
})
export class OddcolorsSystem {
  root: Element = document.querySelector('[data-ccs="root"]');

  @State() mode: Number | null;
  @State() theme: string;

  changeMode(mode?: Number) {
    if (mode) {
      this.mode = mode;
      console.log(mode);
    } else this.mode = null;
    console.log(this.mode);
  }
  handleThemeSelect(event) {
    this.theme = event.target.value;
  }
  render() {
    const colorFields = [
      { name: "default" },
      { name: "oddbird" },
      { name: "complement" },
      { name: "adjacent" },
      { name: "triad" },
    ];
    if (!this.root) {
      return (
        <span>
          Add the <code>data-ccs='root'</code> attribute to your html element in
          order to make your Cascading Colors configuration available to an
          entire page
        </span>
      );
    }
    return (
      <menu>
        <div class="color-btns">
          <button data-ccs-input="mode" type="button">
            invert
          </button>
          <button data-ccs-input="unset" type="button">
            reset
          </button>
        </div>

        <div class="radio-group">
          <div class="radio-option" data-ccs-colors="light">
            <input
              type="radio"
              name="drone"
              data-ccs-input="light-mode"
              id="light-mode"
              onClick={() => this.changeMode(1)}
              checked={this.mode === 1}
            />
            <label htmlFor="light-mode" class="radio-btn">
              light
            </label>
          </div>
          <div class="radio-option" data-ccs-colors="dark">
            <input
              type="radio"
              name="drone"
              data-ccs-input="dark-mode"
              id="dark-mode"
              onClick={() => this.changeMode(-1)}
              checked={this.mode === -1}
            />
            <label htmlFor="dark-mode" class="radio-btn">
              dark
            </label>
          </div>
          <div class="radio-option" data-ccs-colors>
            <input
              type="radio"
              name="drone"
              data-ccs-input="auto-mode"
              id="auto-mode"
              onClick={() => this.changeMode()}
              checked={!this.mode}
            />
            <label htmlFor="auto-mode" class="radio-btn">
              auto
            </label>
          </div>
        </div>

        <div class="color-fields">
          <label htmlFor="theme" data-ccs-field="theme unset-theme">
            <span data-label>theme:</span>
            <select
              name="theme"
              id="theme"
              data-ccs-input="theme"
              onInput={(event) => this.handleThemeSelect(event)}>
              {colorFields.map(({ name }) => (
                <option value={name} selected={this.theme === name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label data-ccs-field="hue" htmlFor="hue">
            <span data-label>hue:</span>
            <input
              id="hue"
              type="range"
              min="0"
              max="360"
              value="330"
              data-ccs-input="hue"
            />
          </label>

          <label data-ccs-field="saturation" htmlFor="saturation">
            <span data-label>saturation:</span>
            <input
              id="saturation"
              type="range"
              min="0"
              max="100"
              value="50"
              data-ccs-input="saturation"
            />
          </label>

          <label data-ccs-field="lightness" htmlFor="lightness">
            <span data-label>lightness:</span>
            <input
              id="lightness"
              type="range"
              min="25"
              max="75"
              value="50"
              data-ccs-input="lightness"
            />
          </label>

          <label data-ccs-field="contrast" htmlFor="contrast">
            <span data-label>contrast:</span>
            <input
              id="contrast"
              type="range"
              min="15"
              max="150"
              value="45"
              data-ccs-input="contrast"
            />
          </label>
        </div>
      </menu>
    );
  }
}
