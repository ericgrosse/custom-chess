class Chess {
  constructor() {
    this.board = this.initializeBoard();
    this.turn = 'w';
  }

  initializeBoard() {
    const emptyRow = [null, null, null, null, null, null, null, null];
    return [
      [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
      [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
      [...emptyRow],
      [...emptyRow],
      [...emptyRow],
      [...emptyRow],
      [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
      [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }]
    ];
  }

  get(square) {
    const [col, row] = this.squareToIndices(square);
    return this.board[row][col];
  }

  move({ from, to, promotion }) {
    const [fromCol, fromRow] = this.squareToIndices(from);
    const [toCol, toRow] = this.squareToIndices(to);

    const piece = this.board[fromRow][fromCol];
    if (!piece) return null;

    const target = this.board[toRow][toCol];
    const captured = target ? target : null;

    // Handle pawn promotion
    if (promotion && piece.type === 'p' && (toRow === 0 || toRow === 7)) {
      piece.type = promotion;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    this.turn = this.turn === 'w' ? 'b' : 'w';

    return { from, to, piece, captured };
  }

  isCheckmate() {
    // Placeholder for checkmate logic
    return false;
  }

  isStalemate() {
    // Placeholder for stalemate logic
    return false;
  }

  isCheck() {
    // Placeholder for check logic
    return false;
  }

  squareToIndices(square) {
    const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(square[1]);
    return [col, row];
  }

  indicesToSquare(col, row) {
    return String.fromCharCode(col + 'a'.charCodeAt(0)) + (8 - row).toString();
  }

  isWithinBounds(col, row) {
    return col >= 0 && col < 8 && row >= 0 && row < 8;
  }

  moves({ square, verbose }) {
    const [col, row] = this.squareToIndices(square);
    const piece = this.board[row][col];
    if (!piece) return [];
  
    switch (piece.type) {
      case 'p':
        return this.getPawnMoves(square, piece);
      case 'n':
        return this.getKnightMoves(square, piece);
      case 'r':
        return this.getRookMoves(square, piece);
      case 'b':
        return this.getBishopMoves(square, piece);
      case 'q':
        return this.getQueenMoves(square, piece);
      case 'k':
        return this.getKingMoves(square, piece);
      default:
        return []; // Handle unrecognized piece types or throw an error
    }
  }  

  getPawnMoves(square, piece) {
    const [col, row] = this.squareToIndices(square);
    const direction = piece.color === 'w' ? -1 : 1;
    const startRow = piece.color === 'w' ? 6 : 1;
    const endRow = piece.color === 'w' ? 0 : 7;

    const moves = [];

    // Move forward one square
    if (this.board[row + direction][col] === null) {
      moves.push({
        from: square,
        to: this.indicesToSquare(col, row + direction),
        piece: piece,
        promotion: (row + direction === endRow) ? 'q' : undefined,
        captured: null
      });

      // Move forward two squares from starting position
      if (row === startRow && this.board[row + 2 * direction][col] === null) {
        moves.push({
          from: square,
          to: this.indicesToSquare(col, row + 2 * direction),
          piece: piece,
          captured: null
        });
      }
    }

    // Capture diagonally
    const captureOffsets = [-1, 1];
    for (const offset of captureOffsets) {
      const captureCol = col + offset;
      if (captureCol >= 0 && captureCol < 8) {
        const target = this.board[row + direction][captureCol];
        if (target && target.color !== piece.color) {
          moves.push({
            from: square,
            to: this.indicesToSquare(captureCol, row + direction),
            piece: piece,
            captured: target,
            promotion: (row + direction === endRow) ? 'q' : undefined
          });
        }
      }
    }

    return moves;
  }

  getKnightMoves(square, piece) {
    const [col, row] = this.squareToIndices(square);
    const moves = [];

    const knightMoves = [
      [1, 2], [2, 1], [-1, 2], [-2, 1],
      [1, -2], [2, -1], [-1, -2], [-2, -1]
    ];

    for (const [dc, dr] of knightMoves) {
      const newCol = col + dc;
      const newRow = row + dr;
      if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
        const target = this.board[newRow][newCol];
        if (!target || target.color !== piece.color) {
          moves.push({
            from: square,
            to: this.indicesToSquare(newCol, newRow),
            piece: piece,
            captured: target
          });
        }
      }
    }

    return moves;
  }

  getRookMoves(square, piece) {
    const [col, row] = this.squareToIndices(square);
    const moves = [];

    // Check horizontally to the right
    for (let c = col + 1; c < 8; c++) {
      const target = this.board[row][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, row),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, row),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check horizontally to the left
    for (let c = col - 1; c >= 0; c--) {
      const target = this.board[row][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, row),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, row),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check vertically upwards
    for (let r = row + 1; r < 8; r++) {
      const target = this.board[r][col];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(col, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(col, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check vertically downwards
    for (let r = row - 1; r >= 0; r--) {
      const target = this.board[r][col];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(col, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(col, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    return moves;
  }

  getBishopMoves(square, piece) {
    const [col, row] = this.squareToIndices(square);
    const moves = [];

    // Check diagonally upwards-right
    let r = row + 1;
    for (let c = col + 1; r < 8 && c < 8; c++, r++) {
      const target = this.board[r][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check diagonally upwards-left
    r = row + 1;
    for (let c = col - 1; r < 8 && c >= 0; c--, r++) {
      const target = this.board[r][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check diagonally downwards-right
    r = row - 1;
    for (let c = col + 1; r >= 0 && c < 8; c++, r--) {
      const target = this.board[r][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    // Check diagonally downwards-left
    r = row - 1;
    for (let c = col - 1; r >= 0 && c >= 0; c--, r--) {
      const target = this.board[r][c];
      if (!target) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: null
        });
      } else if (target.color !== piece.color) {
        moves.push({
          from: square,
          to: this.indicesToSquare(c, r),
          piece: piece,
          captured: target
        });
        break;
      } else {
        break;
      }
    }

    return moves;
  }

  getQueenMoves(square, piece) {
    const rookMoves = this.getRookMoves(square, piece);
    const bishopMoves = this.getBishopMoves(square, piece);
    return [...rookMoves, ...bishopMoves];
  }

  getKingMoves(square, piece) {
    const [col, row] = this.squareToIndices(square);
    const moves = [];
    const directions = [-1, 0, 1];

    // Iterate over all possible directions around the king
    directions.forEach(dx => {
      directions.forEach(dy => {
        if (dx !== 0 || dy !== 0) { // Exclude the current square
          const targetCol = col + dx;
          const targetRow = row + dy;
          if (this.isWithinBounds(targetCol, targetRow)) {
            const target = this.board[targetRow][targetCol];
            if (!target || target.color !== piece.color) {
              moves.push({
                from: square,
                to: this.indicesToSquare(targetCol, targetRow),
                piece: piece,
                captured: target
              });
            }
          }
        }
      });
    });

    return moves;
  }
}

export default Chess;
