(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayerHls = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

var _larkplayer = (typeof window !== "undefined" ? window['larkplayer'] : typeof global !== "undefined" ? global['larkplayer'] : null);

var _larkplayer2 = _interopRequireDefault(_larkplayer);

var _hls = (typeof window !== "undefined" ? window['Hls'] : typeof global !== "undefined" ? global['Hls'] : null);

var _hls2 = _interopRequireDefault(_hls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function larkplayerHls() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hls = new _hls2.default(options);
    var player = this.player;

    var videoEl = player.tech.el;
    var src = player.src();

    if (/\.m3u8?$/.test(src)) {
        hls.attachMedia(videoEl);
        hls.on(_hls2.default.Events.MEDIA_ATTACHED, function () {
            console.log("video and hls.js are now bound together !");

            hls.loadSource(src);
            hls.on(_hls2.default.Events.MANIFEST_PARSED, function (event, data) {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
                if (this.player.autoplay()) {
                    this.player.play();
                }
            });
        });
    }
}

_larkplayer2.default.registerPlugin('hls', larkplayerHls);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
