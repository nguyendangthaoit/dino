
export const showLoad = () => {
    let loader = document.querySelector('#progress_loading');
    if (loader) {
        loader.style.display = 'block';
    }
};

export const hideLoad = () => {
    let loader = document.querySelector('#progress_loading');
    if (loader) {
        loader.style.display = 'none';
    }
};