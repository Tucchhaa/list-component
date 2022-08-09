export type InputOptions = {
    inputName: "addItem" | "filterItems",
    name: string,
    placeholder: string,
    buttonContent: string
}

export type ClassNames = {
    list: string;
    
    wrapper: string;
    topSection: string;
    inputsSection: "col-8",
    mainSection: string;
    listSection: string;
    selectionSection: string;

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
}

export type ListComponentOptions = {
    classNames: ClassNames,

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
    checked?: boolean;
    node?: HTMLElement;
    deleteBtnNode?: HTMLElement;
    editBtnNode?: HTMLElement;
    checkboxNode?: HTMLInputElement;
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