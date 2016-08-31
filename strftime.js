(function () {
	'use strict';

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
		cache = { 
			ts: null, 
			format: null, 
			value: null 
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

		if (locale == void 0) {

			locale = defaultLocale;
		}


	var tzone,utc;

		if (options) {
			tzone = options.timezone; utc = options.utc;

			if (utc || tzone !== void 0) date = new Date(ts + date.getTimezoneOffset() * 6e4);
		
			if (tzone !== void 0) { 
				if (tzone.substr !== void 0) tzone = (tzone[0] === '-' ? -1 : 1) * (60 * tzone.substr(1, 2)) + (tzone.substr(3, 2)|0);
			
				date = new Date(date.getTime() + (tzone * 6e4));
			}
		}
};

})();