const instruments = document.querySelectorAll('.instrument');
const shadows = document.querySelectorAll('.shadow');
let draggedInstrument = null;
let originalPosition = {};

// Store original positions
instruments.forEach(inst => {
    inst.addEventListener('dragstart', (e) => {
        draggedInstrument = inst;
        inst.classList.add('dragging');
        originalPosition[inst.id] = {
            parent: inst.parentNode,
            next: inst.nextSibling
        };
        setTimeout(() => inst.style.visibility = 'hidden', 0);
    });

    inst.addEventListener('dragend', (e) => {
        inst.classList.remove('dragging');
        inst.style.visibility = 'visible';
    });
});

shadows.forEach(shadow => {
    shadow.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    shadow.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedInstrument) return;
        const instrumentNum = draggedInstrument.id.replace('instrument', '');
        if (shadow.dataset.instrument === instrumentNum) {
            // Snap the instrument absolutely over the shadow image
            shadow.style.position = 'relative';
            draggedInstrument.style.position = 'absolute';
            draggedInstrument.style.left = '50%';
            draggedInstrument.style.top = '50%';
            draggedInstrument.style.transform = 'translate(-50%, -50%)';
            draggedInstrument.style.pointerEvents = 'none';
            draggedInstrument.draggable = false;
            shadow.appendChild(draggedInstrument);
        } else {
            // Snap back, no feedback
            const { parent, next } = originalPosition[draggedInstrument.id];
            draggedInstrument.style.position = '';
            draggedInstrument.style.left = '';
            draggedInstrument.style.top = '';
            draggedInstrument.style.transform = '';
            draggedInstrument.style.pointerEvents = '';
            if (next) {
                parent.insertBefore(draggedInstrument, next);
            } else {
                parent.appendChild(draggedInstrument);
            }
        }
        draggedInstrument = null;
    });
});