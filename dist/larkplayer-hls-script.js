(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayerHls = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _larkplayer = (typeof window !== "undefined" ? window['larkplayer'] : typeof global !== "undefined" ? global['larkplayer'] : null);

var _larkplayer2 = _interopRequireDefault(_larkplayer);

var _hls = (typeof window !== "undefined" ? window['Hls'] : typeof global !== "undefined" ? global['Hls'] : null);

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file larkplayer hls plugin
 * @author yuhui06
 * @date 2018/3/23
 */

var larkplayerHlsHandler = {
    name: 'hls',
    mimeTypeRe: /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i,
    fileExtRe: /\.m3u8?/i,
    hls: null,
    canHandleSource: function canHandleSource() {
        var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        source.type = source.type + '';
        source.src = source.src + '';

        var canPlay = this.mimeTypeRe.test(source.type) || this.fileExtRe.test(source.src);
        return canPlay;
    },
    handleSource: function handleSource() {
        var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var _this = this;

        var player = arguments[1];
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        player.isReady = false;

        if (this.hls) {
            this.dispose();
        }

        this.hls = new _hls2.default(options);
        this.hls.attachMedia(player.tech.el);
        this.hls.loadSource(source.src);

        this.hls.on(_hls2.default.Events.MANIFEST_PARSED, function (event, data) {
            player.triggerReady();
        });

        this.hls.on(_hls2.default.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case _hls2.default.ErrorTypes.MEDIA_ERROR:
                        _this.handleMediaError();
                        break;
                    case _hls2.default.ErrorTypes.NETWORK_ERROR:
                    default:
                        _this.hls.destroy();
                        break;
                }
            }
        });
    },
    handleMediaError: function handleMediaError() {
        var now = Date.now();
        var minRecoverInterval = 3000;

        if (!this.recoverDecodingErrorDate || now - this.recoverDecodingErrorDate > minRecoverInterval) {
            this.recoverDecodingErrorDate = now;
            this.hls.recoverMediaError();
        } else if (!this.recoverSwapAudioCodecDate || now - this.recoverSwapAudioCodecDate > minRecoverInterval) {
            this.recoverSwapAudioCodecDate = now;
            this.hls.swapAudioCodec();
            this.hls.recoverMediaError();
        } else {
            this.hls.destroy();
        }
    },
    dispose: function dispose() {
        if (this.hls instanceof _hls2.default) {
            this.hls.destroy();
            if (this.hls.bufferTimer) {
                clearInterval(this.hls.bufferTimer);
                this.hls.bufferTimer = undefined;
            }
        }
        this.hls = null;
    }
};

_larkplayer2.default.Html5.registerMediaSourceHandler(larkplayerHlsHandler);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
