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

  moves({ square, verbose }) {
    const [col, row] = this.squareToIndices(square);
    const piece = this.board[row][col];
    if (!piece) return [];

    let moves = [];
    if (piece.type === 'p') {
      moves = this.getPawnMoves(square, piece);
    } else if (piece.type === 'n') {
      moves = this.getKnightMoves(square, piece);
    }

    return verbose ? moves : moves.map(move => move.to);
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
}

export default Chess;
