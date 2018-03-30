/**
 * @file larkplayer hls plugin
 * @author yuhui06
 * @date 2018/3/23
 */


import larkplayer from 'larkplayer';
import Hls from 'hls.js';

const larkplayerHlsHandler = {
    name: 'hls',
    mimeTypeRe: /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i,
    fileExtRe: /\.m3u8?/i,
    hls: null,
    canHandleSource(source = {}) {
        source.type = source.type + '';
        source.src = source.src + '';

        const canPlay = this.mimeTypeRe.test(source.type) || this.fileExtRe.test(source.src);
        return canPlay && Hls && Hls.isSupported();
    },
    handleSource(source = {}, player, options = {}) {
        player.isReady = false;

        if (this.hls) {
            this.dispose();
        }

        this.hls = new Hls(options);
        this.hls.attachMedia(player.tech.el);
        this.hls.loadSource(source.src);

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
    },
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
    },
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
};

if (Hls && Hls.isSupported()) {
    larkplayer.Html5.registerMediaSourceHandler(larkplayerHlsHandler);
}


