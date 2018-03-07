# mantis-notifier

一个简单的 Chrome 扩展，当你的 mantis 里面有未处理的 Bugs 时，会通过 Chrome Notifications 来进行提示。

原理很简单，就是通过 chrome.alarms 来定时地请求 mantis 页面，用正则来匹配页面中的字符，以此来发现未处理的 bugs 数量。

之所以采用这样轮询页面的方式，是因为我没有办法去修改工作环境中的 mantis 源码以增加接口。

我当前工作环境的 mantis 是中文的，所以正则也是中文的，如果是西文环境稍加修改即可。

关于提示的策略将在未来的使用中稍加优化。

<img src="http://og9g58alt.bkt.clouddn.com/1111.png" width="600">
