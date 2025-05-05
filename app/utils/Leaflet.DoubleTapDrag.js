import L from "leaflet";

function DoubleTapDragInitHook() {
  let timer = null;
  let fired = false;
  let lastTimestamp = null;
  let DOUBLE_CLICK_TIMEOUT = 150;
  let WAIT_FOR_DRAG_END_TIMEOUT = 0;

  this._container.addEventListener('click', L.Util.bind(function (e) {
    lastTimestamp = Date.now();
    setTimeout(L.Util.bind(function () {
      lastTimestamp = null;
    }, this), DOUBLE_CLICK_TIMEOUT);
  }, this));

  this._container.addEventListener('touchstart', L.Util.bind(function (e) {
    if (e.touches.length !== 1) {
      return;
    }
    let now = Date.now();
    if (lastTimestamp) {
      if (now - lastTimestamp < DOUBLE_CLICK_TIMEOUT) {
        timer = setTimeout(L.Util.bind(function () {
          this.fire('doubletapdragstart', e);
          timer = null;
          fired = true;
        }, this), WAIT_FOR_DRAG_END_TIMEOUT);
      }
      lastTimestamp = null;
    }
  }, this));

  this._container.addEventListener('touchend', L.Util.bind(function (e) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (fired) {
      this.fire('doubletapdragend', e);
      fired = null;
    }
  }, this));

  this._container.addEventListener('touchmove', L.Util.bind(function (e) {
    if (!fired) {
      return;
    }

    this.fire('doubletapdrag', e);
  }, this));
}

L.Map.addInitHook(DoubleTapDragInitHook);
