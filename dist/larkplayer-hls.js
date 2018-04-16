(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayerHls = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _larkplayer = require('larkplayer');

var _hls = require('hls.js');

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file larkplayer hls 插件，使得 larkplayer 可以播放 m3u8 视频
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/23
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/4/16 根据 larkplayer 接口变化更改插件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var HlsHandler = function (_MediaSourceHandler) {
    _inherits(HlsHandler, _MediaSourceHandler);

    function HlsHandler(player, options) {
        _classCallCheck(this, HlsHandler);

        var _this = _possibleConstructorReturn(this, _MediaSourceHandler.call(this, player, options));

        _this.player.isReady = false;
        _this.hls = new _hls2['default'](options);

        _this.hls.on(_hls2['default'].Events.MANIFEST_PARSED, function (event, data) {
            player.triggerReady();
        });

        _this.hls.on(_hls2['default'].Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case _hls2['default'].ErrorTypes.MEDIA_ERROR:
                        _this.handleMediaError();
                        break;
                    case _hls2['default'].ErrorTypes.NETWORK_ERROR:
                    default:
                        _this.hls.destroy();
                        break;
                }
            }
        });
        return _this;
    }

    HlsHandler.prototype.src = function src(_src) {
        this.player.isReady = false;
        this.hls.attachMedia(this.player.tech.el);
        this.hls.loadSource(_src);
    };

    HlsHandler.prototype.internalPlay = function internalPlay() {
        var playReturn = this.player.techGet('play');
        if (playReturn && playReturn.then) {
            playReturn.then(null, function (err) {
                console && console.error && console.error(err);
            });
        }
    };

    HlsHandler.prototype.play = function play() {
        if (this.player.isReady) {
            this.internalPlay();
        } else {
            this.player.ready(this.internalPlay);
        }
    };

    HlsHandler.prototype.handleMediaError = function handleMediaError() {
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
    };

    HlsHandler.prototype.dispose = function dispose() {
        if (this.hls instanceof _hls2['default']) {
            this.hls.destroy();
            if (this.hls.bufferTimer) {
                clearInterval(this.hls.bufferTimer);
                this.hls.bufferTimer = undefined;
            }
        }
        this.hls = null;
    };

    HlsHandler.canPlay = function canPlay(src, type) {
        var fileExtReg = /\.m3u8?/i;
        var typeReg = /application\/((x-mpegURL)|(vnd\.apple\.mpegurl))/i;

        return _hls2['default'].isSupported() && (typeReg.test(type) || fileExtReg.test(src));
    };

    return HlsHandler;
}(_larkplayer.MediaSourceHandler);

exports['default'] = HlsHandler;


_larkplayer.MediaSourceHandler.register(HlsHandler, { name: 'hls' });

},{"hls.js":"hls.js","larkplayer":"larkplayer"}]},{},[1])(1)
});
