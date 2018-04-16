/**
 * @file larkplayer hls 插件，使得 larkplayer 可以播放 m3u8 视频
 * @author yuhui06
 * @date 2018/3/23
 * @date 2018/4/16 根据 larkplayer 接口变化更改插件
 */


import {MediaSourceHandler} from 'larkplayer';
import Hls from 'hls.js';

console.log(MediaSourceHandler);

export default class HlsHandler extends MediaSourceHandler {
    constructor(player, options) {
        super(player, options);

        this.player.isReady = false;
        this.hls = new Hls(options);

        this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            player.triggerReady();
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        this.handleMediaError();
                        break;
                    case Hls.ErrorTypes.NETWORK_ERROR:
                    default:
                        this.hls.destroy();
                        break;
                }
            }
        });
    }

    src(src) {
        this.player.isReady = false;
        this.hls.attachMedia(this.player.tech.el);
        this.hls.loadSource(src);
    }

    internalPlay() {
        const playReturn = this.player.techGet('play');
        if (playReturn && playReturn.then) {
            playReturn.then(null, err => {
                console && console.error && console.error(err);
            });
        }
    }

    play() {
        if (this.player.isReady) {
            this.internalPlay();
        } else {
            this.player.ready(this.internalPlay);
        }
    }

    handleMediaError() {
        const now = Date.now();
        const minRecoverInterval = 3000;

        if (!this.recoverDecodingErrorDate || (now - this.recoverDecodingErrorDate) > minRecoverInterval) {
            this.recoverDecodingErrorDate = now;
            this.hls.recoverMediaError();
        } else if (!this.recoverSwapAudioCodecDate || (now - this.recoverSwapAudioCodecDate) > minRecoverInterval) {
            this.recoverSwapAudioCodecDate = now;
            this.hls.swapAudioCodec();
            this.hls.recoverMediaError();
        } else {
            this.hls.destroy();
        }
    }

    dispose() {
        if (this.hls instanceof Hls) {
            this.hls.destroy();
            if (this.hls.bufferTimer) {
                clearInterval(this.hls.bufferTimer);
                this.hls.bufferTimer = undefined;
            }
        }
        this.hls = null;
    }

    static canPlay(src, type) {
        const fileExtReg = /\.m3u8?/i;
        const typeReg = /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i;

        return Hls.isSupported() && (typeReg.test(type) || fileExtReg.test(src));
    }
}

MediaSourceHandler.register(HlsHandler, {name: 'hls'});


