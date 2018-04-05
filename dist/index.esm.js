import React from 'react';
import Unsplash from 'unsplash-js';
import propTypes from 'prop-types';
import Spinner from 'react-svg-spinner';
import 'intersection-observer';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function toJson(response) {
  return response.json();
}

function debounce(wait, func) {
  var timeout = null;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);

    timeout = setTimeout(function () {
      return func.apply(undefined, args);
    }, wait);
  };
}

function throttle(wait, func) {
  var timeout = null;
  var latestArgs = null;

  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    latestArgs = args;
    if (timeout) return; // do nothing, we're waiting for the timeout to fire

    func.apply(undefined, toConsumableArray(latestArgs));

    timeout = setTimeout(function () {
      clearTimeout(timeout);
      timeout = null;
      func.apply(undefined, toConsumableArray(latestArgs));
    }, wait);
  };
}

function withDefaultProps(Component, defaultProps) {
  var WrappedComponent = function WrappedComponent(props) {
    return React.createElement(Component, _extends({}, defaultProps, props));
  };

  WrappedComponent.displayName = "withDefaultProps(" + Component.name + ")";

  return WrappedComponent;
}

var ChaosMonkey = function () {
  function ChaosMonkey(shouldDoAnything) {
    var _this = this;

    classCallCheck(this, ChaosMonkey);

    if (shouldDoAnything) {
      this.process = function (r) {
        return Math.random() > 0.5 ? _this.failResponse(r) : r;
      };
    } else {
      this.process = function (r) {
        return r;
      };
    }
  }

  createClass(ChaosMonkey, [{
    key: "failResponse",
    value: function failResponse(_response) {
      var errors = [[400, "bad request"], [503, "gateway timeout"], [500, "server error"], [401, "not authorized"]];
      var error = errors[Math.round(Math.random() * (errors.length - 1))];
      return new Response(JSON.stringify({}), { status: error[0], statusText: error[1] });
    }
  }]);
  return ChaosMonkey;
}();

var UnsplashWrapper = function () {
  function UnsplashWrapper(_ref) {
    var _this2 = this;

    var accessKey = _ref.accessKey,
        _ref$__debug_chaosMon = _ref.__debug_chaosMonkey,
        __debug_chaosMonkey = _ref$__debug_chaosMon === undefined ? false : _ref$__debug_chaosMon;

    classCallCheck(this, UnsplashWrapper);

    this.listPhotos = function (page, perPage) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "popular";

      return _this2.unsplash.photos.listPhotos(page, perPage, type).then(_this2.processResponse);
    };

    this.searchPhotos = function (search, page, perPage) {
      return _this2.unsplash.search.photos(search, page, perPage).then(_this2.processResponse);
    };

    this.downloadPhoto = function (photo) {
      return _this2.unsplash.photos.downloadPhoto(photo).then(_this2.processResponse);
    };

    this.processResponse = function (incomingResponse) {
      var response = Promise.resolve(_this2.__debug_chaosMonkey.process(incomingResponse));

      return response.then(_this2.handleErrors).then(toJson);
    };

    this.__debug_chaosMonkey = new ChaosMonkey(__debug_chaosMonkey);
    this.unsplash = new Unsplash({ applicationId: accessKey });
  }

  createClass(UnsplashWrapper, [{
    key: "handleErrors",
    value: function handleErrors(response) {
      if (!response.ok) {
        var error = Error(response.statusText);
        error.status = response.status;
        throw error;
      }

      return response;
    }
  }]);
  return UnsplashWrapper;
}();

var number = propTypes.number,
    object = propTypes.object,
    string = propTypes.string,
    oneOfType = propTypes.oneOfType;


SearchIcon.propTypes = {
  width: oneOfType([number, string]),
  height: oneOfType([number, string]),
  style: object
};

function SearchIcon(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === undefined ? 32 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 32 : _ref$height,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;

  return React.createElement(
    "svg",
    { width: width, height: height, style: style, viewBox: "0 0 16.7 16.7" },
    React.createElement("path", {
      style: { fill: "currentColor" },
      d: "M16.7,15.3l-4.2-4.2c2-2.7,1.8-6.6-0.7-9.1c-1.4-1.4-3.1-2-4.9-2C5.2,0,3.4,0.7,2,2c-2.7,2.7-2.7,7.1,0,9.8 c1.4,1.4,3.1,2,4.9,2c1.5,0,2.9-0.5,4.1-1.4l4.2,4.2L16.7,15.3z M3.4,10.4c-1.9-1.9-1.9-5.1,0-7C4.4,2.5,5.6,2,6.9,2 c1.3,0,2.6,0.5,3.5,1.4c1.9,1.9,1.9,5.1,0,7c-0.9,0.9-2.2,1.4-3.5,1.4S4.4,11.4,3.4,10.4z"
    })
  );
}

var number$1 = propTypes.number,
    object$1 = propTypes.object,
    string$1 = propTypes.string,
    oneOfType$1 = propTypes.oneOfType;


SearchIcon$1.propTypes = {
  width: oneOfType$1([number$1, string$1]),
  height: oneOfType$1([number$1, string$1]),
  style: object$1
};

function SearchIcon$1(_ref) {
  var _ref$width = _ref.width,
      _ref$height = _ref.height,
      _ref$style = _ref.style;

  return React.createElement(
    "svg",
    { width: "14px", height: "14px", viewBox: "0 0 14 14" },
    React.createElement(
      "g",
      null,
      React.createElement("polygon", { style: { fill: "currentColor" }, points: "4,10.9 8.8,6 8.8,8.5 10.3,8.5 10.3,3.5 5.3,3.5 5.3,5 7.8,5 2.9,9.8 \t" }),
      React.createElement("path", { style: { fill: "currentColor" }, d: "M13,0H1C0.4,0,0,0.4,0,1v12c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V1C14,0.4,13.6,0,13,0z M12.5,12.5h-11v-11h11V12.5z" })
    )
  );
}

var string$2 = propTypes.string,
    object$2 = propTypes.object;


var blank = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

var SpinnerImg = function (_React$Component) {
  inherits(SpinnerImg, _React$Component);

  function SpinnerImg() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, SpinnerImg);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = SpinnerImg.__proto__ || Object.getPrototypeOf(SpinnerImg)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(SpinnerImg, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.img = new Image();
      this.img.onload = function () {
        _this2.setState({ loaded: true });
      };
      this.img.src = this.props.src;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.img.onload = function () {
        return undefined;
      };
    }
  }, {
    key: "render",
    value: function render() {
      var loaded = this.state.loaded;
      var _props = this.props,
          src = _props.src,
          style = _props.style,
          rest = objectWithoutProperties(_props, ["src", "style"]);


      return React.createElement(
        "div",
        { className: "p-r" },
        React.createElement("img", _extends({}, rest, {
          src: this.state.loaded ? src : blank,
          style: _extends({}, style, {
            transition: "opacity .3s, " + style.transition,
            opacity: loaded ? 1 : 0
          })
        })),
        loaded || React.createElement(
          "div",
          {
            className: "p-a",
            style: {
              width: "40px",
              height: "40px",
              top: "50%",
              left: "50%",
              margin: "-20px 0 0 -20px"
            }
          },
          React.createElement(Spinner, { size: "40px", color: "rgba(0,0,0,0.5)" })
        )
      );
    }
  }]);
  return SpinnerImg;
}(React.Component);

SpinnerImg.propTypes = {
  src: string$2.isRequired,
  style: object$2
};
SpinnerImg.defaultProps = { style: {} };

var instanceOf = propTypes.instanceOf,
    func = propTypes.func,
    node = propTypes.node;

var ReactIntersectionObserver = function (_React$Component) {
  inherits(ReactIntersectionObserver, _React$Component);

  function ReactIntersectionObserver() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ReactIntersectionObserver);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ReactIntersectionObserver.__proto__ || Object.getPrototypeOf(ReactIntersectionObserver)).call.apply(_ref, [this].concat(args))), _this), _this.handleObserverFired = function (observations) {
      var lastObservation = observations[observations.length - 1];

      _this.props.onIntersectionChange(lastObservation.isIntersecting);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ReactIntersectionObserver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.observer = new IntersectionObserver(this.handleObserverFired, {
        root: this.props.root,
        rootMargin: "0px",
        threshold: [0, 0.25]
      });

      this.observer.observe(this.element);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.observer.unobserve(this.element);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _root = _props.root,
          _onIntersectionChange = _props.onIntersectionChange,
          children = _props.children,
          rest = objectWithoutProperties(_props, ["root", "onIntersectionChange", "children"]);


      return React.createElement(
        "div",
        _extends({ ref: function ref(element) {
            return _this2.element = element;
          } }, rest),
        children
      );
    }
  }]);
  return ReactIntersectionObserver;
}(React.Component);

ReactIntersectionObserver.propTypes = {
  root: instanceOf(HTMLElement),
  onIntersectionChange: func.isRequired,
  children: node.isRequired
};

var shape = propTypes.shape,
    string$3 = propTypes.string,
    func$1 = propTypes.func;

var BlobUploader = function (_React$Component) {
  inherits(BlobUploader, _React$Component);

  function BlobUploader() {
    classCallCheck(this, BlobUploader);
    return possibleConstructorReturn(this, (BlobUploader.__proto__ || Object.getPrototypeOf(BlobUploader)).apply(this, arguments));
  }

  createClass(BlobUploader, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var prevPhoto = this.props.unsplashPhoto;
      var nextPhoto = nextProps.unsplashPhoto;
      if ((prevPhoto && prevPhoto.id) === (nextPhoto && nextPhoto.id)) return;

      nextProps.downloadPhoto(nextPhoto).then(function (r) {
        return r.blob();
      }).then(this.props.onBlobLoaded).then(this.props.onFinishedUploading);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return BlobUploader;
}(React.Component);

BlobUploader.propTypes = {
  unsplashPhoto: shape({
    id: string$3.isRequired,
    links: shape({
      download: string$3.isRequired,
      download_location: string$3.isRequired
    }).isRequired
  }),
  downloadPhoto: func$1.isRequired,
  onFinishedUploading: func$1.isRequired,
  onBlobLoaded: func$1.isRequired
};

var string$4 = propTypes.string,
    func$2 = propTypes.func,
    shape$1 = propTypes.shape;

var DataTransferUploader = function (_React$Component) {
  inherits(DataTransferUploader, _React$Component);

  function DataTransferUploader() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, DataTransferUploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = DataTransferUploader.__proto__ || Object.getPrototypeOf(DataTransferUploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = { blob: null }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(DataTransferUploader, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var prevPhoto = this.props.unsplashPhoto;
      var nextPhoto = nextProps.unsplashPhoto;
      if ((prevPhoto && prevPhoto.id) === (nextPhoto && nextPhoto.id)) return;

      nextProps.downloadPhoto(nextPhoto).then(function (r) {
        return r.blob();
      }).then(function (blob) {
        return _this2.setState({ blob: blob });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.input && this.state.blob) {
        var dt = new DataTransfer();
        dt.items.add(new File([this.state.blob], "image.jpg"));
        this.input.files = dt.files;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          unsplashPhoto = _props.unsplashPhoto,
          _downloadPhoto = _props.downloadPhoto,
          restProps = objectWithoutProperties(_props, ["unsplashPhoto", "downloadPhoto"]);
      var blob = this.state.blob;


      if (!(unsplashPhoto && blob)) return null;

      return React.createElement("input", _extends({ type: "file", name: "file", ref: function ref(input) {
          return _this3.input = input;
        } }, restProps));
    }
  }]);
  return DataTransferUploader;
}(React.Component);

DataTransferUploader.propTypes = {
  unsplashPhoto: shape$1({
    id: string$4.isRequired,
    links: shape$1({
      download: string$4.isRequired,
      download_location: string$4.isRequired
    }).isRequired
  }),
  downloadPhoto: func$2.isRequired
};

var shape$2 = propTypes.shape,
    string$5 = propTypes.string,
    func$3 = propTypes.func;

var Base64Uploader = function (_React$Component) {
  inherits(Base64Uploader, _React$Component);

  function Base64Uploader() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Base64Uploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Base64Uploader.__proto__ || Object.getPrototypeOf(Base64Uploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = { blob: null }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Base64Uploader, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var prevPhoto = this.props.unsplashPhoto;
      var nextPhoto = nextProps.unsplashPhoto;
      if ((prevPhoto && prevPhoto.id) === (nextPhoto && nextPhoto.id)) return;

      nextProps.downloadPhoto(nextPhoto).then(function (r) {
        return r.blob();
      }).then(function (blob) {
        return _this2.setState({ blob: blob });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this3 = this;

      if (this.input && this.state.blob) {
        var reader = new FileReader();
        reader.readAsDataURL(this.state.blob);
        reader.onloadend = function () {
          _this3.input.value = reader.result;
          _this3.props.onFinishedUploading();
        };
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          unsplashPhoto = _props.unsplashPhoto,
          _downloadPhoto = _props.downloadPhoto,
          _onFinishedUploading = _props.onFinishedUploading,
          restProps = objectWithoutProperties(_props, ["unsplashPhoto", "downloadPhoto", "onFinishedUploading"]);
      var blob = this.state.blob;


      if (!(unsplashPhoto && blob)) return null;

      return React.createElement("input", _extends({ type: "hidden", name: "file", ref: function ref(input) {
          return _this4.input = input;
        } }, restProps));
    }
  }]);
  return Base64Uploader;
}(React.Component);

Base64Uploader.propTypes = {
  unsplashPhoto: shape$2({
    id: string$5.isRequired,
    links: shape$2({
      download: string$5.isRequired,
      download_location: string$5.isRequired
    }).isRequired
  }),
  downloadPhoto: func$3.isRequired,
  onFinishedUploading: func$3.isRequired
};

var shape$3 = propTypes.shape,
    string$6 = propTypes.string,
    func$4 = propTypes.func;

var ExternalLocationUploader = function (_React$Component) {
  inherits(ExternalLocationUploader, _React$Component);

  function ExternalLocationUploader() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ExternalLocationUploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ExternalLocationUploader.__proto__ || Object.getPrototypeOf(ExternalLocationUploader)).call.apply(_ref, [this].concat(args))), _this), _this.handleBlobLoaded = function (blob) {
      var formData = new FormData();
      formData.append(_this.props.name, blob, "image.jpg");
      return fetch(_this.props.uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include"
      }).then(function (r) {
        var response = r.clone();
        return r.text().then(function () {
          return response;
        });
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(ExternalLocationUploader, [{
    key: "render",
    value: function render() {
      return React.createElement(BlobUploader, _extends({}, this.props, { onBlobLoaded: this.handleBlobLoaded }));
    }
  }]);
  return ExternalLocationUploader;
}(React.Component);

ExternalLocationUploader.propTypes = {
  unsplashPhoto: shape$3({
    id: string$6.isRequired,
    links: shape$3({
      download: string$6.isRequired,
      download_location: string$6.isRequired
    }).isRequired
  }),
  downloadPhoto: func$4.isRequired,
  onFinishedUploading: func$4.isRequired,
  uploadUrl: string$6.isRequired,
  name: string$6.isRequired
};

var string$7 = propTypes.string,
    func$5 = propTypes.func,
    number$2 = propTypes.number,
    bool = propTypes.bool,
    object$3 = propTypes.object,
    shape$4 = propTypes.shape;

function noop() {}

var inputNoAppearanceStyle = {
  border: "none",
  padding: 0,
  margin: 0,
  backgroundColor: "transparent",
  boxShadow: "none",
  fontSize: "1em",
  outline: "none"
};

var inputGray = "#AAA";
var inputDarkGray = "#555";
var borderRadius = 3;

var UnsplashPicker = function (_React$Component) {
  inherits(UnsplashPicker, _React$Component);

  function UnsplashPicker() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, UnsplashPicker);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = UnsplashPicker.__proto__ || Object.getPrototypeOf(UnsplashPicker)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      unsplash: null,
      photos: [],
      totalPhotosCount: null,
      isLoadingSearch: true,
      selectedPhoto: null,
      loadingPhoto: null,
      search: "",
      searchResultsWidth: null,
      isAtBottomOfSearchResults: true,
      page: 1,
      error: null
    }, _this.recalculateSearchResultsWidth = throttle(50, function () {
      _this.setState({ searchResultsWidth: _this.searchResults.getBoundingClientRect().width });
    }), _this.loadDefault = function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$append = _ref2.append,
          append = _ref2$append === undefined ? false : _ref2$append;

      var page = append ? _this.state.page : 1;
      _this.state.unsplash.listPhotos(page, _this.resultsPerPage).then(function (photos) {
        return _this.setState(function (prevState) {
          return {
            photos: append ? prevState.photos.concat(photos) : photos,
            isLoadingSearch: false,
            totalPhotosCount: null,
            error: null,
            page: page
          };
        }, append ? noop : _this.didFinishLoadingNewSearchResults);
      }).catch(function (e) {
        return _this.setState({ error: e.message, isLoadingSearch: false });
      });
    }, _this.doImmediateSearch = function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          append = _ref3.append;

      var _this$state = _this.state,
          search = _this$state.search,
          unsplash = _this$state.unsplash;


      if (_this.shouldShowDefault) {
        return _this.loadDefault({ append: append });
      }

      var page = append ? _this.state.page : 1;

      return unsplash.searchPhotos(search, _this.state.page, _this.resultsPerPage).then(function (response) {
        return _this.setState(function (prevState) {
          return {
            totalPhotosCount: response.total,
            photos: append ? prevState.photos.concat(response.results) : response.results,
            isLoadingSearch: false,
            error: null,
            page: page
          };
        }, append ? noop : _this.didFinishLoadingNewSearchResults);
      }).catch(function (e) {
        return _this.setState({ error: e.message, isLoadingSearch: false });
      });
    }, _this.doDebouncedSearch = debounce(400, _this.doImmediateSearch), _this.doSearch = function () {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$append = _ref4.append,
          append = _ref4$append === undefined ? false : _ref4$append;

      _this.setState({ isLoadingSearch: true });

      if (append) {
        _this.doImmediateSearch({ append: append });
      } else {
        _this.doDebouncedSearch();
      }
    }, _this.downloadPhoto = function (photo) {
      _this.setState({ loadingPhoto: photo });
      return _this.state.unsplash.downloadPhoto(photo).then(function (r) {
        return r.url;
      }).then(fetch).catch(function (e) {
        return _this.setState({ error: e.message, isLoadingSearch: false });
      });
    }, _this.handleSearchChange = function (e) {
      _this.setState({ search: e.target.value });
    }, _this.handleSearchWrapperClick = function () {
      _this.searchInput && _this.searchInput.focus();
    }, _this.handlePhotoClick = function (photo) {
      _this.setState({ selectedPhoto: photo });
    }, _this.handleFinishedUploading = function (response) {
      _this.setState({ loadingPhoto: null });
      _this.props.onFinishedUploading(response);
    }, _this.handleSearchResultsBottomIntersectionChange = function (isAtBottomOfSearchResults) {
      _this.setState({ isAtBottomOfSearchResults: isAtBottomOfSearchResults });

      if (isAtBottomOfSearchResults && !_this.state.isLoadingSearch && _this.hasMoreResults) {
        _this.setState(function (_ref5) {
          var page = _ref5.page;
          return { page: page + 1 };
        });
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(UnsplashPicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var unsplash = new UnsplashWrapper({
        accessKey: this.props.accessKey,
        __debug_chaosMonkey: this.props.__debug_chaosMonkey
      });

      this.setState({ unsplash: unsplash });
      this.doSearch();

      this.recalculateSearchResultsWidth();

      window.addEventListener("resize", this.recalculateSearchResultsWidth);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_prevProps, prevState) {
      var _state = this.state,
          search = _state.search,
          page = _state.page;


      if (search !== prevState.search) {
        this.doSearch();
      }

      if (search === prevState.search && page !== prevState.page) {
        this.doSearch({ append: true });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("resize", this.recalculateSearchResultsWidth);
    }
  }, {
    key: "didFinishLoadingNewSearchResults",
    value: function didFinishLoadingNewSearchResults() {
      this.searchResults.scrollTop = 0;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          Uploader = _props.Uploader,
          searchResultColumns = _props.columns,
          photoRatio = _props.photoRatio,
          highlightColor = _props.highlightColor,
          applicationName = _props.applicationName;
      var _state2 = this.state,
          photos = _state2.photos,
          search = _state2.search,
          selectedPhoto = _state2.selectedPhoto,
          loadingPhoto = _state2.loadingPhoto,
          totalPhotosCount = _state2.totalPhotosCount,
          isLoadingSearch = _state2.isLoadingSearch,
          isAtBottomOfSearchResults = _state2.isAtBottomOfSearchResults,
          searchResultsWidth = _state2.searchResultsWidth,
          error = _state2.error;


      var searchResultWidth = searchResultsWidth ? Math.floor(searchResultsWidth / searchResultColumns) : 100;
      var searchResultHeight = searchResultWidth / photoRatio;

      return React.createElement(
        ReactIntersectionObserver,
        {
          onIntersectionChange: this.recalculateSearchResultsWidth,
          style: { flexDirection: "column" },
          className: "unsplash-react d-f h-f p-0"
        },
        React.createElement(CSSStyles, null),
        React.createElement(
          "div",
          {
            className: "d-f",
            style: {
              padding: ".5em",
              border: "1px solid #DFDFDF",
              cursor: "text",
              borderRadius: "3px",
              fontSize: 13
            },
            onClick: this.handleSearchWrapperClick
          },
          React.createElement(SearchInputIcon, {
            isLoading: isLoadingSearch,
            hasError: !!error,
            style: { marginRight: ".5em" }
          }),
          React.createElement("input", {
            type: "text",
            value: search,
            placeholder: "Search Unsplash photos by topics or colors",
            onChange: this.handleSearchChange,
            style: inputNoAppearanceStyle,
            className: "f-1",
            ref: function ref(input) {
              return _this2.searchInput = input;
            }
          }),
          totalPhotosCount !== null && React.createElement(
            "span",
            { style: { color: inputDarkGray } },
            totalPhotosCount,
            " results"
          )
        ),
        React.createElement(
          "div",
          { className: "p-r f-1 border-radius", style: { marginTop: ".5em", overflow: "hidden" } },
          React.createElement(
            "div",
            {
              className: "h-f",
              style: { overflowY: "scroll" },
              ref: function ref(element) {
                return _this2.searchResults = element;
              }
            },
            error ? React.createElement(
              "div",
              { style: { textAlign: "center" } },
              React.createElement(
                "h1",
                null,
                "\uD83D\uDE2D"
              ),
              " ",
              React.createElement(
                "p",
                null,
                error
              )
            ) : [photos.map(function (photo, index) {
              return React.createElement(Photo, {
                key: photo.id,
                photo: photo,
                index: index,
                width: searchResultWidth,
                height: searchResultHeight,
                columns: searchResultColumns,
                loadingPhoto: loadingPhoto,
                selectedPhoto: selectedPhoto,
                onPhotoClick: _this2.handlePhotoClick,
                highlightColor: highlightColor,
                applicationName: applicationName
              });
            }), this.searchResults && React.createElement(
              ReactIntersectionObserver,
              {
                key: "intersectionObserver",
                root: this.searchResults,
                onIntersectionChange: this.handleSearchResultsBottomIntersectionChange,
                style: {
                  width: "100%",
                  textAlign: "center",
                  marginTop: this.hasMoreResults ? "2em" : ".5em",
                  height: this.hasMoreResults ? 50 : 1
                }
              },
              this.hasMoreResults && React.createElement(Spinner, { size: "40px" })
            )]
          ),
          React.createElement("div", {
            className: "p-a",
            style: {
              bottom: -0.5,
              left: 0,
              right: 0,
              height: 1,
              boxShadow: isAtBottomOfSearchResults && !this.hasMoreResults ? "0 0 0 0 rgba(0, 0, 0, .2)" : "0 0 10px 5px rgba(0, 0, 0, .2)",
              transition: "box-shadow .3s",
              zIndex: 2
            }
          })
        ),
        React.createElement(Uploader, {
          unsplashPhoto: selectedPhoto,
          downloadPhoto: this.downloadPhoto,
          onFinishedUploading: this.handleFinishedUploading
        })
      );
    }
  }, {
    key: "shouldShowDefault",
    get: function get$$1() {
      return this.state.search === "";
    }
  }, {
    key: "resultsPerPage",
    get: function get$$1() {
      return this.props.columns * 4;
    }
  }, {
    key: "totalResults",
    get: function get$$1() {
      return this.shouldShowDefault ? Infinity : this.state.totalPhotosCount;
    }
  }, {
    key: "hasMoreResults",
    get: function get$$1() {
      return this.totalResults > this.resultsPerPage * this.state.page;
    }
  }]);
  return UnsplashPicker;
}(React.Component);

UnsplashPicker.propTypes = {
  accessKey: string$7.isRequired,
  applicationName: string$7.isRequired,
  perPage: number$2.isRequired,
  Uploader: func$5,
  columns: number$2,
  photoRatio: number$2,
  highlightColor: string$7,
  onFinishedUploading: func$5,
  __debug_chaosMonkey: bool
};
UnsplashPicker.defaultProps = {
  Uploader: Base64Uploader,
  perPage: 12,
  columns: 3,
  photoRatio: 1.5,
  highlightColor: "#00adf0",
  onFinishedUploading: noop,
  __debug_chaosMonkey: false
};

function CSSStyles() {
  return React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: "\n        .unsplash-react, .unsplash-react * { box-sizing: border-box }\n        .unsplash-react input::placeholder {\n          color: " + inputGray + ";\n          opacity: 1;\n        }\n        @keyframes unsplash-react-fadein {\n          from { opacity: 0; }\n          to   { opacity: 1; }\n        }\n\n        .unsplash-react .p-r { position: relative; }\n        .unsplash-react .p-a { position: absolute; }\n\n        .unsplash-react.p-0,\n        .unsplash-react .p-0 { padding: 0; }\n\n        .unsplash-react .f-1 { flex: 1; }\n\n        .unsplash-react.d-f,\n        .unsplash-react .d-f { display: flex; }\n\n        .unsplash-react.h-f,\n        .unsplash-react .h-f { height: 100%; }\n\n        .unsplash-react.border-radius,\n        .unsplash-react .border-radius { border-radius: " + borderRadius + "px; }\n      "
    }
  });
}

SearchInputIcon.propTypes = { isLoading: bool.isRequired, hasError: bool.isRequired, style: object$3 };
function SearchInputIcon(_ref6) {
  var isLoading = _ref6.isLoading,
      hasError = _ref6.hasError,
      style = _ref6.style,
      rest = objectWithoutProperties(_ref6, ["isLoading", "hasError", "style"]);

  var searchColor = hasError ? "#D62828" : inputGray;
  var mergedStyle = _extends({ top: "0.15em", marginRight: ".5em" }, style);
  return React.createElement(
    "div",
    _extends({ className: "p-r", style: mergedStyle }, rest),
    isLoading ? React.createElement(Spinner, { size: "1em", color: searchColor }) : React.createElement(SearchIcon, { width: "1em", height: "1em", style: { color: searchColor } })
  );
}

AbsolutelyCentered.propTypes = { width: number$2.isRequired, height: number$2.isRequired };
function AbsolutelyCentered(_ref7) {
  var width = _ref7.width,
      height = _ref7.height,
      rest = objectWithoutProperties(_ref7, ["width", "height"]);

  return React.createElement("div", _extends({
    className: "p-a",
    style: {
      width: width,
      height: height,
      top: "50%",
      left: "50%",
      margin: "-" + height / 2 + "px 0 0 -" + width / 2 + "px"
    }
  }, rest));
}

OverflowFadeLink.propTypes = {
  href: string$7.isRequired,
  style: object$3.isRequired,
  wrapperClassName: string$7.isRequired
};
function OverflowFadeLink(_ref8) {
  var wrapperClassName = _ref8.wrapperClassName,
      _ref8$style = _ref8.style,
      style = _ref8$style === undefined ? {} : _ref8$style,
      rest = objectWithoutProperties(_ref8, ["wrapperClassName", "style"]);

  return React.createElement(
    "div",
    {
      className: "p-r " + wrapperClassName,
      style: {
        display: "block",
        overflow: "hidden",
        maxWidth: "100%"
      }
    },
    React.createElement("a", _extends({
      style: _extends({}, style, {
        display: "block",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        textDecoration: "underline",
        fontSize: 13
      })
    }, rest)),
    React.createElement("div", {
      className: "p-a",
      style: {
        right: -2,
        top: 0,
        bottom: 0,
        width: 1,
        boxShadow: "0 0 10px 10px white",
        zIndex: 1
      }
    })
  );
}

Photo.propTypes = {
  photo: shape$4({
    id: string$7.isRequired,
    urls: shape$4({
      small: string$7.isRequired
    }).isRequired,
    user: shape$4({ links: shape$4({ html: string$7.isRequired }).isRequired }).isRequired
  }).isRequired,
  width: number$2.isRequired,
  height: number$2.isRequired,
  index: number$2.isRequired,
  columns: number$2.isRequired,
  loadingPhoto: shape$4({ id: string$7.isRequired }),
  selectedPhoto: shape$4({ id: string$7.isRequired }),
  onPhotoClick: func$5.isRequired,
  highlightColor: string$7.isRequired,
  applicationName: string$7.isRequired
};
function Photo(_ref9) {
  var photo = _ref9.photo,
      width = _ref9.width,
      height = _ref9.height,
      index = _ref9.index,
      columns = _ref9.columns,
      loadingPhoto = _ref9.loadingPhoto,
      selectedPhoto = _ref9.selectedPhoto,
      onPhotoClick = _ref9.onPhotoClick,
      highlightColor = _ref9.highlightColor,
      applicationName = _ref9.applicationName;

  var isFarLeft = index % columns === 0;
  var loadingPhotoId = loadingPhoto && loadingPhoto.id;
  var selectedPhotoId = selectedPhoto && selectedPhoto.id;
  var isSelectedAndLoaded = loadingPhotoId === null && selectedPhotoId === photo.id;
  var borderWidth = 3;
  var utmParams = "utm_source=" + applicationName + "&utm_medium=referral";
  var onClick = function onClick() {
    return onPhotoClick(photo);
  };

  return React.createElement(
    "div",
    {
      style: {
        display: "inline-block",
        width: width,
        marginTop: 0,
        marginBottom: 12,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: ".5em",
        paddingLeft: isFarLeft || ".5em"
      },
      className: "p-0"
    },
    React.createElement(
      "div",
      {
        className: "p-r border-radius",
        style: {
          overflow: "hidden",
          transition: "box-shadow .3s",
          cursor: "pointer",
          width: "100%"
        },
        onClick: onClick
      },
      React.createElement(SpinnerImg, {
        src: photo.urls.small,
        style: {
          display: "block",
          width: "100%",
          height: height,
          objectFit: "cover",
          borderWidth: borderWidth,
          borderStyle: "solid",
          borderColor: isSelectedAndLoaded ? highlightColor : "transparent",
          borderRadius: borderRadius + borderWidth,
          transition: "border .3s"
        }
      }),
      loadingPhotoId === photo.id && React.createElement(
        "div",
        {
          className: "p-a",
          style: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.5)",
            animation: "unsplash-react-fadein .1s"
          }
        },
        React.createElement(
          AbsolutelyCentered,
          { height: 40, width: 40 },
          React.createElement(Spinner, { size: "40px", color: "rgba(255,255,255,0.8)" })
        )
      )
    ),
    React.createElement(
      "div",
      { className: "d-f", style: { padding: ".15em " + borderWidth + "px 0 " + borderWidth + "px" } },
      React.createElement(
        OverflowFadeLink,
        {
          href: photo.user.links.html + "?" + utmParams,
          target: "_blank",
          style: { color: inputGray },
          wrapperClassName: "f-1"
        },
        photo.user.name
      ),
      React.createElement(
        "a",
        {
          href: photo.links.html + "?" + utmParams,
          target: "_blank",
          style: {
            color: inputGray,
            textDecoration: "none",
            lineHeight: "10px",
            marginLeft: "1em",
            padding: 2,
            borderRadius: borderRadius - 1
          }
        },
        React.createElement(SearchIcon$1, { width: 10, height: 10 })
      )
    )
  );
}

export default UnsplashPicker;
export { Base64Uploader, ExternalLocationUploader, DataTransferUploader, BlobUploader, withDefaultProps };
