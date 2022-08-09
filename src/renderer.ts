import { ListComponentOptions, Item, InputOptions, TagNames, HTMLElementsInfo, ClassNames } from "./types";

export class Renderer {
    container: HTMLElement;
    options: ListComponentOptions;
    htmlElements: HTMLElementsInfo;
    classNames: ClassNames;

    constructor(container: HTMLElement, options: ListComponentOptions, htmlElements: HTMLElementsInfo) {
        this.container = container;
        this.options = options;
        this.htmlElements = htmlElements;
        this.classNames = options.classNames;
    }

    render(list: Item[]) {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();

        const topSection = this.renderTopSection();
        const mainSection = this.renderMainSection(list);

        const wrapper = this.createContainer(this.classNames.wrapper, [topSection, mainSection]);

        fragment.appendChild(wrapper);

        this.container.appendChild(fragment);
    }

    private renderMainSection(list: Item[]) {
        const listNode = this.renderList(list);
        const selectionSection = this.renderSelectionSection(list);

        return this.createContainer(this.classNames.mainSection, [listNode, selectionSection]);
    }

    private renderSelectionSection(list: Item[]) {
        const selectedList = this.createDOMNode("ul", "list-group");
        
        for(const item of list) {
            if(item.checked) {
                const selected = this.createDOMNode("li", "list-group-item", item.content);

                selectedList.appendChild(selected);
            }
        }

        return this.createContainer(this.classNames.selectionSection, [selectedList]);
    }

    private renderTopSection() {
        return this.createContainer(this.classNames.topSection, [this.renderInputs()]);
    }

    private renderInputs() {
        const addItemInput = this.renderInput(this.options.inputs.addItem);
        const filterItemInput = this.renderInput(this.options.inputs.filterItems);

        return this.createContainer(this.classNames.inputsSection, [addItemInput, filterItemInput]);
    }

    private renderInput(inputOptions: InputOptions) {
        const { classNames } = this;

        // Render input
        const input = <HTMLInputElement>this.createDOMNode("input", classNames.input);
        input.setAttribute("name", inputOptions.name);
        input.setAttribute("placeholder", inputOptions.placeholder);

        const inputContainer = this.createContainer(classNames.inputContainer, [input]);

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
        const listNode = this.createDOMNode("ul", this.classNames.list);

        for(const item of list) {
            const itemNode = this.renderItem(item);
            
            listNode.appendChild(itemNode);
        }

        return this.createContainer(this.classNames.listSection, [listNode]);
    }

    private renderItem(item: Item) {
        const itemNode = this.createDOMNode("li", this.classNames.item);

        const content = this.renderItemContent(item);
        const buttons = this.renderItemButtons(item);

        const container = this.createContainer(this.classNames.itemWrapper, [content, buttons])

        itemNode.appendChild(container);

        item.node = itemNode;

        return itemNode;
    }

    private renderItemContent(item: Item) {
        const checkbox = <HTMLInputElement>this.createCheckbox();
        const content = this.createDOMNode("span", this.classNames.itemContent, item.content);

        item.checkboxNode = checkbox;
        checkbox.checked = !!item.checked;

        return this.createContainer(this.classNames.itemContentContainer, [checkbox, content]);
    }

    private renderItemButtons(item: Item) {
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
        const checkbox = this.createDOMNode("input", this.classNames.itemCheckbox);
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