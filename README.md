# AI名片小程序

#### 介绍
微信小程序开发的电子名片应用，抛砖引玉，欢迎大家一起来维护，贡献代码

本项目使用 MPVUE 框架进行开发，请根据下面的说明进行配置

本项目的 api接口及后台管理直接嫁接使用的 [api工厂](https://www.it120.cc/) 的免费云接口和云后台，在此先表示感谢！

本项目我们将会持续的维护下去，同时欢迎大家踊跃提交 ISSUE 或者加入进来一起开发和维护本项目！

#### 接口 & 后台声明

本项目为纯前端项目，由于人力和精力所限，本项目并未有开发配套的后台系统，而是直接使用了 [api 工厂](https://www.it120.cc/) 提供的免费接口和后台，可以完全满足本项目的所有功能需求。

- [接口 SDK](https://github.com/gooking/wxapi)

- [免费后台](https://admin.it120.cc)

- [WeUI](https://github.com/Tencent/weui-wxss/)

#### 扫码体验
<img src="https://cdn.it120.cc/apifactory/2018/12/18/c2324da4eea91602f385db5b523b13ca.jpg" width="200px">

#### 其他开源模板

| 舔果果小铺 | 天使童装 | 面馆风格小程序 |
| :------: | :------: | :------: |
| <img src="https://cdn.it120.cc/apifactory/2018/04/01/b7b8f5a0fcfc72454ade8510ab929717.jpg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/06/28/a8304003-3218-4a47-95cf-84d82ebdc07b.jpg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/03/29/9e30cfe31eabcd218eb9c434f17e9295.jpg" width="200px"> | 
| [开源地址](https://github.com/qindiandadudu/TianguoguoXiaopu) | [开源地址](https://github.com/EastWorld/wechat-app-mall) | [开源地址](https://gitee.com/javazj/noodle_shop_procedures) |

## 联系作者

| 微信好友 | 支付宝好友 |
| :------: | :------: |
| <img src="https://cdn.it120.cc/apifactory/2019/07/03/a86f7e46-1dbc-42fe-9495-65403659671e.jpeg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/07/03/fda59aeb-4943-4379-93bb-92856740bd6a.jpeg" width="200px"> |

#### QQ交流群

534721253 （可用手机QQ扫下面的二维码加群）

<img src="https://cdn.it120.cc/apifactory/2019/06/28/4f802bd3-6649-442a-a7a7-cc1a1196b5c7.png" width="200px">

#### 使用说明

1、 [api工厂](https://www.it120.cc/) 右上角注册免费开通您的专属后台
> 
2、project.config.json  和 package.swan.json 文件中的 appid 改为你自己小程序的 appid；
> 
3、app.json 中的小程序名称和底部菜单名称改为你自己的；
> 
4、prod.env.js 文件中的小程序名称和专属域名换成你自己的；
> 
5、工厂后台，微信设置中，配置 appid 和 secret
> 
6、 [设置小程序合法服务器域名](https://www.it120.cc/info/faq/10469)


## 运行小程序

``` bash
# 编译小程序
npm run dev

然后打开小程序的开发工具，导入本项目（当前项目下的  dist 文件夹下）
```

