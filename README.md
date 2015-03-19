# ltdata

##使用方法

打开控制台，定位到ltdata/data目录下
然后执行 ``mongoimport —jsonArray -d ltdata -c datas ltdata.json``
导入数据成功

然后定位到bin文件夹下，执行 ``node www`` 启动

如果要后台运行，执行
``nohup node www``

地址如下：
http://localhost:3400/get/getAgencyCostPlan/1

##大体流程
点击饼图的一个，可以跳到其中一个Investment，显示所有的investment选择其中一个investment，显示这个investment下的所有project详情。

##项目详情

使用库：

js:
```
jquery-1.8.2.min.js
echarts-plain.js
```
nodejs:
```
express
ejs
moment
```