class Chess{
    constructor(type,color){
        this.type = type;
        this.color = color;
    }
}

const rows = ["8","7","6","5","4","3","2","1"];
const cols = ["A","B","C","D","E","F","G","H"];
const whiteOffBoard = rebuildOffBoard(8, 2);
const blackOffBoard = rebuildOffBoard(8, 2);

const board = rebuildDeskMatrix(rows, cols);
fillDeskMatrix(board);

let selectedPiece = null;
let moves = [];
let colorTurn = "white";

function fillDeskMatrix(localboard){
    for(let i = 0; i < 8; i++){
        localboard[1][i].piece = new Chess("pawn","black");
        localboard[6][i].piece = new Chess("pawn","white");
    }

    localboard[0][0].piece = new Chess("rook","black");
    localboard[0][7].piece = new Chess("rook","black");
    localboard[7][0].piece = new Chess("rook","white");
    localboard[7][7].piece = new Chess("rook","white");

    localboard[0][1].piece = new Chess("knight","black");
    localboard[0][6].piece = new Chess("knight","black");
    localboard[7][1].piece = new Chess("knight","white");
    localboard[7][6].piece = new Chess("knight","white");

    localboard[0][2].piece = new Chess("bishop","black");
    localboard[0][5].piece = new Chess("bishop","black");
    localboard[7][2].piece = new Chess("bishop","white");
    localboard[7][5].piece = new Chess("bishop","white");

    localboard[0][3].piece = new Chess("queen","black");
    localboard[7][3].piece = new Chess("queen","white");

    localboard[0][4].piece = new Chess("king","black");
    localboard[7][4].piece = new Chess("king","white");
}

function clickSquare(id){
    const coords = getCoordsById(board, id);

    if(coords == null) 
        return;

    const x = coords.x;
    const y = coords.y;

    if(selectedPiece == null){
        const piece = board[y][x].piece;

        if(piece == null || piece.color != colorTurn) 
            return;

        moves = getPiceMoves(x, y);

        if(moves != null && moves.length > 0){
            selectedPiece = {x, y};
            highlightMoves(moves);
        }
    }
    else{
        const moveAvailable = moves.find(mov => mov.x == x && mov.y == y);

        if(moveAvailable != null){
            movePiece(selectedPiece.x, selectedPiece.y, x, y);
            
            colorTurn = colorTurn == "white" ? "black" : "white";
        }

        clearHighlights(board);

        selectedPiece = null;
        moves = [];
    }
}

function getPiceMoves(x, y){
    const knightPattern = [[1, 2], [2, 1], [-1, 2], [-2, 1], 
    [1, -2], [2, -1], [-1, -2], [-2, -1]];

    const kingPattern = [[1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, 1], [1, -1], [-1, -1]];

    const rookDirections = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const bishopDirections = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    const queenDirections = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

    const piece = board[y][x].piece;

    if(piece == null) 
        return [];

    switch(piece.type){
        case "pawn": return pawnMoves(x, y, piece.color);
        case "knight": return patternMoves(x, y, piece.color, knightPattern);
        case "king": return patternMoves(x, y, piece.color, kingPattern);
        case "rook": return slidingMoves(x, y, piece.color, rookDirections);
        case "bishop": return slidingMoves(x, y, piece.color, bishopDirections);
        case "queen": return slidingMoves(x, y, piece.color, queenDirections);
    }
}

function pawnMoves(x, y, color){
    const localMoves = [];

    const dir = color == "white" ? -1 : 1;
    const newy = y + dir;

    if(y == 1 || y == 6){
        localMoves.push({x:x, y:y+2*dir});
    }

    if(insideBoard(x, newy) && board[newy][x].piece == null){
        localMoves.push({x:x, y:newy});
    }

    if(insideBoard(x+1, newy) && board[newy][x+1].piece != null 
    && board[newy][x+1].piece.color != color){
        localMoves.push({x:x+1, y:newy});
    }

    if(insideBoard(x-1, newy) && board[newy][x-1].piece != null 
    && board[newy][x-1].piece.color != color){
        localMoves.push({x:x-1, y:newy});
    }

    return localMoves;
}

function patternMoves(x, y, color, pattern){
    const localMoves = [];

    pattern.forEach(pair => {
        const newx = x + pair[0];
        const newy = y + pair[1];

        if (insideBoard(newx, newy)) {
            const targetPiece = board[newy][newx].piece;

            if (targetPiece == null || targetPiece.color != color) {
                localMoves.push({ x: newx, y: newy });
            }
        }
    });

    return localMoves;
}

function slidingMoves(x, y, color, directions){
    const localMoves = [];

    directions.forEach(direction => {
        let newx = x + direction[0];
        let newy = y + direction[1];

        while(insideBoard(newx, newy)){
            if(board[newy][newx].piece != null){
                if(board[newy][newx].piece.color == color){
                    const backx = newx - direction[0];
                    const backy = newy - direction[1];

                    if(backx != x && backy != y){
                        localMoves.push({x:backx, y:backy});
                    }

                    break;
                }
    
                if(board[newy][newx].piece.color != color){
                    localMoves.push({x:newx, y:newy});
                    break;
                }
            }
            else{
                localMoves.push({x:newx, y:newy});
                newx += direction[0];
                newy += direction[1];
            }
        }
    });

    return localMoves;
}

function movePiece(fromx, fromy, tox, toy){
    const mainPiece = board[fromy][fromx].piece;
    board[fromy][fromx].piece = null;
    const pointPiece = board[toy][tox].piece;
    board[toy][tox].piece = mainPiece;

    const fromId = coordsToId(fromx, fromy);
    const toId = coordsToId(tox, toy);

    const fromCell = document.getElementById(fromId);
    const toCell = document.getElementById(toId);
    const gameLog = document.getElementById("gameLog");

    if(fromCell != null && toCell != null){
        gameLog.value += `|${mainPiece.color} ${mainPiece.type} ${fromId}->${toId}`;
        if(pointPiece != null && pointPiece.color != mainPiece.color){
            const targetBoard = pointPiece.color == "white" ? whiteOffBoard : blackOffBoard;
            const targetId = pointPiece.color == "white" ? "whiteOff" : "blackOff";

            gameLog.value += `убив ${pointPiece.color} ${pointPiece.type}|`;

            buildInFreeMatrixCell(pointPiece, targetBoard, targetId, toCell.innerHTML);
        }
        else{
            gameLog.value += "|";
        }

        toCell.innerHTML = fromCell.innerHTML;
        fromCell.innerHTML = "";
    }
}

function insideBoard(x,y){
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function getCoordsById(matrix, targetId){
    const cell = matrix.flat().find(c => c.id === targetId);

    if(cell != null){
        return {x: cell.x, y: cell.y};
    }

    return null;
}

function coordsToId(x, y){
    return cols[x] + rows[y];
}

function rebuildOffBoard(rowsNum, colsNum){
    const matrix = [];

    for (let row = 0; row < rowsNum; row++) {
        matrix[row] = [];

        for (let col = 0; col < colsNum; col++) {
            matrix[row][col] = null;
        }
    }

    return matrix;
}

function rebuildDeskMatrix(rows, cols){
    const matrix = [];

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const rowArray = [];
        const rowName = rows[rowIdx];

        for (let colIdx = 0; colIdx < cols.length; colIdx++) {
            const colName = cols[colIdx];

            const cell = {
                id: colName + rowName,
                x: colIdx,
                y: rowIdx,
                piece: null
            };

            rowArray.push(cell);
        }

        matrix.push(rowArray);
    }

    return matrix;
}

function highlightMoves(moves){
    moves.forEach(move => {
        const id = coordsToId(move.x,move.y);

        const cell = document.getElementById(id);

        if(cell != null){
            cell.style.backgroundColor = "green";
        }
    });
}

function clearHighlights(board){
    board.flat().forEach(cell => {
        const element = document.getElementById(cell.id);

        if(element != null){
            element.style.backgroundColor = "";
        }
    });
}

function buildInFreeMatrixCell(element, matrix, tableId, htmlData) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == null) {
                matrix[i][j] = element;

                const cell = document.getElementById(tableId+i+j);

                if (cell != null) 
                    cell.innerHTML = htmlData;

                return true;
            }
        }
    }
}