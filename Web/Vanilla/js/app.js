
let columns;
let dragCount = 0;
let dragSourceColumn = null;

/* stores the selected add item container, as well as its parent 
   so it can be put back after being removed */
let selectedAddItemContainer = {elem: null, parent: null};

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
    initializeAddCardButtonEvents();
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
    addItemIcon.classList.add('lighten-icon', 'fas', 'fa-plus', 'pointer-events-none');
    addItemContainer.appendChild(addItemIcon);

    let addItemLabel = document.createElement('p');
    addItemLabel.classList.add('font-sans', 'text-gray-500', 'pointer-events-none');
    addItemLabel.innerHTML = 'Add an item';
    addItemContainer.appendChild(addItemLabel);

    return addItemContainer;
}

function createListItem(itemText) {
    let itemContainer = document.createElement('div');
    itemContainer.className = 'to-do-item-container';

    let itemLabel = document.createElement('p');
    itemLabel.className = 'to-do-label';
    itemLabel.innerHTML = itemText; 

    let itemEditButton = document.createElement('i');
    itemEditButton.classList.add('fa', 'fa-pen', 'to-do-item-edit-button', 'group-hover:opacity-30');
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

function initializeAddCardButtonEvents() {
    let containers = document.getElementsByClassName('add-item-container');

    for(let c of containers) {
        c.addEventListener('click', openAddCardDialog, false);
    }

    document.body.addEventListener('click', cancelAddCardDialog, false);
}

function openAddCardDialog(e) {
    // older browsers don't support 'pointer-events: none;' this is a fallback 
    if(e.target !== this)
        return;

    // cancel any existing open dialogs before making the new one
    cancelAddCardDialog();

    selectedAddItemContainer.elem = e.target;
    selectedAddItemContainer.parent = e.target.parentNode;

    let dialog = createAddCardDialog();

    selectedAddItemContainer.parent.removeChild(selectedAddItemContainer.elem);

    selectedAddItemContainer.parent.appendChild(dialog);

    dialog.firstChild.focus();
}

function createAddCardDialog() {
    let addCardDialogContainer = document.createElement('div');
    addCardDialogContainer.className = 'add-card-dialog';
    
    let addCardTextBox = document.createElement('textarea');
    addCardTextBox.className = 'add-card-textbox';
    addCardTextBox.setAttribute('placeholder', 'Enter text for this item...');
    addCardDialogContainer.appendChild(addCardTextBox);

    addCardTextBox.addEventListener('change', function() {
        resizeTextBox(this);
    }, false);
    addCardTextBox.addEventListener('cut', function() {
        resizeTextBoxDelay(this);
    }, false);
    addCardTextBox.addEventListener('paste', function() {
        resizeTextBoxDelay(this);
    }, false);
    addCardTextBox.addEventListener('drop', function() {
        resizeTextBoxDelay(this);
    }, false);
    addCardTextBox.addEventListener('keydown', function() {
        resizeTextBoxDelay(this);
    }, false);

    let addCardButtonContainer = document.createElement('div');
    addCardButtonContainer.className = 'add-card-button-container';
    addCardDialogContainer.appendChild(addCardButtonContainer);

    let addCardConfirmButton = document.createElement('div');
    addCardConfirmButton.innerHTML = 'Confirm';
    addCardConfirmButton.classList.add('add-card-button', 'bg-green-500');
    addCardButtonContainer.appendChild(addCardConfirmButton);

    let addCardCancelButton = document.createElement('div');
    addCardCancelButton.innerHTML = 'Cancel';
    addCardCancelButton.classList.add('add-card-button', 'bg-red-500', 'js-cancel-add-card');
    addCardButtonContainer.appendChild(addCardCancelButton);

    addCardCancelButton.addEventListener('click', cancelAddCardDialog, false);

    return addCardDialogContainer;
}

function resizeTextBox(elem) {
    if(elem) {
        elem.style.height = 'auto';
        elem.style.height = elem.scrollHeight + 'px';
    }
}

function resizeTextBoxDelay(elem) {
    setTimeout(function() {
        resizeTextBox(elem);
    }, 0);
}

function cancelAddCardDialog(e) {
    if(selectedAddItemContainer.elem && selectedAddItemContainer.parent) {
        let dialog = document.getElementsByClassName('add-card-dialog')[0];

        // Sort-of modeled after how Trello does it. Clicking anywhere while the dialog is open, except certain places, cancels the dialog
        if((dialog.contains(e.target) && !e.target.classList.contains('js-cancel-add-card')) || 
            selectedAddItemContainer.elem.contains(e.target))
            return;

        selectedAddItemContainer.parent.removeChild(selectedAddItemContainer.parent.lastChild);
        selectedAddItemContainer.parent.appendChild(selectedAddItemContainer.elem);

        selectedAddItemContainer.elem = null;
        selectedAddItemContainer.parent = null;
    }
}