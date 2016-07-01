# ionicDemo
ionic demo template

# 文件结构
  

# 关于图标
访问http://ionicons.com/  可查询具体图标名称 或 查看ionicons-2.0.1.zip

# cordova插件

- 1.时间插件

  命令: cordova plugin add cordova-plugin-datepicker

  详情：https://www.npmjs.com/package/cordova-plugin-datepicker


- 2.Toast插件

  命令：cordova plugin add cordova-plugin-x-toast
  详情：https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin


- 3.PouchDB 本地存储插件

  PouchDB是操作SQLite数据库的javascript库（操作与mongodb一样）

  SQLite是一种轻量级的嵌入式数据库（数据库不需要你安装的，手机系统自带，你需要安装的就是SQLite插件）
  安装SQLite插件和pouchdb.js库，并将pouchdb引入到index.html中。

  * 1. 安装指令: cordova plugin add io.litehelpers.cordova.sqlitestorage
  
       旧版本 cordova plugin add https://github.com/nolanlawson/sqlite-plugin-fork

  * 2. 在index.html中引入js<script src="lib/pouchdb/dist/pouchdb.min.js"></script>

  API: http://pouchdb.com/api.html

  PouchDB查询插件:
  
  https://github.com/nolanlawson/pouchdb-find

- 4.图片浏览

  命令: cordova plugin add https://github.com/wymsee/cordova-imagePicker.git

- 5.文件上传下载插件

  命令: cordova plugin add cordova-plugin-file-transfer

  详情: https://github.com/apache/cordova-plugin-file-transfer

- 6.拍照

  命令: cordova plugin add cordova-plugin-camera

  详情: https//github.com/apache/cordova-plugin-camera

- 7.

  命令：cordova plugin add cordova-plugin-admobpro
  
  详情：https://github.com/floatinghotpot/cordova-admob-pro#quick-demo

- 8.fileOpener for android

  命令：cordova plugin add cordova-plugin-fileopener

  详情：https://github.com/Smile-SA/cordova-plugin-fileopener

- 9.发送短信

  命令：cordova plugin add cordova-sms-plugin
  
  详情：https://github.com/cordova-sms/cordova-sms-plugin

- 10.打电话

  命令：cordova plugin add cordova-plugin-phonecaller


- 11.JPush 推送

  极光推送：https://www.jpush.cn

  安装：cordova plugin add jpush-phonegap-plugin --variable API_KEY=your_jpush_appkey


- 12.地图定位
  1.
  cordova plugin add cordova-plugin-geolocation


  2.
  baidu
  cordova plugin add https://github.com/ETENG-OSP/cordova-plugin-baidu-geolocation.git --variable API_KEY=百度分配的AK --save
  AK 6AeHHnQQhgoMNOvOw9RZklLmZoE7kvSa

  3.
  baidu(修改后)

  cordova plugin add cordova-plugin-baidu-geolocation-c

- 13.调用百度或高德地图app

  命令：cordova plugin add https://github.com/samCooker/mapnavigation.git
