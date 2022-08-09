const defaultOptions = {
    classNames: {
        list: "list-group",
        item: "list-group-item row",

        wrapper: "row",

        checkbox: "checkbox",
        content: "content",
        contentContainer: "text-left col",

        buttonsContainer: "btn-group col-auto",
        deleteBtn: "btn btn-danger",
        editBtn: "btn btn-warning",

        inputWrapper: "row margin30px",
        inputContainer: "col",
        input: "form-control",
        submitButtonContainer: "col col-auto",
        submitButton: "btn btn-primary"
    },

    inputs: {
        addItem: {
            inputName: "addItem",
            name: "item-content",
            placeholder: "Add item",
            buttonContent: "Add"
        },
        filterItems: {
            inputName: "filterItems",
            name: "item-content",
            placeholder: "Filter items",
            buttonContent: "Filter"
        }
    },

    deleteBtnContent: "delete",
    editBtnContent: "edit"
};

class Renderer {
    constructor(container, options, htmlElements) {
        this.container = container;
        this.options = options;
        this.htmlElements = htmlElements;
    }

    render(list) {
        this.container.innerHTML = "";

        const fragment = document.createDocumentFragment();

        const inputs = this._renderInputs();
        const listNode = this._renderList(list);

        fragment.appendChild(inputs);
        fragment.appendChild(listNode);

        this.container.appendChild(fragment);
    }

    _renderInputs() {
        const wrapper = this._createDOMNode("div");

        const addItemInput = this._renderInput(this.options.inputs.addItem);
        const filterItemInput = this._renderInput(this.options.inputs.filterItems);

        wrapper.appendChild(addItemInput);
        wrapper.appendChild(filterItemInput);

        return wrapper;
    }

    _renderInput(inputOptions) {
        const { classNames } = this.options;

        const wrapper = this._createDOMNode("div", classNames.inputWrapper);

        // Render input
        const inputContainer = this._createDOMNode("div", classNames.inputContainer);
        const input = this._createDOMNode("input", classNames.input);
        input.setAttribute("name", inputOptions.name);
        input.setAttribute("placeholder", inputOptions.placeholder);

        inputContainer.appendChild(input);

        // Render button
        const buttonContainer = this._createDOMNode("div", classNames.submitButtonContainer);
        const button = this._createDOMNode("button", classNames.submitButton, inputOptions.buttonContent);

        buttonContainer.appendChild(button);

        // Keep old value
        let oldValue = "";

        if(this.htmlElements[inputOptions.inputName])
            oldValue = this.htmlElements[inputOptions.inputName].input.value;

        input.value = oldValue;

        // Store html elements
        this.htmlElements[inputOptions.inputName] = { input, button };
        

        wrapper.appendChild(inputContainer);
        wrapper.appendChild(buttonContainer);

        return wrapper;
    }

    _renderList(list) {
        const listNode = this._createDOMNode("ul", this.options.classNames.list);

        for(const item of list) {
            const itemNode = this._renderItem(item);
            
            listNode.appendChild(itemNode);
        }

        return listNode;
    }

    _renderItem(item) {
        const itemNode = this._createDOMNode("li", this.options.classNames.item);
        const wrapper = this._createDOMNode("div", this.options.classNames.wrapper);

        const content = this._renderContent(item);
        const buttons = this._renderButtons(item);

        wrapper.appendChild(content);
        wrapper.appendChild(buttons);

        itemNode.appendChild(wrapper);

        item.node = itemNode;

        return itemNode;
    }

    _renderContent(item) {
        const container = this._createDOMNode("div", this.options.classNames.contentContainer);

        const checkbox = this._createCheckbox();
        const content = this._createDOMNode("span", this.options.classNames.content, item.content);
        
        container.appendChild(checkbox);
        container.appendChild(content);

        return container;
    }

    _renderButtons(item) {
        const container = this._createDOMNode("div", this.options.classNames.buttonsContainer);
        container.setAttribute("role", "group");
        container.setAttribute("aria-label", "delete and edit buttons");
        
        const editBtn = this._createDOMNode("button", this.options.classNames.editBtn, this.options.editBtnContent);
        const deleteBtn  = this._createDOMNode("button", this.options.classNames.deleteBtn, this.options.deleteBtnContent);
        
        container.appendChild(editBtn);        
        container.appendChild(deleteBtn);

        item.deleteBtnNode = deleteBtn;
        item.editBtnNode = editBtn;

        return container;
    }

    _createCheckbox() {
        const checkbox = this._createDOMNode("input", this.options.classNames.checkbox);
        checkbox.setAttribute("type", "checkbox");

        return checkbox;
    }

    _createDOMNode(tagName, className = "", innerText = "") {
        const node = document.createElement(tagName);
        node.className = className;
        node.innerText = innerText;

        return node;
    }
}

class ListComponent {
    static _id = 0;

    static generateId() {
        return ListComponent._id++;
    }

    constructor(list, container, options) {
        this.options = { ...defaultOptions, ...options };

        this.list = list.map(item => ({ id: ListComponent.generateId(), content: item }));

        this.htmlElements = {};

        this.renderer = new Renderer(container, this.options, this.htmlElements);

        this._render(this.list);
    }
    
    _render(list) {
        this.renderer.render(list);
        this._subscribe();
    }

    _subscribe() {
        this._subscribeInputs();
        this._subscribeItems();
    }

    _subscribeInputs() {
        const { inputs } = this.options;
        const { htmlElements } = this;

        const addItemInput = htmlElements[inputs.addItem.inputName].input;
        const addItemBtn = htmlElements[inputs.addItem.inputName].button; 

        const filterItemsInput = htmlElements[inputs.filterItems.inputName].input;
        const filterItemsBtn = htmlElements[inputs.filterItems.inputName].button;

        addItemBtn.addEventListener("click", () => {
            this.list.push({
                id: ListComponent.generateId(),
                content: addItemInput.value
            });
            
            addItemInput.value = "";

            this._render(this.list);
        });

        filterItemsBtn.addEventListener("click", () => {
            const filter = filterItemsInput.value;
            
            const filteredList = this.list.filter(item => item.content.toLowerCase().indexOf(filter) != -1);
            
            this._render(filteredList);
        });
    }

    _subscribeItems() {
        for(const item of this.list) {
            item.deleteBtnNode.addEventListener("click", () => {
                const index = this.list.indexOf(item);
                this.list.splice(index, 1);
                
                item.node.remove();
            });
        }
    }
}