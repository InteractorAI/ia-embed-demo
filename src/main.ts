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
      type: 'sidebar',
      isOpen: false,
      isFabVisible: true,
      onOpen: (layout: any) => {
        console.log('Chat opened', layout)
      },
      onClose: () => {
        console.log('Chat closed')
      },
      fabConfig: {
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
            borders: {


            },
            text: {
              top: {
                value: '24/7 AI CONCIERGE',
                fontSize: 12,
                lineHeight: 20,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Inter, sans-serif',
                textLength: 120,
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
      }
    })
  } else {
    console.error('Interactor not found on window object')
  }
})
