import { ListComponentOptions, Item, HTMLElementsInfo } from "./types";
import { defaultOptions } from "./constants";
import { Renderer } from "./renderer";
// ================



export class ListComponent {
    static _id = 0;

    static generateId() {
        return ListComponent._id++;
    }

    options: ListComponentOptions;
    list: Item[];
    renderer: Renderer
    htmlElements: HTMLElementsInfo;

    constructor(list: string[], container: HTMLElement, options?: ListComponentOptions) {
        this.options = { ...defaultOptions, ...options };

        this.list = list.map(item => ({ id: ListComponent.generateId(), content: item }));

        this.htmlElements = {};

        this.renderer = new Renderer(container, this.options, this.htmlElements);

        this.render();
    }

    private render(list: Item[] = this.list) {
        this.renderer.render(list);
        this.subscribe();
    }

    private subscribe() {
        this.subscribeInputs();
        this.subscribeItems();
    }

    private subscribeInputs() {
        const { inputs } = this.options;
        const { htmlElements } = this;

        const addItemInput = htmlElements[inputs.addItem.inputName]!.input;
        const addItemBtn = htmlElements[inputs.addItem.inputName]!.button; 

        const filterItemsInput = htmlElements[inputs.filterItems.inputName]!.input;
        const filterItemsBtn = htmlElements[inputs.filterItems.inputName]!.button;

        addItemBtn.addEventListener("click", () => {
            if(addItemInput.value.trim().length === 0)
                return;

            this.list.push({
                id: ListComponent.generateId(),
                content: addItemInput.value.trim()
            });
            
            addItemInput.value = "";

            this.render(this.list);
        });

        filterItemsBtn.addEventListener("click", () => {
            const filter = filterItemsInput.value;
            
            const filteredList = this.list.filter(item => item.content.toLowerCase().indexOf(filter) != -1);
            
            this.render(filteredList);
        });
    }

    private subscribeItems() {
        for(const item of this.list) {
            // delete button
            item.deleteBtnNode?.addEventListener("click", () => {
                const index = this.list.indexOf(item);
                this.list.splice(index, 1);
                
                item.node!.remove();
            });
            
            // edit button
            item.editBtnNode?.addEventListener("click", () => {
                item.editing = true;
            
                this.render();
            });

            // save button
            item.saveBtnNode?.addEventListener("click", () => {
                if(item.inputNode!.value.trim().length === 0) {
                    return;
                }

                item.content = item.inputNode!.value;
                item.editing = false;

                this.render();
            });
            
            // cancel button
            item.cancelBtnNode?.addEventListener("click", () => {
                item.editing = false;

                this.render();
            });

            // check
            item.node!.addEventListener("click", e => {
                const targetTag = (e.target as HTMLElement).tagName;
                
                if(targetTag === "BUTTON" || item.editing === true)
                    return;

                const checked = !(item.checked);
                
                item.checkboxNode!.checked = checked;
                item.checked = checked;

                this.render();
            });
        }
    }
}
