import { MineBoard, gameStatus, mineCellStatus } from '../../utils/minesweeper';

function generateBoardView(mineBoard: MineBoard, mineCellStatus: any) {
  return mineBoard.board.map((row: any[], i: number) =>
    row.map((cellData: any, j: number) => ({
      id: `${i}-${j}`,
      status: cellData.status,
      adjacentMines: cellData.adjacentMines,
      display:
        cellData.status === mineCellStatus.flag
          ? "🚩"
          : cellData.status === mineCellStatus.reveal
            ? cellData.isMine
              ? "💣"
              : cellData.adjacentMines > 0
                ? cellData.adjacentMines.toString()
                : ""
            : ""
    }))
  );
}

Page({
  data: {
    rows: 0, // 行数
    cols: 0, // 列数
    mines: 0, // 雷数
    board: [] as any[], // 棋盘
    cellPx: 0, // 单个地块大小
    flagsCount: 0, // 旗子数
    firstClick: false, // 是否为第一次点击
    mineBoard: null as MineBoard | null,
    elapsedTime: 0, // 游戏时间
    timer: null as number | null, // 计时器
    tapTimer: null as number | null,
    tapCount: 0, // 点击次数

  },

  // 初始化游戏
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
        row.push({ id: `${i}-${j}`, status: 0, display: "" });
      }
      board.push(row);
    }

    this.setData({ rows: rows, cols: cols, mines: mines, board: board, cellPx: cellPx, flagsCount: mines });
  },

  // 点击格子事件
  onCellClick(e: any) {
    const row = parseInt(e.currentTarget.dataset.row, 10);
    const col = parseInt(e.currentTarget.dataset.col, 10);

    this.data.tapCount = (this.data.tapCount || 0) + 1;
    const mineBoard = this.data.mineBoard;

    if (this.data.tapCount === 1) {
      this.data.tapTimer = setTimeout(() => {
        this.data.tapCount = 0;
        this.data.tapTimer = null;

        if (!this.data.firstClick) {
          this.onFirstCellClick(row, col);
          this.setData({ firstClick: true });
        }
        else {
          if (mineBoard) {
            mineBoard.revealCell(row, col);

            const newBoard = generateBoardView(mineBoard, mineCellStatus);
            this.setData({ mineBoard, board: newBoard, flagsCount: mineBoard.flagsCount });
          }
        }
      }, 300) // 双击判定间隔300ms
    }
    else if (this.data.tapCount === 2) {
      // 清空双击计时器
      if (this.data.tapTimer) {
        clearTimeout(this.data.tapTimer);
        this.data.tapTimer = null;
      }
      this.data.tapCount = 0;
      if (mineBoard) {
        mineBoard.doubleClickToReveal(row, col);
        const newBoard = generateBoardView(mineBoard, mineCellStatus);
        this.setData({ mineBoard, board: newBoard, flagsCount: mineBoard.flagsCount });
      }
    }

    // 检查游戏状态
    if (mineBoard) {
      if (mineBoard.status === gameStatus.win) { // 1: win
        wx.showToast({ title: '恭喜你，胜利！', icon: 'success' });
        this.stopTimer();
      } else if (mineBoard.status === gameStatus.fail) { // 2: fail
        wx.showToast({ title: '游戏失败', icon: 'none' });
        this.stopTimer();
      }
    }
  },

  // 第一次点击格子事件
  onFirstCellClick(firstClickRow: number, firstClickCol: number) {
    console.log("第一次点击");
    const mineBoard = new MineBoard(this.data.rows, this.data.cols, firstClickRow, firstClickCol, this.data.mines);
    this.data.mineBoard = mineBoard;
    const newBoard = generateBoardView(mineBoard, mineCellStatus);
    this.setData({ mineBoard, board: newBoard, flagsCount: mineBoard.flagsCount });
    console.log('第一次点击，创建MineBoard', mineBoard, 'firstClickRow', firstClickRow, 'firstClickCol', firstClickCol);

    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    const timer = setInterval(() => {
      this.setData({ elapsedTime: this.data.elapsedTime + 1 });
    }, 1000);
    this.setData({ timer });
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 卸载页面
  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  // 长按格子事件（插旗/取消旗）
  onCellLongPress(e: any) {
    const row = parseInt(e.currentTarget.dataset.row, 10);
    const col = parseInt(e.currentTarget.dataset.col, 10);
    console.log("长按操作");
    const mineBoard = this.data.mineBoard;
    if (mineBoard) {
      const cell = mineBoard.board[row][col];
      if (cell.status === mineCellStatus.init) {
        if (mineBoard.flagsCount === 0) {
          wx.showToast({ title: '旗子数量已用完', icon: 'none' });
          return;
        }
        mineBoard.addFlag(row, col);
      } else if (cell.status === mineCellStatus.flag) {
        mineBoard.removeFlag(row, col);
      }
      const newBoard = generateBoardView(mineBoard, mineCellStatus);
      this.setData({ mineBoard, board: newBoard, flagsCount: mineBoard.flagsCount });
    }
  },
});