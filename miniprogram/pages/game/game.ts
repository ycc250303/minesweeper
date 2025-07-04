import { MineBoard,gameStatus, mineCellStatus } from '../../utils/minesweeper';


Page({
  data: {
    rows: 0,
    cols: 0,
    mines: 0,
    board: [] as any[],
    cellPx: 0,
    firstClick: false,
    mineBoard: null as MineBoard | null,
    elapsedTime: 0,
    timer: null as number | null
  },

  onLoad(options: any) {
    const rows = parseInt(options.rows, 10);
    const cols = parseInt(options.cols, 10);
    const mines = parseInt(options.mines, 10);

    const sysInfo: WechatMiniprogram.SystemInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth - 40;

    const gap = 2;
    const cellPx = (screenWidth - gap * (cols + 1)) / cols;

    // 生成空白地块
    const board = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ id: `${i}-${j}`, status: mineCellStatus.init , adjacentMines: 0 });
      }
      board.push(row);
    }

    this.setData({ rows, cols, mines, board, cellPx });
  },

  // 处理格子点击事件
  onCellTap(e: any) {
    const row = parseInt(e.currentTarget.dataset.row, 10);
    const col = parseInt(e.currentTarget.dataset.col, 10);
    const mineBoard = this.data.mineBoard;

    // 第一次点击
    if (!this.data.firstClick) {
      this.onFirstCellClick(row, col);
      this.setData({ firstClick: true });
    } 
    else if (mineBoard && mineBoard.board[row][col].status === mineCellStatus.init) {
      // 已经开始游戏
      mineBoard.revealCell(row, col);
      this.syncBoard();

      // 判断输赢
      if (mineBoard.status === gameStatus.win) { 
        wx.showToast({ title: '恭喜你，胜利！', icon: 'success' });
        this.stopTimer();
      } else if (mineBoard.status === gameStatus.fail) { 
        wx.showToast({ title: '游戏失败', icon: 'none' });
        this.stopTimer();
      }
    }
  },

  // 同步 MineBoard 到前端 board 数据
  syncBoard() {
    const mineBoard = this.data.mineBoard;
    if (!mineBoard) return;

    const board = this.data.board.map((row, rowIdx) =>
      row.map((cell: any, colIdx: number) => ({
        ...cell,
        status: mineBoard.board[rowIdx][colIdx].status,
        adjacentMines: mineBoard.board[rowIdx][colIdx].adjacentMines
      }))
    );
    this.setData({ board });
  },

  // 用户第一次点击
  onFirstCellClick(firstClickRow: number, firstClickCol: number) {
    // 创建MineBoard实例
    const mineBoard = new MineBoard(this.data.rows, this.data.cols, firstClickRow, firstClickCol, this.data.mines);
    
    this.setData({ mineBoard });
    mineBoard.revealCell(firstClickRow, firstClickCol);
    this.syncBoard();
    console.log('第一次点击，创建MineBoard', mineBoard, 'firstClickRow', firstClickRow, 'firstClickCol', firstClickCol);
    
    // 启动计时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    const timer = setInterval(() => {
      this.setData({ elapsedTime: this.data.elapsedTime + 1 });
    }, 1000);
    this.setData({ timer });
  },

  // 关闭计时器
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  }
});