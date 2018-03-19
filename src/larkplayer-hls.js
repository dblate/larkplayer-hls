import larkplayer from 'larkplayer';
import Hls from 'hls.js';

function larkplayerHls(options = {}) {
    const hls = new Hls(options);
    const player = this.player;

    const videoEl = player.tech.el;
    const src = player.src();

    if (/\.m3u8?$/.test(src)) {
        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("video and hls.js are now bound together !");

            hls.loadSource(src);
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
                if (this.player.autoplay()) {
                    this.player.play();
                }
            });
        });
    }
}

larkplayer.registerPlugin('hls', larkplayerHls);