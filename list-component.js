class ListComponent {
    static new(list, container) {
        const component = new ListComponent(list);

        component._insertList(container);
    
        return component;
    }

    constructor(list) {
        this.list = list.map((el, index) => ({ id: index, content: el }));
    }

    _insertList(container) {
        const listNode = document.createElement("ul");
        listNode.className = "list-group";

        for(const element of this.list) {
            const elementNode = this._createElementNode(element);

            listNode.appendChild(elementNode);
        }

        container.appendChild(listNode);
    }

    _createElementNode(element) {
        const elementNode = document.createElement("li");
        elementNode.className = "list-group-item";

        // ===

        const contentNode = document.createElement("div");
        contentNode.className = "content";
        contentNode.innerText = element.content;

        // ===

        const deleteNode = document.createElement("button");
        deleteNode.className = "btn btn-primary";
        deleteNode.innerText = "delete"

        deleteNode.addEventListener("click", event => {
            const index = this.list.indexOf(element);
            this.list.splice(index, 1);

            event.target.parentNode.remove();
        });

        // ===

        elementNode.appendChild(contentNode);
        elementNode.appendChild(deleteNode);

        return elementNode;
    }
}