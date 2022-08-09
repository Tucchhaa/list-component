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

        this.render(this.list);
    }

    private render(list: Item[]) {
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
            this.list.push({
                id: ListComponent.generateId(),
                content: addItemInput.value
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
            item.deleteBtnNode!.addEventListener("click", () => {
                const index = this.list.indexOf(item);
                this.list.splice(index, 1);
                
                item.node!.remove();
            });
        }
    }
}
