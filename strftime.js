(function () {
	'use strict';
	//default locale
	var defaultLocale = {
			days: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
			shortDays: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
			months: 'January February March April May June July August September October November December'.split(' '),
			shortMonths: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
			AM: 'AM',
			PM: 'PM',
			am: 'am',
			pm: 'pm',

			formats: {
				D: '%m/%d/%y',
				F: '%Y-%m-%d',
				e: '%e-%b-%Y',
				R: '%H:%M',
				r: '%I:%M:%S %p',
				T: '%H:%M:%S'
			}
		},
		cDate,
		cDateId,
		cDateReset = function () {
			cDateId = void 0;
		}, 
		//Cache last call
		cache = { 
			ts: null, 
			format: null, 
			val: null 
		};

	var strftime = function strftime(format, date, locale, options) {
		var ts,uCache;

		if (!(date instanceof Date)) {
			locale = date;

			if (cDateId === void 0) {
				cDate = new Date();
				cDate.time = cDate.getTime();
				cDateId = setTimeout(cDateReset, 1);
			}

			date = cDate;
			ts = cDate.time
		}
		else {
			ts = date.getTime();
		}
		
		uCache = locale == void 0 && options == void 0;
		//Caching will only work if the locale is not transferred 
		if (uCache) {
			if (cache.ts === ts && cache.format === format) {
				return cache.value;
			}
			else {
				var cached = cache[format];
				if (cached !== void 0 && cached[0] === ts) {
					return cached[1];
				}
			}
		}
		//Déterminer les paramètres régionaux
		if (locale == void 0) {

			locale = defaultLocale;
		}


	var tzone,utc,ch,res,padd;

		if (options) {
			tzone = options.timezone; utc = options.utc;

			if (utc || tzone !== void 0) date = new Date(ts + date.getTimezoneOffset() * 6e4);
		
			if (tzone !== void 0) { 
				if (tzone.substr !== void 0) tzone = (tzone[0] === '-' ? -1 : 1) * (60 * tzone.substr(1, 2)) + (tzone.substr(3, 2)|0);
			
				date = new Date(date.getTime() + (tzone * 6e4));
			}
		}

			//Pars format
		for (var i = 0, l = format.length; i < l; i++) {
			ch = format.charAt(i);

			if (ch === '%') { 
				ch = format.charAt(++i);

				if (ch === '-') {
					ch = format.charAt(++i);
					padd = '';
				} else if (ch === '_') {
					ch = format.charAt(++i);
					padd = ' ';
				} else if (ch === '0') {
					ch = format.charAt(++i);
					padd = '0';
				} else {
					padd = (ch === 'k' || ch === 'l') ? ' ' : '0';
				}

			}
			else {
				res += ch;
			}
		}

			if (uCache) {
			cache.ts = ts;
			cache.format = format;
			cache.val = res;
			cache[format] = [ts, res];
		}


		return res;
};

	//Generate formatting rules
	var formats = {
		'A': { val: 'days[getDay]' },
		'a': { val: 'shortDays[getDay]' },

		'B': { val: 'months[getMonth]' },
		'b': { val: 'shortMonths[getMonth]' },

		'C': { val: 'Math.floor(getFullYear / 100)', pad: 2 },
		'D': { val: 'strftime(locale.formats.D || "%m/%d/%y", date, locale)' },

		'd': { val: 'getDate', pad: 2 },
		'e': { val: 'getDate' },

		'F': { val: 'strftime(locale.formats.F || "%Y-%m-%d", date, locale)' },

		'H': { val: 'getHours', pad: 2 },
		'h': { val: 'shortMonths[getMonth]' },
		'I': { val: '(val = getHours, val === 0) ? 12 : (val > 12 ? val - 12 : val)', pad: 2 },
		'j': {
			code: function (date, val) { 
				var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
				val = Math.ceil((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
			},
			pad: 3
		},

		'k': { val: 'getHours', pad: 2 },

		'L': { val: 'Math.floor(ts % 1000)', pad: 3 },
		'l': { val: '(val = getHours, val === 0) ? 12 : (val > 12 ? val - 12 : val)', pad: 2 },

		'M': { val: 'getMinutes', pad: 2 },
		'm': { val: 'getMonth + 1', pad: 2 },

		'n': { val: '"\\n"' },
		'o': function (date, val) { 
			val = date.getDate();
			var x = val % 10, y = val % 100;

			if ((y >= 11 && y <= 13) || x === 0 || x >= 4) {
				val += 'th';
			} else if (x === 1) {
				val += 'st';
			} else if (x === 2) {
				val += 'nd';
			} else if (x === 3) {
				val += 'rd';
			}
		},

		'P': { val: 'getHours < 12 ? locale.am : locale.pm' },
		'p': { val: 'getHours < 12 ? locale.AM : locale.PM' },

		'R': { val: 'strftime(locale.formats.R || "%H:%M", date, locale)' },
		'r': { val: 'strftime(locale.formats.r || "%I:%M:%S %p", date, locale)' },

		'S': { val: 'getSeconds', pad: 2 },
		's': { val: 'Math.floor(ts / 1000)' },

		'T': { val: 'strftime(locale.formats.T || "%H:%M:%S", date, locale)' },
		't': { val: '"\\t"' },

		'U': function (date, ts, val) {
			var wday = date.getDay(),
				firstDayOfYear = new Date(date.getFullYear(), 0, 1),
				yday = (ts - firstDayOfYear.getTime()) / 86400000,
				weekNum = (yday + 7 - wday) / 7
			;

			val = Math.floor(weekNum);
		},

		'u': { val: '(val = getDay, val === 0) ? 7 : val' },

		'v': { val: 'strftime(locale.formats.v || "%e-%b-%Y", date, locale)' },

		'W': function (date, ts, val) {
			var wday = date.getDay();
			wday = (wday === 0) ? 6 : wday - 1;

			var firstDayOfYear = new Date(date.getFullYear(), 0, 1),
				yday = (ts - firstDayOfYear) / 86400000,
				weekNum = (yday + 7 - wday) / 7
			;
			val = Math.floor(weekNum);
		},

		'w': { val: 'getDay' }

		'Y': { val: 'getFullYear' },
		'y': { val: '(getFullYear + "").substr(-2, 2)' },

		'Z': { val: 'utc ? "GMT" : date.toString().match(/\\((\\w+)\\)/) && RegExp.$1 || ""' },
		'z': function (date, utc, tzone, val) {
			if (utc) {
				val = "+0000";
			} else {
				var off = typeof tzone === 'number' ? tzone : -date.getTimezoneOffset(),
					hours = Math.abs(off / 60),
					mins = off % 60
				;
				val = (off < 0 ? '-' : '+') + (hours > 9 ? hours : '0' + hours) + (mins > 9 ? mins : '0' + mins);
			}
		}

};
for (var m in formats) {
		var format = formats[m],
			code = format.code || format,
			val = format.val,
			pad = format.pad,
			body = ''
		;

		if (code instanceof Function) {
			body += code.toString().match(/\{([\s\S]+)\}/)[1];
			val = "val";
		}
		else {
			val = format.val.replace(/\b(get\w+)/i, 'date.$1()');
		}
		
		body += (pad === 3
			? ("val = " + val + ";res += val > 99 ? val : (val > 9 ? padd + val : padd * 2 + val);")
			: (pad === 2
				? ("val = " + val + ";res += val > 9 ? val : padd + val;")
				: "res += " + val + ";"
			)
		);

		ifs.push("if (char === '" + m + "') {" + body + "}");
	}
})();