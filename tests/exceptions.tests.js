var asyncFor = require ('../index');
var unsafeFor = asyncFor.unsafe;
var should = require ('should');

function test (safeMode) {
  var _for = safeMode ? asyncFor : unsafeFor;
  var maybe = safeMode ? '' : 'not';
  var mode = safeMode ? ' in safe mode' : ' in unsafe mode';

  describe ('callback safety checks' + mode, function (done) {

    it ('should ' + maybe + ' throw an error if the same callback is used twice', function (done) {
      var loop = _for (10, function (i, _break, _continue, _data) {
          _continue ();
        });

      var count = 0;
      loop.callback (function () {
        count++;
        if (!safeMode && count === 2) done ();
      });

      var runTwice = function () {
        loop ();
        loop ();
      };

      if (safeMode) {
        should.throws (runTwice);
        done();
      } else {
        runTwice ();
      }
    });

    it ('should ' + maybe + ' throw an error if missing a callback', function (done) {
      var loop = _for (10, function (i, _break, _continue, _data) {
          if (i === 10) throw 'ran too far';
          _continue ();
        });

      if (safeMode) {
        should.throws (loop);
      }
      done ();
    });

    it ('should ' + maybe + ' throw an error if _break is called twice in one body function', function (done) {
      var loop = _for (10, function (i, _break, _continue, _data) {
        _break ();
        _break ();
        });

      var callbackCount = 0;
      loop.callback (function () {
        callbackCount++;
        if (!safeMode && callbackCount === 2) done ();
      });

      if (safeMode) {
        should.throws (loop, /continued iterating/);
        callbackCount.should.eql (1);
        done ();
      } else {
        loop ();
      }
    });

    it ('should ' + maybe + ' throw an error if _continue and _break are both called in one iteration', function (done) {
      var loop = _for (10, function (i, _break, _continue, _data) {
        _continue ();
        _break ();
        });

      var callbackCount = 0;
      loop.callback (function () {
        callbackCount++;
        if (!safeMode && callbackCount === 2) done ();
      });

      if (safeMode) {
        should.throws (loop, /continued iterating/);
        callbackCount.should.eql (1);
        done ();
      } else {
        loop ();
      }
    });

    it ('should ' + maybe + ' throw an error if _break and _continue are both called in one iteration', function (done) {
      var loop = _for (10, function (i, _break, _continue, _data) {
        _break ();
        _continue ();
        });

      var callbackCount = 0;
      loop.callback (function () {
        callbackCount++;
        if (!safeMode && callbackCount === 2) done ();
      });

      if (safeMode) {
        should.throws (loop, /continued iterating/);
        callbackCount.should.eql (1);
        done ();
      } else {
        loop ();
      }
    });

  });

}

test (true);
test (false);