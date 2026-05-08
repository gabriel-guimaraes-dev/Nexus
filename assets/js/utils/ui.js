// toast notifications
export function showToast(message, type = 'info') {
    const container = document.querySelector('#toast-container');

    if(!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// open modal
export function openModal(modal) {
    if(!modal) return;
    modal.classList.remove('hidden');
}

// close modal
export function closeModal(modal, input = null) {
    if(!modal) return;

    modal.classList.add('hidden');

    if(input) {
        input.value = '';
    }
}

// close clicking outside
export function setupModalOverlay(modal, input = null) {
    if(!modal) return;

    window.addEventListener('click', (e) =>{
        if(e.target === modal) {
            closeModal(modal, input);
        }
    });
}

//close with Esc
export function setupEscClose(modal, input = null) {
    if(!modal) return;

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            closeModal(modal, input);
        }
    });
}
