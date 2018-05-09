# larkplayer-hls

[larkplayer](https://github.com/dblate/larkplayer) 插件，用于播放 m3u8 视频

基于 [hls.js](https://github.com/video-dev/hls.js/) 开发

## 下载

NPM

```shell
npm install larkplayer-hls
```

CDN

```javascript
<script type="text/javascript" src="https://unpkg.com/larkplayer-hls@latest/dist/larkplayer-hls.js"></script>
```

### 使用

#### script

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>larkplayer hls</title>
</head>
<body>
    <video id="video-el" src="https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8" loop controls></video>
 
    <script type="text/javascript" src="https://unpkg.com/larkplayer@latest/dist/larkplayer.js"></script>
    <script type="text/javascript" src="https://unpkg.com/larkplayer-hls@latest/dist/larkplayer-hls.js"></script>

    <script type="text/javascript">
        var player = larkplayer('video-el', {
            width: 640,
            height: 360,
            MS: {
                // 可选，详细参数见 https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
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

#### npm & es6

```javascript
import larkplayer from 'larkplayer';
import 'larkplayer-hls';

const player = larkplayer('video-el');

player.src('xxx.m3u8');
player.play();

```
