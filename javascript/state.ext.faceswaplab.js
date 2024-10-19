window.state = window.state || {};
window.state.extensions = window.state.extensions || {};
state = window.state;

state.extensions['faceswaplab'] = (function () {

    let container = null;
    let store = null;

    function handleToggle() {
        let value = store.get('toggled');
        let toggleBtn = container.querySelector('div.cursor-pointer, .label-wrap');

        if (value && value === 'true') {
            state.utils.triggerEvent(toggleBtn, 'click');
            load();
        }
        toggleBtn.addEventListener('click', function () {
            let span = this.querySelector('.transition, .icon');
            store.set('toggled', span.style.transform !== 'rotate(90deg)');
            load();
        });
    }
    
    function handleUnitToggles() {
        container.querySelectorAll('.gradio-accordion').forEach(accordion => {
            let storeId = accordion.id.replace("faceswaplab_", "") + '_toggled';
            let value = store.get(storeId);
            let toggleBtn = accordion.querySelector('div.cursor-pointer, .label-wrap');

            if (value && value === 'true') {
                state.utils.triggerEvent(toggleBtn, 'click');
            }
            toggleBtn.addEventListener('click', function () {
                let span = this.querySelector('.transition, .icon');
                store.set(storeId, span.style.transform !== 'rotate(90deg)');
            });
        });
    }

    function bindTabEvents() {
        const tabs = container.querySelectorAll('.tabs > div > button');
        tabs.forEach(tab => { // dirty hack here
            tab.removeEventListener('click', onTabClick);
            tab.addEventListener('click', onTabClick);
        });
        return tabs;
    }

    function handleTabs() {
        let tabs = bindTabEvents();
        let value = store.get('tab');
        if (value) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].textContent === value) {
                    state.utils.triggerEvent(tabs[i], 'click');
                    break;
                }
            }
        }
    }

    function onTabClick() {
        store.set('tab', this.textContent);
        bindTabEvents();
    }

    function handleCheckboxes() {
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            let id = checkbox.parentElement.parentElement.id.replace("faceswaplab_", "");
            let value = store.get(id);
            if (value) {
                state.utils.setValue(checkbox, value, 'change');
            }
            checkbox.addEventListener('change', function () {
                store.set(id, this.checked);
            });
        });
    }

    function handleSelects() {
        container.querySelectorAll('.gradio-dropdown').forEach(select => {
            let id = select.id.replace("faceswaplab_", "");
            let value = store.get(id);
            state.utils.handleSelect(select, id, store);
            if (id === 'preprocessor' && value && value.toLowerCase() !== 'none') {
                state.utils.onNextUiUpdates(handleSliders); // update new sliders if needed
            }
        });
    }

    function handleSliders() {
        container.querySelectorAll('input[type="range"]').forEach(slider => {
            let id = slider.parentElement.id.replace("faceswaplab_", "");
            let value = store.get(id);
            if (value) {
                state.utils.setValue(slider, value, 'change');
            }
            slider.addEventListener('change', function () {
                store.set(id, this.value);
            });
        });
    }

    function handleRadioButtons() {
        container.querySelectorAll('fieldset').forEach(fieldset => {
            let radios = fieldset.querySelectorAll('input[type="radio"]');
            let id = fieldset.id.replace("faceswaplab_", "");
            let value = store.get(id);
            if (value) {
                radios.forEach(function (radio) {
                    state.utils.setValue(radio, value, 'change');
                });
            }
            radios.forEach(function (radio) {
                radio.addEventListener('change', function () {
                    store.set(id, this.value);
                });
            });
        });
    }

    function handleTextareas() {
        container.querySelectorAll('.gradio-textbox').forEach(textarea => {
            let id = textarea.id.replace("faceswaplab_", "");
            let textField = textarea.querySelector('textarea');
            let value = store.get(id);

            const events = ['change', 'input'];
            events.forEach(event => {
                if (value) {
                    state.utils.setValue(textField, value, event);
                }
                textField.addEventListener(event, function () {
                    store.set(id, this.value);
                });
            });
        });
    }

    function load() {
        setTimeout(function () {
            handleTabs();
            handleUnitToggles();
            handleCheckboxes();
            handleSelects();
            handleSliders();
            handleRadioButtons();
            handleTextareas();
        }, 500);
    }

    function init() {

        container = gradioApp().getElementById('faceswaplab');
        store = new state.Store('ext-faceswaplab');

        if (! container) {
            return;
        }

        handleToggle();
        load();
    }

    return { init };
}());
