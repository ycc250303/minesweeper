// index.ts
Page({
  data: {
    showCustomMode: false,
    customRows: '',
    customCols: '',
    customMines: ''
  },

  onChooseLevel(e: any) {
    const { rows, cols, mines } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/game/game?rows=${rows}&cols=${cols}&mines=${mines}`
    });
  },

  // 自定义模式按钮
  onCustomModeClick() {
    this.setData({showCustomMode: true,});
  },

  // 输入行数
  onRowsInput(e: any) {
    this.setData({customRows: e.detail.value});
  },

  // 输入列数
  onColsInput(e: any) {
    this.setData({customCols: e.detail.value});
  },

  // 输入雷数
  onMinesInput(e: any) {
    this.setData({customMines: e.detail.value});
  },

  // 确认自定义设置
  onConfirmCustom() {
    const rows = parseInt(this.data.customRows);
    const cols = parseInt(this.data.customCols);
    const mines = parseInt(this.data.customMines);

    // 检查输入是否合法
    if (isNaN(rows) || isNaN(cols) || isNaN(mines)) {
      wx.showToast({title: '请输入有效的数字',icon:'error'});
      return;
    }

    if (rows < 9 || rows > 16) {
      wx.showToast({title: '行数必须在9-16之间',icon: 'error'});
      return;
    }

    if (cols < 9 || cols > 16) {
      wx.showToast({title: '列数必须在9-16之间',icon: 'error'});
      return;
    }

    if (mines < 10 || mines > 40) {
      wx.showToast({
        title: '雷数必须在10-40之间',
        icon: 'none'
      });
      return;
    }

    // 验证雷数不能超过总格子数的30%
    const totalCells = rows * cols;
    const maxMines = Math.floor(totalCells * 0.3);
    if (mines > maxMines) {
      wx.showToast({title: `雷数不能超过${maxMines}个`,icon: 'error'});
      return;
    }

    // 隐藏自定义面板
    this.setData({
      showCustomMode: false
    });

    // 跳转到游戏页面
    wx.navigateTo({
      url: `/pages/game/game?rows=${rows}&cols=${cols}&mines=${mines}`
    });
  },

  // 取消自定义设置
  onCancelCustom() {
    this.setData({
      showCustomMode: false,
    });
  }
})
