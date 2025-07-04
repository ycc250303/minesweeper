// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    onChooseLevel(e: any) {
      const { rows, cols, mines } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/game/game?rows=${rows}&cols=${cols}&mines=${mines}`
      });
    }
})
