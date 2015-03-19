# ltdata

##使用方法

打开控制台，定位到ltdata/data目录下
然后执行 ``mongoimport —jsonArray -d ltdata -c datas ltdata.json``
导入数据成功

然后定位到bin文件夹下，执行 ``node www`` 启动

地址如下：
http://localhost:3400/get/getAgencyCostPlan/1

点击饼图的一个，可以跳到其中一个Investment，显示所有的investment选择其中一个investment，显示这个investment下的所有project详情。
