import './style.css'

declare global {
  interface Window {
    interactor: any;
  }
}

const DEFAULT_INTERACTOR_ID = 'interactor';

const CONCIERGE_FAB_CONFIG = {
  messageBubble: {
    align: 'center-without-tail',
  },
  wrapper: {
    shape: 'circle',
    animation: {
      type: 'spin',
      duration: 10000,
    },
    container: {
      background: 'rgba(0, 0, 0, 1)',
      size: 100,
    },
    ring: {
      size: 22,
      background: 'rgb(10, 10, 10)',
      borders: {},
      text: {
        top: {
          value: "• ‎ 24/7 AI CONCIERGE ‎ •",
          fontSize: 12,
          lineHeight: 20,
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          textLength: 137.5,
        },
        bottom: {
          value: 'CHAT NOW',
          fontSize: 12,
          lineHeight: 20,
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif',
          textLength: 65,
        },
      }
    },
  },
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Embed Your Interactor</h1>
    <p>Play with the Interactor embed options below.</p>
    
    <div class="card">
      <label for="interactor-id" style="display: block; margin-bottom: 0.8rem; font-weight: 600; text-align: left;">Interactor ID</label>
      
      <div class="input-group">
        <input type="text" id="interactor-id" value="${DEFAULT_INTERACTOR_ID}" spellcheck="false">
        <button id="set-btn">Set</button>
      </div>
      
      <div style="text-align: left; margin-bottom: 1.5rem;">
          <label style="font-weight: 600; display: block; margin-bottom: 0.8rem;">View Type</label>
        <div class="view-options">
          <input type="radio" id="view-sidebar" name="view-type" value="sidebar" class="sr-only" checked>
          <label for="view-sidebar" class="option-btn">Sidebar</label>
          
          <input type="radio" id="view-mobile" name="view-type" value="mobile" class="sr-only">
          <label for="view-mobile" class="option-btn">Pop Up</label>
          <div class="slider"></div>
        </div>
      </div>

      <div style="text-align: left;">
        <label style="font-weight: 600; display: block; margin-bottom: 0.8rem;">Button Style</label>
        <div class="view-options">
          <input type="radio" id="style-concierge" name="fab-style" value="concierge" class="sr-only" checked>
          <label for="style-concierge" class="option-btn">Concierge</label>
          
          <input type="radio" id="style-simple" name="fab-style" value="simple" class="sr-only">
          <label for="style-simple" class="option-btn">Simple</label>
          <div class="slider"></div>
        </div>
      </div>

      <div style="text-align: left; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
        <label style="font-weight: 600; display: block; margin-bottom: 0.8rem;">Custom Triggers</label>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button id="btn-open-chat" style="background-color: #4a5568;">Open Interactor</button>
          <button id="btn-schedule" style="background-color: #4a5568;">Message Interactor</button>
        </div>
      </div>
    </div>
  </div>
`

const initInteractor = (id: string, type: 'sidebar' | 'mobile', fabStyle: 'concierge' | 'simple') => {
  if (window.interactor) {
    console.log(`Initializing interactor with ID: ${id}, Type: ${type}, Style: ${fabStyle}`);

    const config: any = {
      type: type,
      isOpen: false,
      isFabVisible: true,
      onOpen: (layout: any) => {
        console.log('Chat opened', layout)
      },
      onClose: () => {
        console.log('Chat closed')
      },
    };

    if (fabStyle === 'concierge') {
      config.fabConfig = CONCIERGE_FAB_CONFIG;
    } else {
      // Explicitly set to empty object to overwrite/reset previous config
      config.fabConfig = {};
    }

    window.interactor.initialize(id, config);
  } else {
    console.error('Interactor not found on window object')
  }
}

const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get('id') || DEFAULT_INTERACTOR_ID,
    type: (params.get('type') || 'sidebar') as 'sidebar' | 'mobile',
    fabStyle: (params.get('fabStyle') || 'concierge') as 'concierge' | 'simple',
    success: params.get('success') === 'true'
  };
};

const updateUrl = (id: string, type: string, fabStyle: string, reload: boolean = false) => {
  const url = new URL(window.location.href);
  url.searchParams.set('id', id);
  url.searchParams.set('type', type);
  url.searchParams.set('fabStyle', fabStyle);

  if (reload) {
    url.searchParams.set('success', 'true');
    window.location.href = url.toString();
  } else {
    window.history.replaceState({}, '', url);
  }
};

const showSuccessFeedback = () => {
  const setBtn = document.getElementById('set-btn') as HTMLButtonElement;
  if (setBtn) {
    const originalText = setBtn.innerText;
    setBtn.innerText = '✓';
    setBtn.classList.add('success');

    setTimeout(() => {
      setBtn.innerText = originalText;
      setBtn.classList.remove('success');
    }, 2000);
  }
};

// Initialize on load
window.addEventListener('load', () => {
  const { id, type, fabStyle, success } = getParams();

  // Set input values
  const idInput = document.getElementById('interactor-id') as HTMLInputElement;
  if (idInput) idInput.value = id;

  const typeRadio = document.querySelector(`input[name="view-type"][value="${type}"]`) as HTMLInputElement;
  if (typeRadio) typeRadio.checked = true;

  const styleRadio = document.querySelector(`input[name="fab-style"][value="${fabStyle}"]`) as HTMLInputElement;
  if (styleRadio) styleRadio.checked = true;

  // Initialize
  initInteractor(id, type, fabStyle);

  // Show feedback if this was a reload from "Set"
  if (success) {
    showSuccessFeedback();
    // Clean up success param
    const url = new URL(window.location.href);
    url.searchParams.delete('success');
    window.history.replaceState({}, '', url);
  }
});

// Handle Set (Reloads page)
const handleSet = () => {
  const idInput = document.getElementById('interactor-id') as HTMLInputElement;
  const typeInput = document.querySelector('input[name="view-type"]:checked') as HTMLInputElement;
  const styleInput = document.querySelector('input[name="fab-style"]:checked') as HTMLInputElement;

  if (idInput && typeInput && styleInput) {
    updateUrl(idInput.value.trim(), typeInput.value, styleInput.value, true);
  }
};

document.getElementById('set-btn')?.addEventListener('click', handleSet);
document.getElementById('interactor-id')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSet();
});

// Handle Radio Changes (Live update + URL update without reload)
const handleRadioChange = () => {
  const idInput = document.getElementById('interactor-id') as HTMLInputElement;
  const typeInput = document.querySelector('input[name="view-type"]:checked') as HTMLInputElement;
  const styleInput = document.querySelector('input[name="fab-style"]:checked') as HTMLInputElement;

  if (idInput && typeInput && styleInput) {
    const id = idInput.value.trim();
    const type = typeInput.value as 'sidebar' | 'mobile';
    const fabStyle = styleInput.value as 'concierge' | 'simple';

    updateUrl(id, type, fabStyle, false);
    initInteractor(id, type, fabStyle);
  }
};

document.querySelectorAll('input[name="view-type"]').forEach(radio => {
  radio.addEventListener('change', handleRadioChange);
});


document.querySelectorAll('input[name="fab-style"]').forEach(radio => {
  radio.addEventListener('change', handleRadioChange);
});

// Custom Triggers Handlers
// Custom Triggers Handlers
document.getElementById('btn-open-chat')?.addEventListener('click', () => {
  if (window.interactor) {
    // Correct API: window.interactor.modal.open()
    if (window.interactor.modal && typeof window.interactor.modal.open === 'function') {
      window.interactor.modal.open();
    } else {
      console.log('Interactor API: modal.open() not found');
    }
  }
});

document.getElementById('btn-schedule')?.addEventListener('click', () => {
  if (window.interactor) {
    // Correct API: window.interactor.message.send()
    // The send method automatically opens the chat by default, but we can be explicit if we want.
    // window.interactor.modal.open(); 

    if (window.interactor.message && typeof window.interactor.message.send === 'function') {
      window.interactor.message.send("I'd like to schedule a call");
    } else {
      console.log('Interactor API: message.send() not found');
    }
  }
});
