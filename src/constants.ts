import { ListComponentOptions } from "./types";

const listClassName = "list-group";

export const defaultOptions: ListComponentOptions = {
    classNames: {
        list: listClassName,

        wrapper: "",

        topSection: "row",
        inputsSection: "col-8",
        
        mainSection: "row",
        listSection: "col-8",
        selectionSection: "col",

        item: listClassName+"-item row",
        itemWrapper: "row",
        itemCheckbox: "checkbox",
        itemContent: "content",
        itemContentContainer: "text-left col",

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