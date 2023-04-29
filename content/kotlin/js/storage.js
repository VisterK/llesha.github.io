/* settings:
    1. panel sizes
    2. theme
    3. autosave, seconds
    4. console entries, number

    files
    file tree files and their contents
*/
import {createTree} from './filetree.js';

const holdingReset = false;
let interval = null;

document.getElementById('reset-all').onmousedown = () => {
    let index = 3;
    document.getElementById('reset-all').innerText = 'hold ' + index + '...';
    index--;
    interval = setInterval(function() {
        if (index == 0) {
            clearInterval(interval);
            document.getElementById('reset-all').innerText = 'succesful!';
            localStorage.clear();
            location.reload();
            setDefaults();
        } else document.getElementById('reset-all').innerText = 'hold ' + index + '...';
        index--;
    }, 1000);
};

function stopReset() {
    clearInterval(interval);
    document.getElementById('reset-all').innerText = 'do reset';
}

function saveResult() {
    var svgData = document.getElementById("svg-result").getElementsByTagName("svg")[0].outerHTML;
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "result"+(new Date().getUTCMilliseconds())+".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function convertSvgToPng(svgContent, desiredWidth, desiredHeight) {
    const img = new Image();
    img.width = desiredWidth;
    img.height = desiredHeight;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
    };
    return img
}

function convertSvgToJpg(svgContent, desiredWidth, desiredHeight) {
    // Create an Image element, set its size and SVG content
    const img = new Image();
    img.width = desiredWidth;
    img.height = desiredHeight;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);

    img.onload = () => {
        // Create a canvas element, set its size, and draw the SVG image on it
        const canvas = document.createElement('canvas');
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
    };
    return img;
}

function saveResultPNG() {
    const svgData = document.getElementById("svg-result").getElementsByTagName("svg")[0].outerHTML
    const pngData = convertSvgToPng(svgData, 800, 800)
    const pngBlob = new Blob([pngData], { type: "image/png;base64" })
    const pngUrl = URL.createObjectURL(pngBlob)
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl;
    downloadLink.download = "result"+(new Date().getUTCMilliseconds())+".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function saveResultJPG() {
    const svgData = document.getElementById("svg-result").getElementsByTagName("svg")[0].outerHTML
    const jpgData = convertSvgToJpg(svgData, 800, 800)
    const jpgBlob = new Blob([jpgData], { type: "image/jpg;base64" })
    const jpgUrl = URL.createObjectURL(jpgBlob)
    var downloadLink = document.createElement("a");
    downloadLink.href = jpgUrl;
    downloadLink.download = "result"+(new Date().getUTCMilliseconds())+".jpg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


document.getElementById('reset-all').onmouseup = () => stopReset();
document.getElementById('reset-all').onmouseleave = () => stopReset();
document.getElementById('save-button').onclick = () => saveResult();
document.getElementById('save-png-button').onclick = () => saveResultPNG();
document.getElementById('save-jpg-button').onclick = () => saveResultJPG();

document.getElementById('theme-button').onclick = () => {
    if (document.documentElement.getAttribute('data-theme') == 'dark') {
        changeTheme('light');
    } else changeTheme('dark');
};

document.getElementById('console-entries').onchange = (e) =>
    changeNumberInput(e.target, 'consoleEntries', [0, 200]);

document.getElementById('font-size').onchange = (e) => {
    changeNumberInput(e.target, 'fontSize', [5, 100]);
    updateFontSize();
};

function updateFontSize() {
    require(['vs/editor/editor.main'], function() {
        window.editor.updateOptions({
            fontSize: localStorage.getItem('fontSize'),
        });
    });
}

function changeNumberInput(target, storageName, bounds) {
    let value = target.value;
    if (value < bounds[0]) value = bounds[0];
    else if (value > bounds[1]) value = bounds[1];
    target.value = value;
    localStorage.setItem(storageName, parseInt(value));
    if (storageName == 'consoleEntries') {
        window.maxConsoleEntries = parseInt(value);
    }
}

function setDefaults() {
    if (localStorage.getItem('firstTime') != null) return;
    localStorage.setItem('firstTime', false);
    localStorage.setItem('theme', 'light');
    localStorage.setItem('consoleEntries', 100);
    localStorage.setItem('fontSize', 14);
    localStorage.setItem('settingsSize', 48);
    localStorage.setItem('leftSize', 33);
    localStorage.setItem('rightSize', 33);
    localStorage.setItem('consoleSize', 48);
    localStorage.setItem('layout', '{}');
    localStorage.setItem('main-file', "");
    localStorage.setItem(
        'main.rgn',
        `
fun main() {
    print("Hello, World!")
    t = a();
    test(t == 1)
}

fun a() {
    thi ;
    = 1
    return thi
}`,
    );
}
// comment

function openSettings() {
    document.getElementById('console-entries').value =
        localStorage.getItem('consoleEntries');
    window.maxConsoleEntries = parseInt(localStorage.getItem('consoleEntries'));
    document.getElementById('font-size').value =
        localStorage.getItem('fontSize');
    document.getElementById("main-file").value =  localStorage.getItem("main-file")
    updateFontSize();
}

function changeTheme(themeName) {
    require(['vs/editor/editor.main'], function() {
        localStorage.setItem('theme', themeName);
        monaco.editor.setTheme('regina-' + themeName);
        document.documentElement.setAttribute('data-theme', themeName);
        document.getElementById('theme-button').innerText = themeName;
    });
}

setDefaults();
changeTheme(localStorage.getItem('theme'));
openSettings();

createTree();
