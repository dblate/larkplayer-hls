<h1>larkplayer-hls</h1>

[larkplayer](https://github.com/dblate/larkplayer) 插件，提供播放 m3u8 的能力

<h3>示例</h3>
https://s.codepen.io/dblate/debug/vRybLW/GnMnbVdDYZVM

<h3>使用</h3>

<h4>通过 script 标签的形式 </h4>

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer hls</title>
    <!-- 此 cdn 只是拿来作为示例使用，生产环境中请将文件保存在自己的服务器 -->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/larkplayer@latest/dist/larkplayer.css">
</head>
<body>
    <video id="video-el" src="https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8" loop></video>
 
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script type="text/javascript" src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
    <script type="text/javascript" src="https://unpkg.com/larkplayer-hls@latest/dist/larkplayer-hls-script.js"></script>

    <script type="text/javascript">
        // 以 script 的形式引用时，larkplayer 会直接挂载在 window 上
        var player = larkplayer('video-el', {
            width: 640,
            height: 360,
            plugins: {
                // 可传入 hls.js 提供的参数
                hls: {}
            }
        }, function () {
            console.log('player is ready');
        });

        player.play();
    </script>
</body>
</html>

```

<h4>通过 import 的形式</h4>

* require 与 import 用法相似，只不过换了个写法，反正目前都会被编译为差不多的代码 :)

```javascript
import larkplayer from 'larkplayer';
import 'hls.js';
import 'larkplayer-hls';

const player = larkplayer('video-el', {
    plugins: {
        hls: {}
    }
});

player.src('xxx.m3u8');
player.play();

```
