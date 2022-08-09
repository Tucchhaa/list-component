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

        const inputs = this.renderInputs();
        const listNode = this.renderList(list);

        fragment.appendChild(inputs);
        fragment.appendChild(listNode);

        this.container.appendChild(fragment);
    }

    private renderInputs() {
        const wrapper = this.createDOMNode("div");

        const addItemInput = this.renderInput(this.options.inputs.addItem);
        const filterItemInput = this.renderInput(this.options.inputs.filterItems);

        wrapper.appendChild(addItemInput);
        wrapper.appendChild(filterItemInput);

        return wrapper;
    }

    private renderInput(inputOptions: InputOptions) {
        const { classNames } = this.options;

        const wrapper = this.createDOMNode("div", classNames.inputWrapper);

        // Render input
        const inputContainer = this.createDOMNode("div", classNames.inputContainer);
        const input = <HTMLInputElement>this.createDOMNode("input", classNames.input);
        input.setAttribute("name", inputOptions.name);
        input.setAttribute("placeholder", inputOptions.placeholder);

        inputContainer.appendChild(input);

        // Render button
        const buttonContainer = this.createDOMNode("div", classNames.submitButtonContainer);
        const button = this.createDOMNode("button", classNames.submitButton, inputOptions.buttonContent);

        buttonContainer.appendChild(button);

        // Keep old value
        let oldValue = "";

        if(this.htmlElements[inputOptions.inputName])
            oldValue = this.htmlElements[inputOptions.inputName]!.input.value;

        input.value = oldValue;

        // Store html elements
        this.htmlElements[inputOptions.inputName] = { input, button };
        

        wrapper.appendChild(inputContainer);
        wrapper.appendChild(buttonContainer);

        return wrapper;
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
        const wrapper = this.createDOMNode("div", this.options.classNames.itemWrapper);

        const content = this.renderContent(item);
        const buttons = this.renderButtons(item);

        wrapper.appendChild(content);
        wrapper.appendChild(buttons);

        itemNode.appendChild(wrapper);

        item.node = itemNode;

        return itemNode;
    }

    private renderContent(item: Item) {
        const container = this.createDOMNode("div", this.options.classNames.itemContentContainer);

        const checkbox = this.createCheckbox();
        const content = this.createDOMNode("span", this.options.classNames.itemContent, item.content);
        
        container.appendChild(checkbox);
        container.appendChild(content);

        return container;
    }

    private renderButtons(item: Item) {
        const container = this.createDOMNode("div", this.options.classNames.buttonsContainer);
        container.setAttribute("role", "group");
        container.setAttribute("aria-label", "delete and edit buttons");
        
        const editBtn = this.createDOMNode("button", this.options.classNames.editBtn, this.options.editBtnContent);
        const deleteBtn  = this.createDOMNode("button", this.options.classNames.deleteBtn, this.options.deleteBtnContent);
        
        container.appendChild(editBtn);        
        container.appendChild(deleteBtn);

        item.deleteBtnNode = deleteBtn;
        item.editBtnNode = editBtn;

        return container;
    }

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
}