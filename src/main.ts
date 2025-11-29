import './style.css'

declare global {
  interface Window {
    interactor: any;
  }
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Interactor Embed Test</h1>
    <p>The chat widget should appear in the bottom right corner.</p>
  </div>
`

// Initialize Interactor
window.addEventListener('load', () => {
  if (window.interactor) {
    window.interactor.initialize('dave', {
      type: 'mobile',
      isOpen: false,
      isFabVisible: true,
      fabConfig: {
        wrapper: {
          shape: 'circle',
          animation: {
            type: 'spin',
            duration: 10000,
          },
          ring: {
            text: {
              top: {
                value: '24/7 AI CONCIERGE',
                fontSize: 14,
                lineHeight: 20,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                textLength: 160,
              },
              bottom: {
                value: '24/7 AI CONCIERGE',
                fontSize: 14,
                lineHeight: 20,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                textLength: 160,
              },
            }
          },
        },
      }
    })
  } else {
    console.error('Interactor not found on window object')
  }
})
