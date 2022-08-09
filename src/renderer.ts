import { ListComponentOptions, Item, InputOptions, TagNames, HTMLElementsInfo } from "./types";

export class Renderer {
    container: HTMLElement;
    options: ListComponentOptions;
    htmlElements: HTMLElementsInfo;

    constructor(container: HTMLElement, options: ListComponentOptions, htmlElements: HTMLElementsInfo) {
        this.container = container;
        this.options = options;
        this.htmlElements = htmlElements;
    }

    render(list: Item[]) {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();

        const mainSection = this.renderMainSection(list);
        const selectionSection = this.renderSelectionSection(list);

        const wrapper = this.createContainer("row", [mainSection, selectionSection]);

        fragment.appendChild(wrapper);

        this.container.appendChild(fragment);
    }

    private renderMainSection(list: Item[]) {
        const inputs = this.renderInputs();
        const listNode = this.renderList(list);

        return this.createContainer("col", [inputs, listNode]);
    }

    private renderSelectionSection(list: Item[]) {
        return this.createContainer("col", []);
    }

    private renderInputs() {
        const addItemInput = this.renderInput(this.options.inputs.addItem);
        const filterItemInput = this.renderInput(this.options.inputs.filterItems);

        return this.createContainer("", [addItemInput, filterItemInput]);
    }

    private renderInput(inputOptions: InputOptions) {
        const { classNames } = this.options;

        // Render input
        const input = <HTMLInputElement>this.createDOMNode("input", classNames.input);
        input.setAttribute("name", inputOptions.name);
        input.setAttribute("placeholder", inputOptions.placeholder);

        const inputContainer = this.createContainer(classNames.submitButtonContainer, [input]);

        // Render button
        const button = this.createDOMNode("button", classNames.submitButton, inputOptions.buttonContent);

        const buttonContainer = this.createContainer(classNames.submitButtonContainer, [button]);
        
        // Keep old value
        let oldValue = "";

        if(this.htmlElements[inputOptions.inputName])
            oldValue = this.htmlElements[inputOptions.inputName]!.input.value;

        input.value = oldValue;

        // Store html elements
        this.htmlElements[inputOptions.inputName] = { input, button };

        return this.createContainer(classNames.inputWrapper, [inputContainer, buttonContainer]);
    }

    private renderList(list: Item[]) {
        const listNode = this.createDOMNode("ul", this.options.classNames.list);

        for(const item of list) {
            const itemNode = this.renderItem(item);
            
            listNode.appendChild(itemNode);
        }

        return listNode;
    }

    private renderItem(item: Item) {
        const itemNode = this.createDOMNode("li", this.options.classNames.item);

        const content = this.renderContent(item);
        const buttons = this.renderButtons(item);

        const container = this.createContainer(this.options.classNames.itemWrapper, [content, buttons])

        itemNode.appendChild(container);

        item.node = itemNode;

        return itemNode;
    }

    private renderContent(item: Item) {
        const checkbox = this.createCheckbox();
        const content = this.createDOMNode("span", this.options.classNames.itemContent, item.content);

        return this.createContainer(this.options.classNames.itemContentContainer, [checkbox, content]);
    }

    private renderButtons(item: Item) {
        const { classNames } = this.options;
        
        const editBtn = this.createDOMNode("button", classNames.editBtn, this.options.editBtnContent);
        const deleteBtn  = this.createDOMNode("button", classNames.deleteBtn, this.options.deleteBtnContent);

        item.deleteBtnNode = deleteBtn;
        item.editBtnNode = editBtn;

        const container = this.createContainer(classNames.buttonsContainer, [editBtn, deleteBtn]);

        container.setAttribute("role", "group");
        container.setAttribute("aria-label", "delete and edit buttons");

        return container;
    }

    // ===

    private createCheckbox() {
        const checkbox = this.createDOMNode("input", this.options.classNames.itemCheckbox);
        checkbox.setAttribute("type", "checkbox");

        return checkbox;
    }

    private createDOMNode(tagName: TagNames, className = "", innerText = "") {
        const node = document.createElement(tagName);
        node.className = className;
        node.innerText = innerText;

        return node;
    }

    private createContainer(className: string, children: HTMLElement[]) {
        const container = this.createDOMNode("div", className);

        for(const child of children)
            container.appendChild(child);

        return container;
    }
}