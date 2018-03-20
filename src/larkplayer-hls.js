import larkplayer from 'larkplayer';
import Hls from 'hls.js';

let recoverDecodingErrorDate;
let recoverSwapAudioCodecDate;
function handleMediaError() {
    const now = Date.now();
    const minRecoverInterval = 3000;
    if (!recoverDecodingErrorDate || (now - recoverDecodingErrorDate) > minRecoverInterval) {
        recoverDecodingErrorDate = Date.now();
        hls.recoverMediaError();
    } else if (!recoverSwapAudioCodecDate || (now - recoverSwapAudioCodecDate) > minRecoverInterval) {
        recoverSwapAudioCodecDate = Date.now();
        hls.swapAudioCodec();
        hls.recoverMediaError();
    } else {
        hls.destroy();
    }
}

function larkplayerHls(options = {debug: true}) {
    let hls = null;
    const player = this.player;
    const originalPlay = player.play.bind(this);
    const hlsMimeType = 'application/vnd.apple.mpegurl';

    function hlsPlay(src) {
        if (!/\.m3u8?$/.test(src)) {
            originalPlay();
            return;
        }

        const videoEl = player.tech.el;
        if (videoEl.canPlayType(hlsMimeType)) {
            originalPlay();
        } else if (Hls.isSupported()) {
            if (hls) {
                hls.detachMedia();
                hls.destroy();
                if (hls.bufferTimer) {
                    clearInterval(hls.bufferTimer);
                    hls.bufferTimer = undefined;
                }
                hls = null;
            }

            hls = new Hls(options);
            hls.attachMedia(videoEl);
            hls.loadSource(src);

            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                // console.log('media attached');
            });

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                // console.log("manifest loaded, found " + data.levels.length + " quality level");
                originalPlay();
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                // console.warn(data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            handleMediaError();
                            break;
                        case Hls.ErrorTypes.NETWORK_ERROR:
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });
        } else {
            originalPlay();
        }
    }

    player.play = function () {
        setTimeout(() => {
            hlsPlay(player.src());
        }, 0);
    }
}

larkplayer.registerPlugin('hls', larkplayerHls);