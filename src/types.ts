export type InputOptions = {
    inputName: "addItem" | "filterItems",
    name: string,
    placeholder: string,
    buttonContent: string
}

export type ListComponentOptions = {
    classNames: {
        list: string;

        item: string;
        itemWrapper: string,
        itemCheckbox: string,
        itemContent: string,
        itemContentContainer: string,

        buttonsContainer: string,
        deleteBtn: string,
        editBtn: string,

        inputWrapper: string,
        inputContainer: string,
        input: string,
        submitButtonContainer: string,
        submitButton: string
    },

    inputs: {
        addItem: InputOptions,
        filterItems: InputOptions
    },

    deleteBtnContent: string,
    editBtnContent: string
}

export type Item = {
    id: number;
    content: string;
    node?: HTMLElement;
    deleteBtnNode?: HTMLElement;
    editBtnNode?: HTMLElement;
}

export type InputInfo = {
    input: HTMLInputElement;
    button: HTMLElement;
}

export type HTMLElementsInfo = {
    addItem?: InputInfo,
    filterItems?: InputInfo
};

export type TagNames = "ul" | "div" | "li" | "input" | "button" | "span";