// function i() {
// 	throw new Error("Cycle detected");
// }
// var t = Symbol.for("preact-signals");
// function r() {
// 	if (!(v > 1)) {
// 		var i,
// 			t = !1;
// 		while (void 0 !== f) {
// 			var r = f;
// 			f = void 0;
// 			e++;
// 			while (void 0 !== r) {
// 				var n = r.o;
// 				r.o = void 0;
// 				r.f &= -3;
// 				if (!(8 & r.f) && l(r))
// 					try {
// 						r.c();
// 					} catch (r) {
// 						if (!t) {
// 							i = r;
// 							t = !0;
// 						}
// 					}
// 				r = n;
// 			}
// 		}
// 		e = 0;
// 		v--;
// 		if (t) throw i;
// 	} else v--;
// }
// function n(i) {
// 	if (v > 0) return i();
// 	v++;
// 	try {
// 		return i();
// 	} finally {
// 		r();
// 	}
// }
// var o = void 0,
// 	h = 0;
// function s(i) {
// 	if (h > 0) return i();
// 	var t = o;
// 	o = void 0;
// 	h++;
// 	try {
// 		return i();
// 	} finally {
// 		h--;
// 		o = t;
// 	}
// }
// var f = void 0,
// 	v = 0,
// 	e = 0,
// 	u = 0;
// function c(i) {
// 	if (void 0 !== o) {
// 		var t = i.n;
// 		if (void 0 === t || t.t !== o) {
// 			t = { i: 0, S: i, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t };
// 			if (void 0 !== o.s) o.s.n = t;
// 			o.s = t;
// 			i.n = t;
// 			if (32 & o.f) i.S(t);
// 			return t;
// 		} else if (-1 === t.i) {
// 			t.i = 0;
// 			if (void 0 !== t.n) {
// 				t.n.p = t.p;
// 				if (void 0 !== t.p) t.p.n = t.n;
// 				t.p = o.s;
// 				t.n = void 0;
// 				o.s.n = t;
// 				o.s = t;
// 			}
// 			return t;
// 		}
// 	}
// }
// function d(i) {
// 	this.v = i;
// 	this.i = 0;
// 	this.n = void 0;
// 	this.t = void 0;
// }
// d.prototype.brand = t;
// d.prototype.h = function () {
// 	return !0;
// };
// d.prototype.S = function (i) {
// 	if (this.t !== i && void 0 === i.e) {
// 		i.x = this.t;
// 		if (void 0 !== this.t) this.t.e = i;
// 		this.t = i;
// 	}
// };
// d.prototype.U = function (i) {
// 	if (void 0 !== this.t) {
// 		var t = i.e,
// 			r = i.x;
// 		if (void 0 !== t) {
// 			t.x = r;
// 			i.e = void 0;
// 		}
// 		if (void 0 !== r) {
// 			r.e = t;
// 			i.x = void 0;
// 		}
// 		if (i === this.t) this.t = r;
// 	}
// };
// d.prototype.subscribe = function (i) {
// 	var t = this;
// 	return O(function () {
// 		var r = t.value,
// 			n = 32 & this.f;
// 		this.f &= -33;
// 		try {
// 			i(r);
// 		} finally {
// 			this.f |= n;
// 		}
// 	});
// };
// d.prototype.valueOf = function () {
// 	return this.value;
// };
// d.prototype.toString = function () {
// 	return this.value + "";
// };
// d.prototype.toJSON = function () {
// 	return this.value;
// };
// d.prototype.peek = function () {
// 	return this.v;
// };
// Object.defineProperty(d.prototype, "value", {
// 	get: function () {
// 		var i = c(this);
// 		if (void 0 !== i) i.i = this.i;
// 		return this.v;
// 	},
// 	set: function (t) {
// 		if (o instanceof _)
// 			(function () {
// 				throw new Error("Computed cannot have side-effects");
// 			})();
// 		if (t !== this.v) {
// 			if (e > 100) i();
// 			this.v = t;
// 			this.i++;
// 			u++;
// 			v++;
// 			try {
// 				for (var n = this.t; void 0 !== n; n = n.x) n.t.N();
// 			} finally {
// 				r();
// 			}
// 		}
// 	},
// });
// function a(i) {
// 	return new d(i);
// }
// function l(i) {
// 	for (var t = i.s; void 0 !== t; t = t.n)
// 		if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
// 	return !1;
// }
// function y(i) {
// 	for (var t = i.s; void 0 !== t; t = t.n) {
// 		var r = t.S.n;
// 		if (void 0 !== r) t.r = r;
// 		t.S.n = t;
// 		t.i = -1;
// 		if (void 0 === t.n) {
// 			i.s = t;
// 			break;
// 		}
// 	}
// }
// function w(i) {
// 	var t = i.s,
// 		r = void 0;
// 	while (void 0 !== t) {
// 		var n = t.p;
// 		if (-1 === t.i) {
// 			t.S.U(t);
// 			if (void 0 !== n) n.n = t.n;
// 			if (void 0 !== t.n) t.n.p = n;
// 		} else r = t;
// 		t.S.n = t.r;
// 		if (void 0 !== t.r) t.r = void 0;
// 		t = n;
// 	}
// 	i.s = r;
// }
// function _(i) {
// 	d.call(this, void 0);
// 	this.x = i;
// 	this.s = void 0;
// 	this.g = u - 1;
// 	this.f = 4;
// }
// (_.prototype = new d()).h = function () {
// 	this.f &= -3;
// 	if (1 & this.f) return !1;
// 	if (32 == (36 & this.f)) return !0;
// 	this.f &= -5;
// 	if (this.g === u) return !0;
// 	this.g = u;
// 	this.f |= 1;
// 	if (this.i > 0 && !l(this)) {
// 		this.f &= -2;
// 		return !0;
// 	}
// 	var i = o;
// 	try {
// 		y(this);
// 		o = this;
// 		var t = this.x();
// 		if (16 & this.f || this.v !== t || 0 === this.i) {
// 			this.v = t;
// 			this.f &= -17;
// 			this.i++;
// 		}
// 	} catch (i) {
// 		this.v = i;
// 		this.f |= 16;
// 		this.i++;
// 	}
// 	o = i;
// 	w(this);
// 	this.f &= -2;
// 	return !0;
// };
// _.prototype.S = function (i) {
// 	if (void 0 === this.t) {
// 		this.f |= 36;
// 		for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
// 	}
// 	d.prototype.S.call(this, i);
// };
// _.prototype.U = function (i) {
// 	if (void 0 !== this.t) {
// 		d.prototype.U.call(this, i);
// 		if (void 0 === this.t) {
// 			this.f &= -33;
// 			for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
// 		}
// 	}
// };
// _.prototype.N = function () {
// 	if (!(2 & this.f)) {
// 		this.f |= 6;
// 		for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
// 	}
// };
// _.prototype.peek = function () {
// 	if (!this.h()) i();
// 	if (16 & this.f) throw this.v;
// 	return this.v;
// };
// Object.defineProperty(_.prototype, "value", {
// 	get: function () {
// 		if (1 & this.f) i();
// 		var t = c(this);
// 		this.h();
// 		if (void 0 !== t) t.i = this.i;
// 		if (16 & this.f) throw this.v;
// 		return this.v;
// 	},
// });
// function p(i) {
// 	return new _(i);
// }
// function g(i) {
// 	var t = i.u;
// 	i.u = void 0;
// 	if ("function" == typeof t) {
// 		v++;
// 		var n = o;
// 		o = void 0;
// 		try {
// 			t();
// 		} catch (t) {
// 			i.f &= -2;
// 			i.f |= 8;
// 			b(i);
// 			throw t;
// 		} finally {
// 			o = n;
// 			r();
// 		}
// 	}
// }
// function b(i) {
// 	for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
// 	i.x = void 0;
// 	i.s = void 0;
// 	g(i);
// }
// function x(i) {
// 	if (o !== this) throw new Error("Out-of-order effect");
// 	w(this);
// 	o = i;
// 	this.f &= -2;
// 	if (8 & this.f) b(this);
// 	r();
// }
// function E(i) {
// 	this.x = i;
// 	this.u = void 0;
// 	this.s = void 0;
// 	this.o = void 0;
// 	this.f = 32;
// }
// E.prototype.c = function () {
// 	var i = this.S();
// 	try {
// 		if (8 & this.f) return;
// 		if (void 0 === this.x) return;
// 		var t = this.x();
// 		if ("function" == typeof t) this.u = t;
// 	} finally {
// 		i();
// 	}
// };
// E.prototype.S = function () {
// 	if (1 & this.f) i();
// 	this.f |= 1;
// 	this.f &= -9;
// 	g(this);
// 	y(this);
// 	v++;
// 	var t = o;
// 	o = this;
// 	return x.bind(this, t);
// };
// E.prototype.N = function () {
// 	if (!(2 & this.f)) {
// 		this.f |= 2;
// 		this.o = f;
// 		f = this;
// 	}
// };
// E.prototype.d = function () {
// 	this.f |= 8;
// 	if (!(1 & this.f)) b(this);
// };
// function O(i) {
// 	var t = new E(i);
// 	try {
// 		t.c();
// 	} catch (i) {
// 		t.d();
// 		throw i;
// 	}
// 	return t.d.bind(t);
// }
// export {
// 	d as Signal,
// 	n as batch,
// 	p as computed,
// 	O as effect,
// 	a as signal,
// 	s as untracked,
// }; //# sourceMappingURL=signals-core.module.js.map
