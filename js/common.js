//处理路由相关
var QandA = {
	single: singleQ,
	multiple: multipleQ,
	trueOrFalse: trueOrFalseQ
}

var router = {
	getHtmlName: function(url) {
		var lastIndex = url.lastIndexOf('/');
		var htmlName = url.substr(lastIndex + 1);
		return htmlName;
	},
	push: function(url, param) {
		var htmlName = router.getHtmlName(url);
		localdata.save(htmlName, param);
		window.location.href = url;
	},
	getArgs: function() {
		var url = window.location.href;
		var htmlName = router.getHtmlName(url);
		return localdata.fetch(htmlName);
	},
	pushToExam: function(param) {
		localdata.save("examPage.html", param);
		window.location.href = "examPage.html";
	},
	examGetArgs: function() {
		var htmlName = router.getHtmlName("examPage.html");
		return localdata.fetch(htmlName);
	}
}

//处理内部存储问题
var localdata = {
	save: function(key, value) {
		var jsonStr = JSON.stringify(value);
		localStorage.setItem(key, jsonStr);
	},
	fetch: function(key, defalutValue) {
		var jsonStr = localStorage.getItem(key);
		if(jsonStr == "null" || jsonStr == null) {
			return defalutValue;
		}
		return JSON.parse(jsonStr);
	}
}

//记录考试情况，升高错题频率，降低对题频率
var recorder = {
	keys: {
		single: "SINGLE_RESULT",
		multiple: "MULTIPLE_RESULT",
		trueOrFalse: "TRUEORFALSE_RESULT"
	},
	single: {
		record: function(examResults) {
			return recorder.record(recorder.keys.single, examResults);
		},
		all: function() {
			return recorder.all(recorder.keys.single);
		}
	},
	multiple: {
		record: function(examResults) {
			return recorder.record(recorder.keys.multiple, examResults);
		},
		all: function() {
			return recorder.all(recorder.keys.multiple);
		}
	},
	trueOrFalse: {
		record: function(examResults) {
			return recorder.record(recorder.keys.trueOrFalse, examResults);
		},
		all: function() {
			return recorder.all(recorder.keys.trueOrFalse);
		}
	},
	record: function(key, examResults) {
		var results = localdata.fetch(key);
		if(results == null) {
			results = {};
		}
		var rights = [],
			wrongs = [];

		for(var no in examResults) {
			var count = results[no];
			if(count == null) {
				count = 0;
			}
			if(examResults[no] == true) {
				if(count > 0) {
					results[no] = count - 1;
				}
				rights.push(no);
			} else {
				results[no] = count + 1;
				wrongs.push(no);
			}
		};
		localdata.save(key, results);
		return [rights, wrongs];
	},
	all: function(key) {
		var dict = localdata.fetch(key);
		if(dict == null) {
			dict = {};
		}
		//转化数据表示方式
		var tempArray = [];
		for(var no in dict) {
			if(dict[no] > 0) {
				tempArray.push({
					"no": no,
					"count": dict[no]
				});
			}
		}
		//排序
		tempArray = tempArray.sort(function(a, b) {
			return a.count - b.count;
		});
		var wrongArray = tempArray.map(function(curValue) {
			return curValue.no;
		});
		return wrongArray;
	}
}

var collect = {
	keys: {
		single: "SINGLE_COLLECT",
		multiple: "MULTIPLE_COLLECT",
		trueOrFalse: "TRUEORFALSE_COLLECT"
	},
	single: {
		add: function(no) {
			return collect.add(collect.keys.single, no);
		},
		remove: function(no) {
			return collect.remove(collect.keys.single, no);
		},
		all: function() {
			return collect.all(collect.keys.single);
		},
		dict: function() {
			return collect.dict(collect.keys.single);
		}
	},
	multiple: {
		add: function(no) {
			return collect.add(collect.keys.multiple, no);
		},
		remove: function(no) {
			return collect.remove(collect.keys.multiple, no);
		},
		all: function() {
			return collect.all(collect.keys.multiple);
		},
		dict: function() {
			return collect.dict(collect.keys.multiple);
		}
	},
	trueOrFalse: {
		add: function(no) {
			return collect.add(collect.keys.trueOrFalse, no);
		},
		remove: function(no) {
			return collect.remove(collect.keys.trueOrFalse, no);
		},
		all: function() {
			return collect.all(collect.keys.trueOrFalse);
		},
		dict: function() {
			return collect.dict(collect.keys.trueOrFalse);
		}
	},
	add: function(key, no) {
		var current = localdata.fetch(key, {});
		current[no] = true;
		localdata.save(key, current);
	},
	remove: function(key, no) {
		var current = localdata.fetch(key, {});
		delete current[no];
		localdata.save(key, current);
	},
	dict: function(key) {
		return localdata.fetch(key, {});
	},
	all: function(key) {
		var current = localdata.fetch(key, {});
		var result = [];
		for(var i in current) {
			result.push(i);
		}
		return result;
	}
}