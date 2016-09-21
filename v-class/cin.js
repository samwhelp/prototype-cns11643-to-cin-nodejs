#!/usr/bin/env node

!function() {
	console.log('start');
	var fs = require('fs'); //https://nodejs.org/api/fs.html

	var app = {};
	var cin = {};
	var converter = {};
	var mapping = {};
	var util = {
		EOL: "\r\n",
		SEGMENT: "\t",
		QUOTE: '"'
	};


	util.File = {
	    newInstance: function() {
			var obj = {
				_Path: '',
				getPath: function() {
					return this._Path;
				},
				setPath: function(val) {
					this._Path = val;
					return this;
				},

				_Content: '',
				setContent: function(val) {
					this._Content = val;
					return this;
				},

				save: function() {
					//http://javascript.ruanyifeng.com/nodejs/fs.html
					//https://nodejs.org/api/fs.html

					if (this._Content === null) {
						this._Content = this.defContent();
					}

					fs.writeFileSync(this._Path, this._Content);
				},

				_End: 'Object util.File',
			};
	        return obj;
	    },
	    getInstance: function() {
	        if (this._Instance === null) {
	            this._Instance = this.newInstance();
	        }

	        return this._Instance;
	    },
	    _Instance: null,
	    _End: 'Class util.File'
	};

	cin.File = {
	    newInstance: function() {
			var obj = {
				_Path: 'CnsPhonetic.cin',
				getPath: function() {
					return this._Path;
				},

				_Content: null,
				setContent: function(val) {
					this._Content = val;
					return this;
				},
				defContent: function() {
					var rtn = '';
					rtn += this.createBlock_Head();
					rtn += this.createBlock_KeyName();
					rtn += this.createBlock_CharDef();
					return rtn;
				},

				_Content_Cname: '全字庫注音',
				setContent_Cname: function(val) {
					this._Content_Cname = val;
					return this;
				},

				_Content_Ename: 'CnsPhonetic',
				setContent_Ename: function(val) {
					this._Content_Ename = val;
					return this;
				},

				_Content_SelKey: '1234567890',
				setContent_SelKey: function(val) {
					this._Content_SelKey = val;
					return this;
				},

				_Content_EndKey: '3467',
				setContent_EndKey: function(val) {
					this._Content_EndKey = val;
					return this;
				},

				_Content_KeyName: '',
				setContent_KeyName: function(val) {
					this._Content_KeyName = val;
					return this;
				},

				_Content_CharDef: '',
				setContent_CharDef: function(val) {
					this._Content_CharDef = val;
					return this;
				},

				save: function() {
					//http://javascript.ruanyifeng.com/nodejs/fs.html
					//https://nodejs.org/api/fs.html

					if (this._Content === null) {
						this._Content = this.defContent();
					}

					fs.writeFileSync(this._Path, this._Content);
				},

				createBlock_Head: function() {
					var rtn = '';
					rtn += '%gen_inp' + util.EOL;
					rtn += '%ename ' + this._Content_Ename + util.EOL;
					rtn += '%cname ' + this._Content_Cname + util.EOL;
					rtn += '%selkey ' + this._Content_SelKey + util.EOL;
					rtn += '%endkey ' + this._Content_EndKey + util.EOL;
					return rtn;
				},

				createBlock_KeyName: function() {
					var rtn = '';

					rtn += '%keyname begin' + util.EOL;
					rtn += this._Content_KeyName;
					rtn += '%keyname end' + util.EOL;

					return rtn;
				},

				createBlock_CharDef: function() {
					var rtn = '';
					rtn += '%chardef begin' + util.EOL;
					rtn += this._Content_CharDef;
					rtn += '%chardef end' + util.EOL;
					return rtn;
				},

				_End: 'Object cin.File',
			};
	        return obj;
	    },
	    getInstance: function() {
	        if (this._Instance === null) {
	            this._Instance = this.newInstance();
	        }

	        return this._Instance;
	    },
	    _Instance: null,
	    _End: 'Class cin.File'
	};

	mapping.CnsUnicode = {
		newInstance: function() {
			var obj = {
				_Map: new Map(),
				_Collision: [],

				getTable: function() {
					return this._Table;
				},

				_FileList: [],
				setFileList: function(val) {
					this._FileList = val;
					return this;
				},
				defFileList: function() {
					return [
						'data/CNS2UNICODE_Unicode_BMP.txt',
						'data/CNS2UNICODE_Unicode_2.txt',
						'data/CNS2UNICODE_Unicode_15.txt'
					];
				},
				setDefaultFileList: function() {
					this.setFileList(this.defFileList());
					return this;
				},

				prep: function() {
					this.load();
					return this;
				},

				load: function() {
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions
					for (var path of this._FileList) {
						this.loadFile(path);
					}

					//console.log(this._Map);

				},

				readFile: function(path) {
					//http://javascript.ruanyifeng.com/nodejs/fs.html
					//https://nodejs.org/api/fs.html
					try {
						var text = fs.readFileSync(path, 'utf8');
					} catch (ex) {
						console.log('file not exists: ', path);
						process.exit(1); //https://nodejs.org/api/process.html#process_process_exit_code
					}
					return text;
				},

				loadFile: function(path) {
					var text = this.readFile(path);
					this.parseText(text, path);
				},

				parseText: function(text, file) {

					var list = text.split("\n");

					var line = 0; // line number

					for (var str of list) {
						line++;

						str = str.trim();
						if (str.length <= 0) {
							continue;
						}

						this.parseLine(str, line, file);
					}


				},

				parseLine: function(str, line, file) {
					var list = str.split("\t");
					var item = {
						grp: list[0],
						cns: list[1],
						unicode: list[2],
						cnsunicode_file: file,
						cnsunicode_line: line
						//unicode_grp: null,
					};

					/*
					if (item.unicode.length >=5) {
						//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
						item.unicode = item.unicode.substr(0, 4);
						item.unicode_bmp = item.unicode.substr(-1);
					}
					*/
					//this._Table.push(item);

					var key = item.grp + '-' + item.cns;
					var val = item;

					if (this._Map.has(key)) {
						this._Collision.push(item);
						return;
					}

					this._Map.set(key, val);
					//console.log(key, val);

				},

				findUnicode_ByCnsGrp: function(cns, grp) {
					//console.log(cns, grp);
					var key = grp + '-' + cns;

					if (!this._Map.has(key)) {
						return null;
					}

					var item = this._Map.get(key);

					return item.unicode;

				},

				findItem_ByCnsGrp: function(cns, grp) {
					//console.log(cns, grp);
					var key = grp + '-' + cns;

					if (!this._Map.has(key)) {
						return null;
					}

					var item = this._Map.get(key);

					return item;

				},

				_End: 'Object mapping.CnsUnicode',
			};
			return obj;
		},
		getInstance: function() {
			if (this._Instance === null) {
				this._Instance = this.newInstance();
			}

			return this._Instance;
		},
		_Instance: null,
		_End: 'Class mapping.CnsUnicode'
	};

	mapping.CnsPhonetic = {
		newInstance: function() {
			var obj = {
				_Table: [],
				getTable: function() {
					return this._Table;
				},

				_FileList: [],
				setFileList: function(val) {
					this._FileList = val;
					return this;
				},
				defFileList: function() {
					return [
						'data/CNS_phonetic.txt',
						'data/Other_phonetic.txt' //http://www.cns11643.gov.tw/AIDB/query_symbol_results.do
					];
				},
				setDefaultFileList: function() {
					this.setFileList(this.defFileList());
					return this;
				},

				prep: function() {
					this.load();
					return this;
				},

				load: function() {
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions
					for (var path of this._FileList) {
						this.loadFile(path);
					}

				},

				readFile: function(path) {
					//http://javascript.ruanyifeng.com/nodejs/fs.html
					//https://nodejs.org/api/fs.html
					try {
						var text = fs.readFileSync(path, 'utf8');
					} catch (ex) {
						console.log('file not exists: ', path);
						process.exit(1); //https://nodejs.org/api/process.html#process_process_exit_code
					}
					return text;
				},

				loadFile: function(path) {
					var text = this.readFile(path);
					this.parseText(text, path);
				},

				parseText: function(text, file) {

					var list = text.split("\n");

					var line = 0; // line number;

					for (var str of list) {
						line++;

						str = str.trim();
						if (line.length <= 0) {
							continue;
						}

						this.parseLine(str, line, file);
					}
					//console.log(this._Table);
				},

				parseLine: function(str, line, file) {
					var list = str.split("\t");

					this._Table.push({
						grp: list[0],
						cns: list[1],
						phonetic: list[2],
						cnsphonetic_line: line,
						cnsphonetic_file: file
					});
					//console.log(key, val);
				},

				createUrl: function(cns, grp) {
					//http://www.cns11643.gov.tw/AIDB/query_general_view.do?page=1&code=4421
					var rtn = ''
					rtn += 'http://www.cns11643.gov.tw/AIDB/query_general_view.do';
					rtn += '?page=' + grp;
					rtn += '&code=' + cns;
					return rtn;
				},

				_End: 'Object mapping.CnsPhonetic',
			};
			return obj;
		},
		getInstance: function() {
			if (this._Instance === null) {
				this._Instance = this.newInstance();
			}

			return this._Instance;
		},
		_Instance: null,
		_End: 'Class mapping.CnsPhonetic'
	};

	mapping.Unicode = {
		newInstance: function() {
			var obj = {
				prep: function() {
					return this;
				},

				findNumber_ByCode: function(code) {
					var num = parseInt(''+code, 16 | 0).toString(10 | 0); //http://php.net/manual/en/function.base-convert.php
					return num;
				},

				/*
				findString_ByCode: function(code) {
					var num = this.findNumber_ByCode(code);
					return String.fromCodePoint(num); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
				},
				*/

				findString_ByCode: function(code) {
					//var num = this.findNumber_ByCode(code);
					return String.fromCodePoint('0x'+code); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
				},

				_End: 'Object mapping.Unicode',
			};
			return obj;
		},
		getInstance: function() {
			if (this._Instance === null) {
				this._Instance = this.newInstance();
			}

			return this._Instance;
		},
		_Instance: null,
		_End: 'Class mapping.Unicode'
	};


	mapping.Phonetic = {
		newInstance: function() {
			var obj = {

				prep: function() {
					return this;
				},

				findHex_ByChar: function(char) {

					if (!this.isValidChar(char)) {
						return -1;
					}

					return char.charCodeAt(0).toString(16);
				},

				findHexExp_ByChar: function(char) {

					if (!this.isValidChar(char)) {
						return '';
					}

					return '0x' + char.charCodeAt(0).toString(16);

					//String.fromCodePoint('0x' + char.charCodeAt(0).toString(16)); //findChar_ByHexExp

				},

				findDec_ByChar: function(char) {

					if (!this.isValidChar(char)) {
						return -1;
					}

					return char.charCodeAt(0).toString(10);

					//String.fromCodePoint(char.charCodeAt(0).toString(10)); //findChar_ByDec

				},

				findChar_ByHex: function(hex) {
					var char = String.fromCodePoint('0x' + hex);

					if (!this.isValidChar(char)) {
						return '';
					}

					return char;
				},

				findChar_ByHexExp: function(exp) {
					var char = String.fromCodePoint(exp);

					if (!this.isValidChar(char)) {
						return '';
					}

					return char;
				},

				findChar_ByDec: function(dec) {

					var char = String.fromCodePoint(dec);

					if (!this.isValidChar(char)) {
						return '';
					}

					return char;
				},

				toPhoneticHexMap: function() {
					var rtn = new Map();
					var list = this.toArray();
					for (var char of list) {
						var hex = this.findHex_ByChar(char);
						rtn.set(char, hex);
					}
					return rtn;
				},

				toPhoneticHexExpMap: function() {
					var rtn = new Map();
					var list = this.toArray();
					for (var char of list) {
						var hex = this.findHexExp_ByChar(char);
						rtn.set(char, hex);
					}
					return rtn;
				},

				toPhoneticDecMap: function() {
					var rtn = new Map();
					var list = this.toArray();
					for (var char of list) {
						var hex = this.findDec_ByChar(char);
						rtn.set(char, hex);
					}
					return rtn;
				},

				isValidChar: function(char) {

					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode

					var dec = char.charCodeAt(0).toString(10);

					dec = parseInt(dec);

					if (dec === 711) { // 'ˇ' , '711', '2c7', '0x2c7'
						return true;
					}

					if (dec === 714) { // 'ˊ' , '714', '2ca', '0x2ca'
						return true;
					}

					if (dec === 715) { // 'ˋ' , '715', '2cb', '0x2cb'
						return true;
					}

					if (dec === 729) { // '˙' , '729', '2d9', '0x2d9'
						return true;
					}

					if ((dec >= 12549) && (dec <= 12569)) { // ('ㄅ' ~ 'ㄙ') ('0x3105' ~ '0x3119')
						return true;
					}

					if ((dec >= 12583) && (dec <= 12585)) { // ('ㄧ' ~ 'ㄩ') ('0x3127' ~ '0x3129')
						return true;
					}

					if ((dec >= 12570) && (dec <= 12582)) { // ('ㄚ' ~ 'ㄦ') ('0x311a' ~ '0x3126')
						return true;
					}

					return false;

				},

				toArray: function() {
					var rtn = [];

					rtn.push(this.findChar_ByDec(714)); // 'ˊ'
					rtn.push(this.findChar_ByDec(711)); // 'ˇ'
					rtn.push(this.findChar_ByDec(715)); // 'ˋ'
					rtn.push(this.findChar_ByDec(729)); // '˙'

					var start, end, dec;

					 // ('ㄅ' ~ 'ㄙ') ('0x3105' ~ '0x3119')
					start = 12549;
					end = 12569;
					for (dec=start; dec<=end; dec++) {
						rtn.push(this.findChar_ByDec(dec))
					}

					// ('ㄧ' ~ 'ㄩ') ('0x3127' ~ '0x3129')
					start = 12583;
					end = 12585;
					for (dec=start; dec<=end; dec++) {
						rtn.push(this.findChar_ByDec(dec))
					}

					 // ('ㄚ' ~ 'ㄦ') ('0x311a' ~ '0x3126')
					start = 12570;
					end = 12582;
					for (dec=start; dec<=end; dec++) {
						rtn.push(this.findChar_ByDec(dec))
					}

					return rtn;
				},

				toString: function() {
					//Todo:
					var rtn = '';
					var list = this.toArray();
					for (var char of list) {
						rtn += char;
						rtn += util.EOL;
					}
					return rtn;
				},

				_End: 'Object mapping.Phonetic',
			};
	        return obj;
	    },
	    getInstance: function() {
	        if (this._Instance === null) {
	            this._Instance = this.newInstance();
	        }

	        return this._Instance;
	    },
	    _Instance: null,
	    _End: 'Class mapping.Phonetic'
	};

	mapping.PhoneticKey = {
		newInstance: function() {
			var obj = {
				//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
				_Map: new Map([
					['ˊ', '6'],
					['ˇ', '3'],
					['ˋ', '4'],
					['˙', '7'],

					['ㄅ', '1'],
					['ㄆ', 'q'],
					['ㄇ', 'a'],
					['ㄈ', 'z'],

					['ㄉ', '2'],
					['ㄊ', 'w'],
					['ㄋ', 's'],
					['ㄌ', 'x'],

					['ㄍ', 'e'],
					['ㄎ', 'd'],
					['ㄏ', 'c'],

					['ㄐ', 'r'],
					['ㄑ', 'f'],
					['ㄒ', 'v'],

					['ㄓ', '5'],
					['ㄔ', 't'],
					['ㄕ', 'g'],
					['ㄖ', 'b'],

					['ㄗ', 'y'],
					['ㄘ', 'h'],
					['ㄙ', 'n'],

					['ㄧ', 'u'],
					['ㄨ', 'j'],
					['ㄩ', 'm'],

					['ㄚ', '8'],
					['ㄛ', 'i'],
					['ㄜ', 'k'],
					['ㄝ', ','],

					['ㄞ', '9'],
					['ㄟ', 'o'],
					['ㄠ', 'l'],
					['ㄡ', '.'],

					['ㄢ', '0'],
					['ㄣ', 'p'],
					['ㄤ', ';'],
					['ㄥ', '/'],

					['ㄦ', '-']

				]),

				_Phonetic: null,
				setPhonetic: function(val) {
					this._Phonetic = val;
					return this;
				},

				prep: function() {
					if (this._Phonetic === null) {
						this._Phonetic = mapping.Phonetic.newInstance();
					}
					return this;
				},

				findKeySeq_ByCharSeq: function(str) {
					var rtn = '';
					for (var char of str) {
						rtn += this.findKey_ByChar(char);
					}
					return rtn;
				},

				findKeySeq_ByCharSeq_ValidChar: function(str) {
					var rtn = '';
					for (var char of str) {
						if (!this._Phonetic.isValidChar(char)) {
							return [false, ''];
						}
						rtn += this.findKey_ByChar(char);
					}
					return [true, rtn];
				},

				findKey_ByChar: function(char) {

					if (!this._Phonetic.isValidChar(char)) {
						return '';
					}

					return this._Map.get(char);
				},

				testValidPhoneticMap: function() {
					var rtn = new Map();
					for (var [char, key] of this._Map) {
						var rs = this._Phonetic.isValidChar(char);
						rtn.set(char, rs);
					}
					return rtn;
				},

				toString: function() {
					var rtn = '';
					for (var [key, val] of this._Map) {
						//console.log(key + " = " + val);
						rtn += key;
						rtn += util.SEGMENT;
						rtn += val;
						rtn += util.EOL;
					}

					return rtn;
				},
				_End: 'Object mapping.PhoneticKey',
			};
	        return obj;
	    },
	    getInstance: function() {
	        if (this._Instance === null) {
	            this._Instance = this.newInstance();
	        }

	        return this._Instance;
	    },
	    _Instance: null,
	    _End: 'Class mapping.PhoneticKey'
	};


	converter.CnsToCin = {
		newInstance: function() {
			var obj = {
				_PhoneticList: [],
				_InvalidPhonetic: [],

				_UnicodePhonetic: new Map(),
				_UnicodePhoneticCollision: [],

				_CnsPhonetic: null,
				_CnsUnicode: null,
				_Unicode: null,
				_Phonetic: null,

				init: function() {

					this._CnsPhonetic = mapping.CnsPhonetic.newInstance()
						.setDefaultFileList()
						.prep()
					;

					this._CnsUnicode = mapping.CnsUnicode.newInstance()
						.setDefaultFileList()
						.prep()
					;

					this._Unicode = mapping.Unicode.newInstance()
						.prep()
					;

					this._Phonetic = mapping.Phonetic.newInstance()
						.prep()
					;

					this._PhoneticKey = mapping.PhoneticKey.newInstance()
						.setPhonetic(this._Phonetic)
						.prep()
					;

				},
				run: function() {
					console.log('run...');

					this.init();

					//巡迴CnsPhonetic資料表，找出對應的Unicode。
					for (var cns_phonetic of this._CnsPhonetic.getTable()) {

						var cns_unicode = this._CnsUnicode.findItem_ByCnsGrp(cns_phonetic.cns, cns_phonetic.grp);

						if (cns_unicode === null) {
							continue;
						}

						var item = {};

						//cns_unicode
						item.grp = cns_unicode.grp;
						item.cns = cns_unicode.cns;
						item.unicode = cns_unicode.unicode;
						item.unicode_string = this._Unicode.findString_ByCode(item.unicode);
						item.unicode_number = this._Unicode.findNumber_ByCode(item.unicode);
						item.cnsunicode_file = cns_unicode.cnsunicode_file;
						item.cnsunicode_line = cns_unicode.cnsunicode_line;

						//cns_phonetic
						item.phonetic = cns_phonetic.phonetic;

						//item.phonetic_keyseq = this._PhoneticKey.findKeySeq_ByCharSeq(item.phonetic);
						//item.phonetic_keyseq_valid = true;
						[item.phonetic_keyseq_valid, item.phonetic_keyseq] = this._PhoneticKey.findKeySeq_ByCharSeq_ValidChar(item.phonetic);

						item.cnsphonetic_file = cns_phonetic.cnsphonetic_file;
						item.cnsphonetic_line = cns_phonetic.cnsphonetic_line;

						item.cns_url = this._CnsPhonetic.createUrl(item.cns, item.grp);

						//console.log(item);



						//排除「非合法注音的項目」。
						if (!item.phonetic_keyseq_valid) { // 非合法注音的項目
							this._InvalidPhonetic.push(item);
							continue;
						}

						// 紀錄重複的「phonetic - unicode」
						var collision_key = item.phonetic_keyseq + '-' + item.unicode;

						if (this._UnicodePhonetic.has(collision_key)) {
							var collision_list = this._UnicodePhonetic.get(collision_key);
							collision_list.push(item);
							this._UnicodePhoneticCollision.push(collision_list);
						} else {
							this._PhoneticList.push(item);
							this._UnicodePhonetic.set(collision_key, [item]);

						}



					}

					//console.log(this._UnicodeCnsCollision);

					this.createCin();
					this.logInvalidPhonetic();
					this.logUnicodeCollision();



				},


				orderBy_Phonetic: function(a, b) {
					//console.log(a);
					//console.log(a.phonetic_keyseq.localeCompare(b.phonetic_keyseq));
					//return a.phonetic_keyseq.localeCompare(b.phonetic_keyseq);

					var aa = a.phonetic_keyseq + '-' + a.grp + '-' + a.cns;
					var bb = b.phonetic_keyseq + '-' + b.grp + '-' + b.cns;

					return aa.localeCompare(bb);

					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
					//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
				},

				createCin: function() {
					var char_def = '';
					var csv = '';

					//補48個空白行，讓「CnsPhonetic.csv」的行數可以跟「CnsPhonetic.cin」對齊
					for (var i=0; i<48; i++) {
						csv += util.EOL;
					}

					csv += this.makLine_Csv_Head();


					this._PhoneticList.sort(this.orderBy_Phonetic);

					for (var item of this._PhoneticList) {
						char_def += this.makLine_CharDef(item);
						csv += this.makLine_Csv(item);
					}



					cin.File.newInstance()
						.setContent_KeyName(this._PhoneticKey.toString())
						.setContent_CharDef(char_def)
						.save()
					;

					util.File.newInstance()
						.setPath('CnsPhonetic.csv')
						.setContent(csv)
						.save()
					;
				},

				logInvalidPhonetic: function() {
					var rtn = '';
					rtn += this.makLine_Csv_Head();

					for (var item of this._InvalidPhonetic) {
						rtn += this.makLine_Csv(item);
					}

					util.File.newInstance()
						.setPath('InvalidPhonetic.csv')
						.setContent(rtn)
						.save()
					;

				},

				logUnicodeCollision: function() {
					var rtn = '';
					rtn += this.makLine_Csv_Head();
					//console.log(this._UnicodePhoneticCollision)

					for (var list of this._UnicodePhoneticCollision) {
						if (list.length > 1) {
							rtn += this.eachUnicodeCollisionList(list);
						}
					}

					util.File.newInstance()
						.setPath('CollisionList.csv')
						.setContent(rtn)
						.save()
					;
				},

				eachUnicodeCollisionList: function(list) {
					var rtn = '';

					for (var item of list) {
						rtn += this.makLine_Csv(item);
					}

					return rtn;
				},

				makLine_CharDef: function(item) {
					var rtn = '';
					rtn += item.phonetic_keyseq;
					rtn += util.SEGMENT;
					rtn += item.unicode_string;
					rtn += util.EOL;
					return rtn;
				},

				makLine_Csv: function(item) {
					var rtn = '';
					rtn += util.QUOTE;
					rtn += item.phonetic_keyseq;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.phonetic;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.unicode_string;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.unicode;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cns;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.grp;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cnsphonetic_file;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cnsphonetic_line;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cnsunicode_file;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cnsunicode_line;
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += item.cns_url;
					rtn += util.QUOTE;

					rtn += util.EOL;
					return rtn;
				},

				makLine_Csv_Head: function(item) {
					var rtn = '';
					rtn += util.QUOTE;
					rtn += '鍵盤按鍵';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += '注音符號';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += '中文字';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'unicode (hex)';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cns';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'grp';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cnsphonetic_file';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cnsphonetic_line';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cnsunicode_file';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cnsunicode_line';
					rtn += util.QUOTE;

					rtn += util.SEGMENT;

					rtn += util.QUOTE;
					rtn += 'cns網址';
					rtn += util.QUOTE;

					rtn += util.EOL;
					return rtn;
				},


				_End: 'Object converter.CnsToCin',
			};
	        return obj;
	    },
	    getInstance: function() {
	        if (this._Instance === null) {
	            this._Instance = this.newInstance();
	        }

	        return this._Instance;
	    },
	    _Instance: null,
	    _End: 'Class converter.CnsToCin'
	};



	converter.CnsToCin.newInstance()
		.run()
	;

	console.log('end');
}();
