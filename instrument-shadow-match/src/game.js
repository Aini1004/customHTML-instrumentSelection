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
        // Set translucent drag image
        const dragImg = inst.cloneNode(true);
        dragImg.style.opacity = '0.5';
        dragImg.style.width = inst.offsetWidth + 'px';
        dragImg.style.height = inst.offsetHeight + 'px';
        dragImg.style.position = 'absolute';
        dragImg.style.top = '-9999px';
        dragImg.style.left = '-9999px';
        document.body.appendChild(dragImg);
        e.dataTransfer.setDragImage(dragImg, dragImg.width / 2, dragImg.height / 2);

        setTimeout(() => {
            inst.style.visibility = 'hidden';
        }, 0);

        // Remove the drag image after a short delay
        setTimeout(() => {
            if (dragImg.parentNode) dragImg.parentNode.removeChild(dragImg);
        }, 100);
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
            // Hide the respective info icon (not remove, to keep DOM structure)
            const wrapper = draggedInstrument.closest('.instrument-wrapper');
            if (wrapper) {
                const infoIcon = wrapper.querySelector('.info-icon');
                if (infoIcon) infoIcon.style.display = 'none';
            }

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

// Tooltip logic
document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('tooltip-modal').style.display = 'flex';
    });
});

document.querySelector('.tooltip-close').addEventListener('click', function() {
    document.getElementById('tooltip-modal').style.display = 'none';
});

document.getElementById('tooltip-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});