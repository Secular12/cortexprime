/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CortexPrimeItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cortexprime", "sheet", "item"],
      template: this.template,
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/cortexprime/templates/item";
    // Return a single sheet for all item types.
    return `${path}/${this.entity.data.type}.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    // return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.cssClass = "item-sheet";

    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 220;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
    html.find('.editor-content[data-edit]').each((i, div) => this._activateEditor(div));
  }

  activateEditor(name, options={}, initialContent="") {
    const editor = this.editors[name];
    if ( !editor ) throw new Error(`${name} is not a registered editor name!`);
    options = mergeObject(editor.options, options);
    options.height = options.target.offsetHeight;
    TextEditor.create(options, initialContent || editor.initial).then(mce => {
      editor.mce = mce;
      editor.changed = false;
      editor.active = true;
      mce.focus();
      mce.on('change', ev => editor.changed = true);
    });
  }

    /**
   * Activate a TinyMCE editor instance present within the form
   * @param div {HTMLElement}
   * @private
   */
  _activateEditor(div) {
      // Get the editor content div
      const name = div.getAttribute("data-edit");
      const button = div.nextElementSibling;
      const hasButton = button && button.classList.contains("editor-edit");
      const wrap = div.parentElement.parentElement;
      const wc = $(div).parents(".window-content")[0];

      // Determine the preferred editor height
      const heights = [wrap.offsetHeight, wc ? wc.offsetHeight : null];
      if ( div.offsetHeight > 0 ) heights.push(div.offsetHeight);
      let height = Math.min(...heights.filter(h => Number.isFinite(h)));
      
      // Get initial content
      const data = this.object instanceof Entity ? this.object.data : this.object;
      const initialContent = getProperty(data, name);
      const editorOptions = {
        target: div,
        height: height,
        save_onsavecallback: mce => this.saveEditor(name)
      };
      
      // Add record to editors registry
      this.editors[name] = {
        target: name,
        button: button,
        hasButton: hasButton,
        mce: null,
        active: !hasButton,
        changed: false,
        options: editorOptions,
        initial: initialContent
      };

      // If we are using a toggle button, delay activation until it is clicked
      if (hasButton) button.onclick = event => {
        button.style.display = "none";
        this.activateEditor(name, editorOptions, initialContent);
      };
      // Otherwise activate immediately
      else this.activateEditor(name, editorOptions, initialContent);
    }
}
