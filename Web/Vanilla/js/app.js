
let columns;
let dragCount = 0;

window.onload = function() {
    columns = document.querySelectorAll('.list-container');

    initializeDraggables();
}

function initializeDraggables() {
    columns.forEach((item) => {
        item.addEventListener('dragstart', columnDragStart, false);
        item.addEventListener('dragend', columnDragEnd, false);
        item.addEventListener('dragenter', columnDragEnter, false);
        item.addEventListener('dragleave', columnDragLeave, false);
        item.addEventListener('dragover', columnDragOver, false);
    });
}

function columnDragStart(e) {
    this.style.opacity = '0.5';
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
}

function columnDragLeave(e) {
    --dragCount;

    if(dragCount == 0) 
        this.style.border = 'none';
}