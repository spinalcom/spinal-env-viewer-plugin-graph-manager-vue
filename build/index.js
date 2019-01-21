"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _store.default;
  }
});
exports.GraphManagerVue = void 0;

var _store = _interopRequireDefault(require("./store"));

var _App = _interopRequireDefault(require("./App.vue"));

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let GraphManagerVue = _vue.default.extend({
  render: h => h(_App.default),
  methods: {
    opened: function opened() {},
    closed: function closed() {},
    removed: function removed() {}
  },
  store: _store.default
});

exports.GraphManagerVue = GraphManagerVue;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJHcmFwaE1hbmFnZXJWdWUiLCJWdWUiLCJleHRlbmQiLCJyZW5kZXIiLCJoIiwiQXBwIiwibWV0aG9kcyIsIm9wZW5lZCIsImNsb3NlZCIsInJlbW92ZWQiLCJzdG9yZSIsIlN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFJQSxlQUFlLEdBQUdDLGFBQUlDLE1BQUosQ0FBWTtBQUNoQ0MsRUFBQUEsTUFBTSxFQUFFQyxDQUFDLElBQUlBLENBQUMsQ0FBRUMsWUFBRixDQURrQjtBQUVoQ0MsRUFBQUEsT0FBTyxFQUFFO0FBQ1BDLElBQUFBLE1BQU0sRUFBRSxrQkFBWSxDQUVuQixDQUhNO0FBSVBDLElBQUFBLE1BQU0sRUFBRSxrQkFBWSxDQUVuQixDQU5NO0FBT1BDLElBQUFBLE9BQU8sRUFBRSxtQkFBWSxDQUNwQjtBQVJNLEdBRnVCO0FBWWhDQyxFQUFBQSxLQUFLLEVBQUVDO0FBWnlCLENBQVosQ0FBdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RvcmUgZnJvbSAnLi9zdG9yZSc7XG5pbXBvcnQgQXBwIGZyb20gJy4vQXBwLnZ1ZSc7XG5pbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG5cbmxldCBHcmFwaE1hbmFnZXJWdWUgPSBWdWUuZXh0ZW5kKCB7XG4gIHJlbmRlcjogaCA9PiBoKCBBcHAgKSxcbiAgbWV0aG9kczoge1xuICAgIG9wZW5lZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBjbG9zZWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24gKCkge1xuICAgIH1cbiAgfSxcbiAgc3RvcmU6IFN0b3JlXG59ICk7XG5cbmV4cG9ydCB7XG4gIEdyYXBoTWFuYWdlclZ1ZSxcbiAgU3RvcmVcbn07XG5cbiJdfQ==