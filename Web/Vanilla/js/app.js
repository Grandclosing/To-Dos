
let columns;
let dragCount = 0;
let dragSourceColumn = null;

let mockColumnList = [
    {
        title: "To-Do",
        items: [
            "Walk the dog",
            "Do some mindfulness meditation",
            "Learn React.js",
            "Improve society through innovation"
        ]
    },
    {
        title: "Done",
        items: [
            "Be a good person",
            "Win an argument on the internet"
        ]
    },
    {
        title: "Archived",
        items: [
            "Be productive"
        ]
    }
]

window.onload = function() {
    generateColumns();
    initializeDraggables();
}

function generateColumns() {
    let appArea = document.getElementsByClassName('js-app-area')[0];

    for(const column of mockColumnList) {
        let listContainer = createListContainer();

        let listContainerHeader = createListContainerHeader(column.title);
        listContainer.appendChild(listContainerHeader);

        for(const item of column.items) {
            let listItem = createListItem(item);
            listContainer.appendChild(listItem);
        }
        
        let addItemContainer = createAddItemContainer();
        listContainer.appendChild(addItemContainer);

        appArea.appendChild(listContainer);
    }
}

function createListContainer() {
    let listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    listContainer.setAttribute('draggable', true);

    return listContainer; 
}

function createListContainerHeader(title) {
    let listContainerHeader = document.createElement('div');
    listContainerHeader.className = 'list-container-header';

    let listContainerHeaderTitle = createListContainerHeaderTitle(title);
    listContainerHeader.appendChild(listContainerHeaderTitle);

    let ellipsisButton = createEllipsisButton();
    listContainerHeader.appendChild(ellipsisButton);

    return listContainerHeader;
}

function createListContainerHeaderTitle(title) {
    let listContainerHeaderTitle = document.createElement('h1');
    listContainerHeaderTitle.className = 'list-container-header__title';
    listContainerHeaderTitle.innerHTML = title;

    return listContainerHeaderTitle;
}

function createEllipsisButton() {
    let ellipsisButton = document.createElement('i');
    ellipsisButton.classList.add('fas', 'fa-ellipsis-h', 'ellipsis-button');
    return ellipsisButton;
}

function createAddItemContainer() {
    let addItemContainer = document.createElement('div');
    addItemContainer.className = 'add-item-container';

    let addItemIcon = document.createElement('i');
    addItemIcon.classList.add('lighten-icon', 'fas', 'fa-plus');
    addItemContainer.appendChild(addItemIcon);

    let addItemLabel = document.createElement('p');
    addItemLabel.classList.add('font-sans', 'text-gray-500');
    addItemLabel.innerHTML = 'Add an item';
    addItemContainer.appendChild(addItemLabel);

    return addItemContainer;
}

function createListItem(itemText) {
    let itemContainer = document.createElement('div');
    itemContainer.classList.add('bg-white', 'shadow-sm', 'px-3', 'py-1', 'my-2', 'group', 'flex', 'flex-row-reverse', 'justify-between', 'gap-x-3', 'hover:bg-gray-100');

    let itemLabel = document.createElement('p');
    itemLabel.classList.add('font-sans', 'text-gray-600', 'text-sm');
    itemLabel.innerHTML = itemText; 

    let itemEditButton = document.createElement('i');
    itemEditButton.classList.add('fa', 'fa-pen', 'opacity-0', 'cursor-pointer', 'group-hover:opacity-30', 'hover:bg-gray-300', 'px-2', 'py-2');
    itemContainer.appendChild(itemEditButton);

    itemContainer.appendChild(itemLabel);
    return itemContainer;
}

function initializeDraggables() {
    columns = document.querySelectorAll('.list-container');

    columns.forEach((item) => {
        item.addEventListener('dragstart', columnDragStart, false);
        item.addEventListener('dragend', columnDragEnd, false);
        item.addEventListener('dragenter', columnDragEnter, false);
        item.addEventListener('dragleave', columnDragLeave, false);
        item.addEventListener('dragover', columnDragOver, false);
        item.addEventListener('drop', columnDrop, false);
    });
}

function columnDragStart(e) {
    this.style.opacity = '0.5';

    dragSourceColumn = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function columnDragEnd(e) {
    this.style.opacity = '1';

    columns.forEach((item) => {
        item.style.border = 'none';
    });
}

function columnDragOver(e) {
    if(e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

function columnDragEnter(e) {
    this.style.border = '2px dashed gray';
    ++dragCount;

    console.log(`Incremented drag count; current: ${dragCount}`);
}

function columnDragLeave(e) {
    --dragCount;

    console.log(`Decremented drag count; current: ${dragCount}`);

    if(dragCount == 0) 
        this.style.border = 'none';
}

function columnDrop(e) {
    e.stopPropagation();

    if(dragSourceColumn !== this) {
        dragSourceColumn.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}