var ROWHEIGHT = 30;
var ROWSTART = 30;
var LINEWIDTH = 1;
var LEFTMARGIN = 10;
var BACKGROUNDCOLOR = "#F9EDA4";
var TEXTCOLOR = '#FF0000';
var MANUALTEXTCOLOR = '#004A00';
var WRONGTEXTCOLOR = TEXTCOLOR;
var HORIZONTALLINECOLOR = '#A0B798';
var VERTICALLINECOLOR = TEXTCOLOR;
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
    mainDiv.style.backgroundColor = BACKGROUNDCOLOR;
    document.body.style.background = "url('images/bg-level" + gameLevel + "-small.jpg') no-repeat";

	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');

    context2D.font = '16pt monospace';
    characterWidth = context2D.measureText('A').width;
    charactersPerRow = Math.floor((canvas.width - LEFTMARGIN) / characterWidth);
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
    context2D.strokeStyle = HORIZONTALLINECOLOR;
    
    var y;
    for (y = ROWSTART; y <= canvas.height; y += ROWHEIGHT * 2) {
        context2D.moveTo(0, y);
        context2D.lineTo(canvas.width, y);
        context2D.stroke();
    }
    
    context2D.beginPath();
    context2D.strokeStyle = VERTICALLINECOLOR;
    context2D.moveTo(LEFTMARGIN, 0);
    context2D.lineTo(LEFTMARGIN, canvas.height);
    context2D.stroke();
}

function drawText(level) {
    var n;
    var y = ROWSTART;

    context2D.fillStyle = TEXTCOLOR;
    context2D.beginPath();

    txt = text[level];
    for (n = 0; n <= txt.length && y + 2 * ROWHEIGHT < canvas.height; n += charactersPerRow) {
        context2D.fillText(txt.substring(n, n + charactersPerRow), LEFTMARGIN, y);
        y += ROWHEIGHT * 2;
    }
    
    totalCharacterCount = n;
}

function resetCursor() {
    xPos = LEFTMARGIN;
    yPos = ROWSTART + ROWHEIGHT;
    currentRow = 0;
    context2D.fillStyle = MANUALTEXTCOLOR;
    context2D.fillText('_', xPos, yPos);
}

function onKeyPress(event) {
    context2D.fillStyle = BACKGROUNDCOLOR;
    context2D.fillText('_', xPos, yPos);
    context2D.fillStyle = MANUALTEXTCOLOR;
    
    if (String.fromCharCode(event.keyCode) != txt[currentCharacterCount]) {
        context2D.fillStyle = WRONGTEXTCOLOR;
    }
    context2D.fillText(String.fromCharCode(event.keyCode), xPos, yPos);
    currentCharacterCountInRow++;
    currentCharacterCount++;
    if (currentCharacterCountInRow >= charactersPerRow) {
        xPos = LEFTMARGIN;
        yPos += 2 * ROWHEIGHT;
        currentCharacterCountInRow = 0;
        currentRow++;
    }
    else {
        xPos += characterWidth;
    }
    
    context2D.fillText('_', xPos, yPos);
    updateProgressBar();
    
    if (currentCharacterCount >= totalCharacterCount) {
        alert("Game passed!");
        //gameLevel++;
        //init();
    }
}

function onKeyDown(event) {
    if (event.keyCode == 8) {
       context2D.fillStyle = BACKGROUNDCOLOR;
       context2D.fillText('_', xPos, yPos);
       
       if (currentCharacterCount > 0) {
            currentCharacterCount--;
       }
       updateProgressBar();
       
       if (currentCharacterCountInRow == 0 && currentRow != 0) {
            currentRow--;
            currentCharacterCountInRow = charactersPerRow - 1;
            xPos = LEFTMARGIN + (currentCharacterCountInRow) * characterWidth;
            yPos -= 2 * ROWHEIGHT;
        }
        else if (currentCharacterCountInRow != 0) {
            xPos -= characterWidth;
            currentCharacterCountInRow--;
        }
        
        context2D.save();
        context2D.fillStyle = BACKGROUNDCOLOR;
        context2D.fillRect(xPos + 1, yPos - (ROWHEIGHT - 5), characterWidth, ROWHEIGHT);
        context2D.stroke();
        context2D.fillStyle = MANUALTEXTCOLOR;
        context2D.fillText('_', xPos, yPos);
        context2D.restore();
    }
}

function onDocumentKeyDown(event) {
    if (event.keyCode == 8) {
        event.preventDefault();
    }
}

function updateProgressBar() {
    var div = document.getElementById("progress");
    var progressBar = div.getElementsByTagName("div")[0];
    progressBar.style.width = Math.ceil(currentCharacterCount * 100 / totalCharacterCount) + "%";
}