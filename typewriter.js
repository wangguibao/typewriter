var ROWHEIGHT = 30;
var ROWSTART = 30;
var LINEWIDTH = 1;
var gameLevel = 1;
var xPos;
var yPos;
var charactersPerRow;
var characterWidth;
var currentCharacterCount;
var totalCharacterCount;
var currentCharacterCountInRow;
var currentRow;
var txt;

window.onload = init;
function init() {
    mainDiv = document.getElementById("li_left");
    mainDiv.style.backgroundColor = "#FFFFFF";
    document.body.style.background = "url('images/bg-level" + gameLevel + "-small.jpg') no-repeat";

	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');

    context2D.font = '16px mono';
    characterWidth = context2D.measureText('A').width;
    charactersPerRow = canvas.width / characterWidth - 1;
    currentCharacterCount = 0;
    currentCharacterCountInRow = 0;
    
    initTypewriter();
    drawText(gameLevel);
    resetCursor();
    
    document.body.addEventListener("keypress", onKeyPress, false);
    document.body.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);

}

function initTypewriter() {
	context2D.clearRect(0, 0, canvas.width, canvas.height);
    context2D.lineWidth = LINEWIDTH;
    context2D.strokeStyle = '#3f3f3f';
    
    var y;
    for (y = ROWSTART; y <= canvas.height; y += ROWHEIGHT * 2) {
        context2D.moveTo(0, y);
        context2D.lineTo(canvas.width, y);
    }
    
    context2D.stroke();
}

function drawText(level) {
    var n;
    var y = ROWSTART;

    context2D.fillStyle = 'red';

    txt = text[level];
    for (n = 0; n <= txt.length && y + 2 * ROWHEIGHT < canvas.height; n += charactersPerRow) {
        context2D.fillText(txt.substring(n, n + charactersPerRow), 0, y);
        y += ROWHEIGHT * 2;
    }
    
    totalCharacterCount = n;
}

function resetCursor() {
    xPos = 0;
    yPos = ROWSTART + ROWHEIGHT;
    currentRow = 0;
    context2D.fillStyle = 'black';
}

function onKeyPress(event) {
    context2D.fillText(String.fromCharCode(event.keyCode), xPos, yPos);
    currentCharacterCountInRow++;
    currentCharacterCount++;
    if (currentCharacterCountInRow >= charactersPerRow) {
        xPos = 0;
        yPos += 2 * ROWHEIGHT;
        currentCharacterCountInRow = 0;
        currentRow++;
    }
    else {
        xPos += characterWidth;
    }
    
    var div = document.getElementById("progress");
    var progressBar = div.getElementsByTagName("div")[0];
    progressBar.style.width = Math.ceil(currentCharacterCount * 100 / totalCharacterCount) + "%";
    
    if (currentCharacterCount >= totalCharacterCount) {
        alert("Game passed!");
        //gameLevel++;
        //init();
    }
}

function onKeyDown(event) {
    if (event.keyCode == 8) {
        if (currentCharacterCountInRow == 0 && currentRow != 0) {
            xPos = (charactersPerRow - 1) * characterWidth;
            yPos -= 2 * ROWHEIGHT;
            currentRow--;
            currentCharacterCountInRow = charactersPerRow - 1;
        }
        else if (currentCharacterCountInRow != 0) {
            xPos -= characterWidth;
            currentCharacterCountInRow--;
        }
        
        context2D.save();
        context2D.fillStyle = '#FFFFFF';
        context2D.fillRect(xPos, yPos - (ROWHEIGHT - 5), characterWidth, ROWHEIGHT);
        context2D.stroke();
        context2D.restore();
    }
}

function onDocumentKeyDown(event) {
    if (event.keyCode == 8) {
        event.preventDefault();
    }
}