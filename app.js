document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const items = document.querySelectorAll('.item');
    const resetBtn = document.getElementById('reset');
    const saveBtn = document.getElementById('save');
    const addToCartBtn = document.getElementById('addToCart');
    
    let currentOutfit = [];
    let draggedItem = null;
    let initialX;
    let initialY;
    let currentX;
    let currentY;
    let xOffset = 0;
    let yOffset = 0;

    // Drag and Drop for new items
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        if (!draggedItem) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newItem = createCanvasItem(draggedItem, x, y);
        canvas.appendChild(newItem);
        currentOutfit.push(newItem);

        draggedItem = null;
    }

    function createCanvasItem(sourceItem, x, y) {
        const item = document.createElement('div');
        item.className = 'canvas-item';
        item.innerHTML = sourceItem.innerHTML;
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        
        // Add drag functionality to canvas items
        item.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        return item;
    }

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === this) {
            draggedItem = this;
        }
    }

    function drag(e) {
        if (draggedItem) {
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, draggedItem);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        draggedItem = null;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Reset canvas
    resetBtn.addEventListener('click', () => {
        currentOutfit.forEach(item => item.remove());
        currentOutfit = [];
    });

    // Save outfit
    saveBtn.addEventListener('click', () => {
        const outfitData = currentOutfit.map(item => ({
            type: item.querySelector('img').alt,
            position: {
                x: item.style.left,
                y: item.style.top
            }
        }));
        
        localStorage.setItem('savedOutfit', JSON.stringify(outfitData));
        alert('Outfit saved successfully!');
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        if (currentOutfit.length === 0) {
            alert('Please create an outfit first!');
            return;
        }

        const cartItems = currentOutfit.map(item => item.querySelector('img').alt);
        alert(`Added to cart: ${cartItems.join(', ')}`);
        
    });
}); 