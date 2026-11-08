//	タッチ端末向けツールチップ
//	iPhone 等のタッチ端末では title 属性のツールチップが表示されないため、
//	代わりに吹き出しを表示する。
//	 ・画像など操作を持たない要素 : タップで表示
//	 ・ボタン・チェックボックス等 : 長押しで表示 (タップは通常の操作のまま)
//	マウスで操作できる環境 (hover が使える) では何もしない。
(function () {
	if (!window.matchMedia || !window.matchMedia("(hover: none)").matches) {
		return;
	}

	var LONG_PRESS_MS = 500;
	var AUTO_HIDE_MS = 3000;
	//	指がこれ以上動いたらスクロールとみなして長押しを取り消す
	var MOVE_TOLERANCE = 10;

	var tip = null;
	var hideTimer = null;
	var pressTimer = null;
	var startX = 0;
	var startY = 0;
	//	長押しで表示した直後の click を打ち消すためのフラグ
	var suppressClick = false;

	function FindTitled(el) {
		while (el && el.nodeType === 1) {
			if (el.getAttribute("title")) {
				return el;
			}
			el = el.parentNode;
		}
		return null;
	}

	//	タップ自体に操作がある要素か (その場合はタップでは表示せず長押しのみ)
	function IsInteractive(el) {
		while (el && el.nodeType === 1) {
			var tag = el.tagName;
			if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A" || tag === "LABEL") {
				return true;
			}
			if (el.getAttribute("onclick")) {
				return true;
			}
			el = el.parentNode;
		}
		return false;
	}

	function Hide() {
		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
		if (tip) {
			tip.style.display = "none";
		}
	}

	function Show(target) {
		var text = target.getAttribute("title");
		if (!text) {
			return;
		}
		if (!tip) {
			tip = document.createElement("div");
			tip.className = "touchtip";
			document.body.appendChild(tip);
		}
		tip.textContent = text;
		tip.style.display = "block";
		tip.style.left = "0px";
		tip.style.top = "0px";

		var rect = target.getBoundingClientRect();
		var tipW = tip.offsetWidth;
		var tipH = tip.offsetHeight;
		var viewW = document.documentElement.clientWidth;
		var margin = 4;

		//	要素の上に出し、上が足りなければ下に出す
		var top = rect.top - tipH - 6;
		if (top < margin) {
			top = rect.bottom + 6;
		}
		var left = rect.left + rect.width / 2 - tipW / 2;
		left = Math.max(margin, Math.min(left, viewW - tipW - margin));

		tip.style.left = left + window.pageXOffset + "px";
		tip.style.top = top + window.pageYOffset + "px";

		if (hideTimer) {
			clearTimeout(hideTimer);
		}
		hideTimer = setTimeout(Hide, AUTO_HIDE_MS);
	}

	function CancelPress() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
	}

	document.addEventListener(
		"touchstart",
		function (e) {
			Hide();
			CancelPress();
			suppressClick = false;
			var target = FindTitled(e.target);
			if (!target || e.touches.length !== 1) {
				return;
			}
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			pressTimer = setTimeout(function () {
				pressTimer = null;
				suppressClick = true;
				Show(target);
			}, LONG_PRESS_MS);
		},
		{ passive: true }
	);

	document.addEventListener(
		"touchmove",
		function (e) {
			if (!pressTimer) {
				return;
			}
			var t = e.touches[0];
			if (Math.abs(t.clientX - startX) > MOVE_TOLERANCE || Math.abs(t.clientY - startY) > MOVE_TOLERANCE) {
				CancelPress();
			}
		},
		{ passive: true }
	);

	document.addEventListener("touchend", CancelPress, { passive: true });
	document.addEventListener("touchcancel", CancelPress, { passive: true });

	//	長押し後に指を離した時の click で、ボタン等が反応しないようにする
	document.addEventListener(
		"click",
		function (e) {
			if (suppressClick) {
				suppressClick = false;
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			var target = FindTitled(e.target);
			if (target && !IsInteractive(e.target)) {
				Show(target);
			}
		},
		true
	);

	//	長押しで出る iOS 標準のメニューの代わりに吹き出しを出す
	document.addEventListener("contextmenu", function (e) {
		if (FindTitled(e.target)) {
			e.preventDefault();
		}
	});

	window.addEventListener("scroll", Hide, { passive: true });
})();
