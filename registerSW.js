if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/water-flow/sw.js', { scope: '/water-flow/' })})}