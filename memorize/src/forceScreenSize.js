const WINDOW_WIDTH = 390;
const WINDOW_HEIGHT = 844;

export default function forceScreenSize(width = WINDOW_WIDTH, height = WINDOW_HEIGHT) {
    console.log('resize');
    window.resizeTo(width, height);

    window.addEventListener('resize', () => {
        console.log('resize');
        window.resizeTo(width, height)
    })
}