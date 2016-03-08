'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Serial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raspiPeripheral = require('raspi-peripheral');

var _serialport = require('serialport');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               The MIT License (MIT)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Copyright (c) 2016 Bryan Hughes <bryan@nebri.us>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               Permission is hereby granted, free of charge, to any person obtaining a copy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               of this software and associated documentation files (the "Software"), to deal
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               in the Software without restriction, including without limitation the rights
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               copies of the Software, and to permit persons to whom the Software is
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               furnished to do so, subject to the following conditions:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               The above copyright notice and this permission notice shall be included in
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               all copies or substantial portions of the Software.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               THE SOFTWARE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var DEFAULT_PORT = '/dev/ttyAMA0';

var portId = Symbol('portId');
var options = Symbol('options');
var portInstance = Symbol('portInstance');
var isOpen = Symbol('isOpen');

var Serial = exports.Serial = function (_Peripheral) {
  _inherits(Serial, _Peripheral);

  function Serial() {
    var port = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_PORT : arguments[0];

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$baudRate = _ref.baudRate;
    var baudRate = _ref$baudRate === undefined ? 9600 : _ref$baudRate;
    var _ref$dataBits = _ref.dataBits;
    var dataBits = _ref$dataBits === undefined ? 8 : _ref$dataBits;
    var _ref$stopBits = _ref.stopBits;
    var stopBits = _ref$stopBits === undefined ? 1 : _ref$stopBits;
    var _ref$parity = _ref.parity;
    var parity = _ref$parity === undefined ? 'none' : _ref$parity;

    _classCallCheck(this, Serial);

    var pins = [];
    if (port === DEFAULT_PORT) {
      pins.push('TXD0', 'RXD0');
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Serial).call(this, pins));

    _this[portId] = port;
    _this[options] = {
      baudRate: baudRate,
      dataBits: dataBits,
      stopBits: stopBits,
      parity: parity
    };
    return _this;
  }

  _createClass(Serial, [{
    key: 'destroy',
    value: function destroy() {
      this.close();
    }
  }, {
    key: 'open',
    value: function open(cb) {
      var _this2 = this;

      if (this[isOpen]) {
        setImmediate(cb);
        return;
      }
      this[portInstance] = new _serialport.SerialPort(this[portId], this[options]);
      this[portInstance].on('open', function () {
        _this2[portInstance].on('data', function (data) {
          _this2.emit('data', data);
        });
        _this2[isOpen] = true;
        cb();
      });
    }
  }, {
    key: 'close',
    value: function close(cb) {
      if (!this[isOpen]) {
        setImmediate(cb);
        return;
      }
      this[isOpen] = false;
      this[portInstance].close(cb);
    }
  }, {
    key: 'write',
    value: function write(data) {
      if (!this[isOpen]) {
        throw new Error('Attempted to write to a closed serial port');
      }
      this[portInstance].write(data);
    }
  }]);

  return Serial;
}(_raspiPeripheral.Peripheral);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLElBQU0sZUFBZSxjQUFmOztBQUVOLElBQU0sU0FBUyxPQUFPLFFBQVAsQ0FBVDtBQUNOLElBQU0sVUFBVSxPQUFPLFNBQVAsQ0FBVjtBQUNOLElBQU0sZUFBZSxPQUFPLGNBQVAsQ0FBZjtBQUNOLElBQU0sU0FBUyxPQUFPLFFBQVAsQ0FBVDs7SUFFTzs7O0FBRVgsV0FGVyxNQUVYLEdBQXdHO1FBQTVGLDZEQUFPLDRCQUFxRjs7cUVBQUosa0JBQUk7OzZCQUFyRSxTQUFxRTtRQUFyRSx5Q0FBVyxxQkFBMEQ7NkJBQXBELFNBQW9EO1FBQXBELHlDQUFXLGtCQUF5Qzs2QkFBdEMsU0FBc0M7UUFBdEMseUNBQVcsa0JBQTJCOzJCQUF4QixPQUF3QjtRQUF4QixxQ0FBUyxxQkFBZTs7MEJBRjdGLFFBRTZGOztBQUN0RyxRQUFNLE9BQU8sRUFBUCxDQURnRztBQUV0RyxRQUFJLFNBQVMsWUFBVCxFQUF1QjtBQUN6QixXQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLE1BQWxCLEVBRHlCO0tBQTNCOzt1RUFKUyxtQkFPSCxPQUxnRzs7QUFNdEcsVUFBSyxNQUFMLElBQWUsSUFBZixDQU5zRztBQU90RyxVQUFLLE9BQUwsSUFBZ0I7QUFDZCx3QkFEYztBQUVkLHdCQUZjO0FBR2Qsd0JBSGM7QUFJZCxvQkFKYztLQUFoQixDQVBzRzs7R0FBeEc7O2VBRlc7OzhCQWlCRDtBQUNSLFdBQUssS0FBTCxHQURROzs7O3lCQUlMLElBQUk7OztBQUNQLFVBQUksS0FBSyxNQUFMLENBQUosRUFBa0I7QUFDaEIscUJBQWEsRUFBYixFQURnQjtBQUVoQixlQUZnQjtPQUFsQjtBQUlBLFdBQUssWUFBTCxJQUFxQiwyQkFBZSxLQUFLLE1BQUwsQ0FBZixFQUE2QixLQUFLLE9BQUwsQ0FBN0IsQ0FBckIsQ0FMTztBQU1QLFdBQUssWUFBTCxFQUFtQixFQUFuQixDQUFzQixNQUF0QixFQUE4QixZQUFNO0FBQ2xDLGVBQUssWUFBTCxFQUFtQixFQUFuQixDQUFzQixNQUF0QixFQUE4QixVQUFDLElBQUQsRUFBVTtBQUN0QyxpQkFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixJQUFsQixFQURzQztTQUFWLENBQTlCLENBRGtDO0FBSWxDLGVBQUssTUFBTCxJQUFlLElBQWYsQ0FKa0M7QUFLbEMsYUFMa0M7T0FBTixDQUE5QixDQU5POzs7OzBCQWVILElBQUk7QUFDUixVQUFJLENBQUMsS0FBSyxNQUFMLENBQUQsRUFBZTtBQUNqQixxQkFBYSxFQUFiLEVBRGlCO0FBRWpCLGVBRmlCO09BQW5CO0FBSUEsV0FBSyxNQUFMLElBQWUsS0FBZixDQUxRO0FBTVIsV0FBSyxZQUFMLEVBQW1CLEtBQW5CLENBQXlCLEVBQXpCLEVBTlE7Ozs7MEJBU0osTUFBTTtBQUNWLFVBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBRCxFQUFlO0FBQ2pCLGNBQU0sSUFBSSxLQUFKLENBQVUsNENBQVYsQ0FBTixDQURpQjtPQUFuQjtBQUdBLFdBQUssWUFBTCxFQUFtQixLQUFuQixDQUF5QixJQUF6QixFQUpVOzs7O1NBN0NEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKGMpIDIwMTYgQnJ5YW4gSHVnaGVzIDxicnlhbkBuZWJyaS51cz5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgUGVyaXBoZXJhbCB9IGZyb20gJ3Jhc3BpLXBlcmlwaGVyYWwnO1xuaW1wb3J0IHsgU2VyaWFsUG9ydCB9IGZyb20gJ3NlcmlhbHBvcnQnO1xuXG5jb25zdCBERUZBVUxUX1BPUlQgPSAnL2Rldi90dHlBTUEwJztcblxuY29uc3QgcG9ydElkID0gU3ltYm9sKCdwb3J0SWQnKTtcbmNvbnN0IG9wdGlvbnMgPSBTeW1ib2woJ29wdGlvbnMnKTtcbmNvbnN0IHBvcnRJbnN0YW5jZSA9IFN5bWJvbCgncG9ydEluc3RhbmNlJyk7XG5jb25zdCBpc09wZW4gPSBTeW1ib2woJ2lzT3BlbicpO1xuXG5leHBvcnQgY2xhc3MgU2VyaWFsIGV4dGVuZHMgUGVyaXBoZXJhbCB7XG5cbiAgY29uc3RydWN0b3IocG9ydCA9IERFRkFVTFRfUE9SVCwgeyBiYXVkUmF0ZSA9IDk2MDAsIGRhdGFCaXRzID0gOCwgc3RvcEJpdHMgPSAxLCBwYXJpdHkgPSAnbm9uZScgfSA9IHt9KSB7XG4gICAgY29uc3QgcGlucyA9IFtdO1xuICAgIGlmIChwb3J0ID09PSBERUZBVUxUX1BPUlQpIHtcbiAgICAgIHBpbnMucHVzaCgnVFhEMCcsICdSWEQwJyk7XG4gICAgfVxuICAgIHN1cGVyKHBpbnMpO1xuICAgIHRoaXNbcG9ydElkXSA9IHBvcnQ7XG4gICAgdGhpc1tvcHRpb25zXSA9IHtcbiAgICAgIGJhdWRSYXRlLFxuICAgICAgZGF0YUJpdHMsXG4gICAgICBzdG9wQml0cyxcbiAgICAgIHBhcml0eVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgb3BlbihjYikge1xuICAgIGlmICh0aGlzW2lzT3Blbl0pIHtcbiAgICAgIHNldEltbWVkaWF0ZShjYik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXNbcG9ydEluc3RhbmNlXSA9IG5ldyBTZXJpYWxQb3J0KHRoaXNbcG9ydElkXSwgdGhpc1tvcHRpb25zXSk7XG4gICAgdGhpc1twb3J0SW5zdGFuY2VdLm9uKCdvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpc1twb3J0SW5zdGFuY2VdLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdkYXRhJywgZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXNbaXNPcGVuXSA9IHRydWU7XG4gICAgICBjYigpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xvc2UoY2IpIHtcbiAgICBpZiAoIXRoaXNbaXNPcGVuXSkge1xuICAgICAgc2V0SW1tZWRpYXRlKGNiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpc1tpc09wZW5dID0gZmFsc2U7XG4gICAgdGhpc1twb3J0SW5zdGFuY2VdLmNsb3NlKGNiKTtcbiAgfVxuXG4gIHdyaXRlKGRhdGEpIHtcbiAgICBpZiAoIXRoaXNbaXNPcGVuXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gd3JpdGUgdG8gYSBjbG9zZWQgc2VyaWFsIHBvcnQnKTtcbiAgICB9XG4gICAgdGhpc1twb3J0SW5zdGFuY2VdLndyaXRlKGRhdGEpO1xuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==