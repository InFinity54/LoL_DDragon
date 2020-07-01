/* START OF FILE - core.js */
/**
 * @class Riot
 * @singleton
 * The global riot games namespace.
 */
/**
 * @class Riot.DDragon
 * @singleton
 * The global Data Dragon class.
 */
/**
 * @class Riot.DDragon.fn
 * @singleton
 * An object used to store all static utility function.
 */
Riot.DDragon.fn = {};

Riot.DDragon.dataTypes = ['item','champion','mastery','rune','summoner','language'];

(function()
{
	var rg = Riot,
		dd = rg.DDragon,
		fn = dd.fn;
	
	fn.isArray = function (item)
	{
		return Object.prototype.toString.call(item) === '[object Array]';
	};
	/**
	 * @method
	 * This requires the ajax functions within loader.js. This simplifies and attaches the functions
	 * together but targets the data to json packets only.
	 * @param {String} file The file to load.
	 * @param {Function} callback The callback function to execute when the data is returned.
	 */
	fn.getJSON = function (file,c)
	{
		if(dd.xhr.ready)
		{
			dd.xhr.load(file, function(data)
			{
				c(JSON.parse(data));
			});
		}
		else
		{
			var m = /([A-Za-z0-9]+)\.json/.exec(file);
			
			window['rg_data_callback_'+m[1]] = function(data)
			{
				c(data);
			};
			
			dd.jsonp(file+'p');
		}
	};
	
	/** 
	 * @method
	 * Attaches a new stylesheet to the page.
	 * @param {String} file The url to the desired stylesheet.
	 */
	fn.getCSS = function (file)
	{
		var s = document.createElement('link');
		
		s.rel = 'stylesheet';
		s.type = 'text/css';
		s.href = file;
		
		fn.$('head',true)[0].appendChild(s);
	};
	
	/**
	 * @method
	 * This merges each argument after data 'under' the data object effectively treating each
	 * additional object passed as a default to the one before it.
	 * 	function myFunc (config) {
	 * 		config = rg.dd.fn.rebase(config, {
	 * 			conditions: true,
	 * 			actions: true
	 * 		});
	 * 	
	 * 		if (config.conditions) {
	 * 			console.log('Conditions Run!');
	 * 		}
	 * 	
	 * 		if (config.actions) {
	 * 			console.log('Actions Run!');
	 * 		}
	 * 	}
	 * 	
	 * 	myFunc({
	 * 		conditions: false
	 * 	});
	 * 	
	 * 	//logs 'Actions Run!'
	 * @param {Object} data The base object being merged into.
	 * @param {Object...} under The objects used to default the base data object.
	 * @return {Object} The merged object.
	 */
	fn.rebase = function (data)
	{
		var i = 0,
			j = arguments.length,
			under,prop,type;
		
		while (++i < j)
		{
			under = arguments[i];
			
			for (prop in under)
			{
				if (under.hasOwnProperty(prop))
				{
					type = typeof(under[prop]);
					
					// We add base to that prop, since it's missing
					if(typeof(data[prop]) === 'undefined')
					{
						if(type === 'object')
						{
							fn.rebase(data[prop] = (fn.isArray(under[prop])?[]:{}),under[prop]);
						}
						else
						{
							data[prop] = under[prop];
						}
					}
					else
					{
						// We only extend it further when dealing with objects / Arrays
						if(type === 'object' && !(typeof(data[prop]) === 'function'))
						{
							fn.rebase(data[prop],under[prop])
						}
					}
				}
			}
		}
		
		return data;
	};

	/**
	 * @method
	 * This takes a base object and crawls up its heirarchy using path. Path is period delimited as
	 * a normal object path.
	 * 	var myObj = {
	 * 		stuff: {
	 * 			box: {
	 * 				color: 'red'
	 * 			},
	 * 			socks: true
	 * 		},
	 * 		moves: false
	 * 	};
	 * 	
	 * 	rg.dd.fn.objectDig(myObj, 'stuff.box.color'); //returns 'red'
	 * 	rg.dd.fn.objectDig(myObj, 'stuff.box.contents'); //returns false
	 * @param {Object} obj The object to traverse.
	 * @param {String} path The path to the desired value.
	 * @return {Object}
	 * The value of the item the path points to. Returns null if the path cannot be followed.
	 */
	fn.objectDig = function(obj,path)
	{
		var i, j;
		
		if (typeof(obj) === 'undefined')
		{
			return null;
		}
		
		if (typeof(path) === 'undefined')
		{
			return null;
		}
		
		if (path.indexOf('.') !== -1) {
			path = path.split('.');
			
			for(i = 0, j = path.length; i < j; i++)
			{
				if(typeof(obj[path[i]]) === 'undefined')
				{
					return null;
				}
				
				obj = obj[path[i]];
			}
			
			return obj;
		}
		else
		{
			return obj[path];
		}
	};
	
	/** 
	 * @method
	 * Executes the specified opperation on a and b and returns the result.
	 * 	rg.dd.fn.sMath(1, '+', 2); //returns 3
	 * 	rg.dd.fn.sMath(2, '/', 2); //returns 1
	 * 	rg.dd.fn.sMath('hello world!', '->', 'world'); //returns true
	 * @param {Number/String} a The first parameter.
	 * @param {String} op The operation to perform. The available operations are:
	 * =. ==, ===, !=, !==, >, >=, <, <=, +, -, /, *, %, and ->. Most of these are self
	 * explanatory, however the "->" operation checks to see if the first parameter contains the second parameter.
	 * @param {Number/String} b The second parameter.
	 */
	// This is significantly faster than causing the javascript interpreter to do the work
	fn.sMath = function (a, op, b)
	{
		switch(op)
		{
			case '=':
			case '==':
			case '===':
				return (a == b);
			case '!=':
			case '!==':
				return (a != b);
			case '>':
				return (a > b);
			case '<':
				return (a < b);
			case '>=':
				return (a >= b);
			case '<=':
				return (a <= b);
			case '+':
				return (a + b);
			case '-':
				return (a - b);
			case '/':
				return (a / b);
			case '*':
				return (a * b);
			case '%':
				return (a % b);
			case '->':
				return (a.indexOf(b) !== -1);
			default:
				return false;
		}
	};
	
	/**
	 * @method
	 * Creates a div element.
	 * @param {Object} [options] The options object.
	 * @param {String} [options.classes] The classes to apply to the div.
	 * @param {String} [options.style] The styles to apply to the div.
	 * @param {HTMLElement} [options.append] The parent element the div should be appended to.
	 * @param {Object} [options.data] A set of key value pairs used to define data attributes.
	 * @return {HTMLElement} The created div.
	 */
	fn.mkDiv = function (options)
	{
		var r = document.createElement('div'),
			i,j;
		
		if (typeof(options) === 'object')
		{
			if (typeof(options.classes) === 'string')
			{
				r.className = options.classes;
			}
			
			if (typeof(options.style) === 'string')
			{
				r.style.cssText = options.style;
			}
			
			if (typeof(options.append) !== 'undefined')
			{
				options.append.appendChild(r);
			}
			
			if (typeof(options.data) === 'object')
			{
				for (i = 0, j = options.data.length; i < j; i++)
				{
					r.setAttribute('data-'+options.data[i].k,options.data[i].v);
				}
			}
		}
		
		return r;
	};
	
	/**
	 * @method
	 * Removes the specified element. Internally this is only used on created divs.
	 * @param {HTMLElement} div The element to remove.
	 */
	fn.rmDiv = function (div)
	{
		div.parentNode.removeChild(div);
	};
	
	/** 
	 * @method
	 * Checks to see if the specified text contains the given word.
	 * @param {String} text The text to search.
	 * @param {String} word The word to search for.
	 * @return {Boolean} Whether the word was found or not.
	 */
	fn.hasWord = function (text, word)
	{
		return (new RegExp("(?:^|\\s)"+word+"(?!\\S)",'g')).test(text);
	};
	
	/**
	 * @method
	 * Removes the given word from the specified text.
	 * @param {String} text The text to search.
	 * @param {String} word The word to remove.
	 * @return {String} The resulting text.
	 */
	fn.removeWord = function(text,word)
	{
		return text.replace(new RegExp("(?:^|\\s)"+word+"(?!\\S)",'g'),'');
	};
	
	/** 
	 * @method
	 * Checks to see if the specified text contains the given word preceding an equals and a value.
	 * @param {String} text The text to search.
	 * @param {String} word The word to search for.
	 * @return {Object/Boolean} Returns either false or the resulting value
	 */
	fn.hasValue = function (text, word)
	{
		var reg = new RegExp("(?:^|\\s)"+word+"=([^\\s\\t\\n]*)(?!\\S)"), m;
		if(m = reg.exec(text))
		{
			return m[1];
		}
		else
		{
			return false;
		}
	};
	
	/**
	 * @method
	 * Removes the given word=value from the specified text.
	 * @param {String} text The text to search.
	 * @param {String} word The word to remove.
	 * @return {String} The resulting text.
	 */
	fn.removeValue = function(text,word)
	{
		return text.replace(new RegExp("(?:^|\\s)"+word+"=([^\\s\\t\\n]*)(?!\\S)",'g'),'');
	};
	
	/**
	 * @method
	 * Detects if the specified element has the given class.
	 * @param {HTMLElement} elem The element to check.
	 * @param {String} className The class to search for.
	 * @return {Boolean} Whether the class was found or not.
	 */
	fn.hasClass = function(elem,class_)
	{
		return fn.hasWord(elem.className,class_);
	};
	
	/** 
	 * @method
	 * Adds the given class to the specified element.
	 * @param {HTMLElement} elem The element to add to.
	 * @param {String} className The class to add.
	 */
	fn.addClass = function(elem,class_)
	{
		elem.className += ' '+class_;
	};
	
	/**
	 * @method
	 * Removes the specified class from the element.
	 * @param {HTMLElement} elem The element to remove the class from.
	 * @param {String} className The class to remove.
	 */
	fn.removeClass = function(elem, className)
	{
		elem.className = fn.removeWord(elem.className,className);
	};
	
	/**
	 * @method
	 * Removes a class from all siblings and adds it to the element
	 * @param {HTMLElement} elem The element to add the class to.
	 * @param {String} className The class to add to the element.
	 */
	fn.radioClass = function(elem, className)
	{
		var children = elem.parentNode.childNodes,
			i = children.length;
		
		while(i--)
		{
			if(children[i].className)
			{
				fn.removeClass(children[i], className);
			}
		}
		
		fn.addClass(elem, className);
	};
	
	/**
	 * @method
	 * Retrieves a duplicate of the given element's childNodes. This verson will not auto update
	 * when the element's childNodes change.
	 * @param {HTMLElement} elem The element to pull childNodes from.
	 * @return {HTMLElement[]} A non living duplicate of the element's childNodes.
	 */
	fn.deadChildren = function (elem)
	{
		if (elem.hasChildNodes())
		{
			var children = elem.childNodes,
				dead = [],
				i, length;
			
			for (i = 0, length = children.length; i < length; i = i + 1)
			{
				dead.push(children[i]);
			}
			
			return dead;
		}
		
		return [];
	};
	
	// Internals used for templating
	var twigVarReg = /{{ (.+?) }}/;
	
	/** 
	 * @method
	 * Does a simple token replacement on the given template.
	 * @param {String/String[]} template The template that will be the subject of the replacement.
	 * @param {Object} data The key / value pairs to be substituded.
	 * @return {String} The resulting string.
	 */
	fn.format = function (template, data)
	{
		if (fn.isArray(template))
		{
			template = template.join('');
		}
		
		var twigMatch;
		
		while(twigMatch = twigVarReg.exec(template))
		{
			template = template.replace(twigVarReg, fn.objectDig(data, twigMatch[1]));
		}
		
		return template;
	};
	
	/**
	 * @method
	 * Itterates over the given array, executing the supplied function on each. If the function
	 * ever returns false, the itteration will stop.
	 * @param {Array} arr The array to be itterated over.
	 * @param {Function} func The function to be executed.
	 */
	fn.each = function (arr, func)
	{
		if (!fn.isArray(arr))
		{
			func(arr, 0);
			
			return;
		}
		
		for (var i = 0, length = arr.length; i < length; i = i + 1)
		{
			if (func(arr[i], i) === false)
			{
				return;
			}
		}
	};
	
	/**
	 * @method
	 * Retrieves data from an element. This doesn't have the permission controls that
	 * {@link #rgInfo} has so be careful when using it.
	 * @param {HTMLElement} elem The element to pull data off of.
	 * @param {String} attr The name of the attribute to pull data from.
	 * @return {String} The data pulled. If the data is not found, false will be returned.
	 */
	fn.rgData = function (elem, attr)
	{
		var r = elem.getAttribute('data-rg-'+attr);
		
		return (r === null || r === ''? false : r);
	};
	
	// Retrieves a data object, representing the most common rg data types
	/**
	 * @method
	 * Retrieves the data attribute from an element tree. This will bubble up the DOM until either the depth is
	 * reached, or the data is found.
	 * @param {HTMLElement} elem The element to pull data off of.
	 * @param {Number} depth The maxiumum bubble depth.
	 * @return {Object} data The data pulled. If the data is not found, false will be returned.
	 * @return {String} data.name The rgData for name.
	 * @return {String} data.id The rgData for id.
	 * @return {String} data.aux The rgData for aux.
	 */
	fn.rgInfo = function (elem, depth)
	{
		var r;
		
		while (depth)
		{
			// This catches element permission problems
			try
			{
				r = elem.getAttribute('data');
			}
			catch (e)
			{
				return false;
			}
			
			r = {
				name: fn.rgData(elem,'name'),
				id: fn.rgData(elem,'id'),
				aux: fn.rgData(elem,'aux')
			};
			
			r = (r.name === false && r.id === false && r.aux === false? false : r);
			
			if (r !== false)
			{
				return r;
			}
			
			if (--depth)
			{
				elem = elem.parentNode;
			}
		}
		
		return r;
	};
	
	/** 
	 * @method
	 * Creates a test object to be used with {@link #runTest}. This will convert comparison strings
	 * into something that runTest can rapidly check.
	 * @param {String} testString The string that needs to be converted into a test.
	 * testString is normally structured as "(type)(path)(operator)(compareValue)(|...)"
	 * (type) is either "!" or empty. If it's "!", then the return is inversed.
	 * (path) is an objectDig path. {@link #objectDig}
	 * (operator) is either a regex operator (*=, ^=, or $=) or a sMath operator {@link #sMath}
	 * (compareValue) is the value to compare or use for the operation
	 * (|...) multiple tests can be "or"ed over a single bar. Each additional test uses the same
	 * format as before. runTest will run them all and return true if any return true.
	 * @return {Object} The resulting test object, or false if the object could not be created.
	 */
	fn.makeTest = function(testString)
	{
		var testMatch, testObject;
		// Blank strings autosucceed
		if(testString == '')
		{
			return true;
		}
		
		if(testMatch = /^(\!?)([a-zA-Z][a-zA-Z0-9\.]*)(\->|\*=|\^=|\$=|===|==|=|<=|<|>=|>|\+|\-|\*|\/|%)?([^\|]*)?(\|.+)?$/.exec(testString))
		{
			// Create the basic test object and determine if there's an inversion on it
			testObject = {'key':testMatch[2],'inv':(testMatch[1]==='!')};
			
			// If there's no op to compare with, we only check for the existence of the given key
			if(typeof(testMatch[3]) === 'undefined')
			{
				testObject.det = 1;
			}
			else
			{
                if(typeof(testMatch[4]) === 'undefined')
                {
                    testMatch[4] = '';
                }
				// The regexs can fail at creation. We need to catch this and fail gracefully
				try
				{
					// Switch among the various possibilities for the operator
					switch(testMatch[3])
					{
						// Regular Expression Digs
						case '*=':
							testObject.det = 2;
							testObject.reg = new RegExp(testMatch[4],'i');
						break;
						case '^=':
							testObject.det = 2;
							testObject.reg = new RegExp('^'+testMatch[4],'i');
						break;
						case '$=':
							testObject.det = 2;
							testObject.reg = new RegExp(testMatch[4]+'$','i');
						break;
						// We don't let this fall to default in order to avoid .test errors against arrays
						case '->':
							testObject.det = 3;
							testObject.evOp = '->';
							testObject.evVs = testMatch[4];
						break;
						// Basic math digs
						default:
							testObject.det = 3;
							testObject.evOp = testMatch[3];
							// If there is something other than basic numbers, we don't parse it in to a number
							// This is just in case there might be a case of "string=string"
							if (/[^0-9\.]/.test(testMatch[4]) || testMatch[4] === '')
							{
								testObject.evVs = testMatch[4];
							}
							else
							{
								testObject.evVs = parseFloat(testMatch[4]);
							}
						break;
					}
				}
				catch(e)
				{
					testObject = false;
				}
			}
			
			// Or Series
			if(testMatch[5])
			{
				testObject.or = fn.makeTest(testMatch[5].substring(1));
			}
			
			// Return
			return testObject;
		}
		
		// Long lists of test strings also always succeed.
		// In expected cases, this shouldn't happen often (which is why it rests after the major brunt of the test making)
		if (/^\s+$/.test(testString))
		{
			return true;
		}
		
		return false;
	};
	
	/**
	 * @method
	 * Executes a test provided by {@link Riot.DDragon.fn#makeTest} on the given data.
	 * @param {Object} data The data to be tested.
	 * @param {Object} test The test object to be executed.
	 * @return {Boolean} Whether the test was successful or not.
	 */
	fn.runTest = function (data,test)
	{
		function testReturn(result)
		{
			if (test.inv)
			{
				result = !result;
			}

			// Test if there's an or. If there is, and the result is still false, we keep going til we get a true
			if(test.or && result === false)
			{
				return result || fn.runTest(data, test.or);
			}
			return result;
		}
	
		// Sometimes tests can just be definitively true or false
		if(typeof(test) === 'boolean')
		{
			return test;
		}
		
		var dataPiece = fn.objectDig(data,test.key);
		
		// If there was bad data digging, we end here
		if(dataPiece === null) return testReturn(false);
		
		// There are 3 different types of tests
		// 2 and 3 are subject to user input error, so we need to fail gracefully in those cases
		try
		{
			switch(test.det)
			{
				// This detects if the key value simply exists
				// Since that test is actually required before this point, we need to do nothing.
				case 1: return testReturn(true);
				
				// This tests a regular expression
				case 2:
					return testReturn(test.reg.test(dataPiece));
				break;
				
				// This math tests the code
				case 3:
					return testReturn(fn.sMath(dataPiece,test.evOp,test.evVs));
				break;
			}
		}
		catch(e)
		{
			return testReturn(false);
		}
		
		// If it somehow gets here, something really bad happend. Test failed
		return testReturn(false);
	};
	
	// Minor worker function for getImg and sizing
	function getImgSize(val, size)
	{
		switch(size)
		{
			default:
			case 'normal': return val;
			case 'small': return parseInt(val * 0.75);
			case 'tiny': return parseInt(val * 0.5);
		}
	}
	
	/**
	 * @method
	 * Builds an image from the passed object. The object requires a dragontail formatted image
	 * property.
	 * @param {Object} obj The data object to build the image off of.
	 * @param {Object} options The configuration object for the image.
	 * @param {String} [options.src='sprite']
	 * The source of the image desired. Can be sprite, full, loading, or splash.
	 * @param {String} [options.version=''] The version of the data to pull the image from.
	 * @param {String} [options.group=''] The group to pull the image from.
	 * @param {String} [options.cap=''] The image file name.
	 * @param {Number} [options.wrap=2]
	 * The wrap level for the image. 2 places a ful html wrapper around it (<div> or <img). 1 is for
	 * sprites only and just places the rest of the sprite styling with it.
	 * @param {String} [options.classes=''] Any additional classes to add to the wrapper.
	 * @param {String} [options.attrs=''] Any additional attributes to add to the wrapper.
	 * @param {Number} [options.skin=0] Default skin number to use for loading and splash images (limited use).
	 * @param {Boolean} [options.gray=false] Whether or not to use a grayscale version of the image (limited use).
	 * @param {String} [options.size=normal] Which sprite size we should use. Options are normal, small (36x36) and tiny (24x24)
	 * @return {String} The generated image html.
	 */
	fn.getImg = function(obj,options)
	{
		if(!obj.image)
		{
			return '<span data-rg-error="getImg('+obj.id+')"></span>';
		}
		var img = obj.image,
		// Defaults
			basic = {
				src: 'sprite',
				path: '',
				version: '',
				group: '',
				cap: '',
				// Wrap is a "level" of ways to wrap the result
				// 2 places a full html wrapper around it (<div> or <img>)
				// 1 is for sprites only and just places the rest of the sprite styling with it.
				wrap: 2,
				
				// Classes to add to the wrap
				classes: '',
				
				// Attributes to add to the wrap
				attrs: '',
				
				// Skin number (for loading and splash)
				skin: 0,
				
				// Can opt to use grayscale versions
				gray: false,
				
				// Sprite sizes
				size: 'normal'
			},
			// Pre and Post are used to construct wrappers
			pre = '',post = '';
		
		if(typeof(options) !== 'object')
		{
			var options = basic;
		}
		else
		{
			options = fn.rebase(options,basic);
		}
		// Individual objects may have their own versioning
		if(typeof(obj.version) === 'string')
		{
			options.version = obj.version+'/';
		}
		else if(options.version !== '')
		{
			options.version += '/';
		}
		
		// The different pathing constructs based on src
		switch(options.src)
		{
			case 'sprite':
				options.group = 'sprite';
				options.cap = img.sprite;
				if(options.wrap > 0)
				{
					pre = 'height:'+getImgSize(img.h, options.size)+'px; width:'+getImgSize(img.w, options.size)+'px; background: url(\'';
					post = '\') -'+getImgSize(img.x, options.size)+'px -'+getImgSize(img.y, options.size)+'px no-repeat;';
					if(options.wrap > 1)
					{
						pre = '<div class="img '+options.classes+'" style="'+pre;
						post = post+'" '+options.attrs+'></div>';
					}
				}
			break;
			
			case 'full':
				options.group = img.group;
				options.cap = img.full;
				if(options.wrap > 1)
				{
					pre = '<img class="'+options.classes+'" src="';
					post = '" '+options.attrs+' />';
				}
			break;
			
			case 'loading':
				options.group = img.group + '/loading';
			case 'splash':
				if(options.group === '')
				{
					options.group = img.group + '/splash';
				}
				options.version = '';
				options.cap = obj.id + '_' + options.skin + '.jpg';
				
				if(options.wrap > 1)
				{
					pre = '<img class="'+options.classes+'" src="';
					post = '" '+options.attrs+' />';
				}
			break;
		}
		if(options.gray)
		{
			options.cap = 'gray_' + options.cap;
		}
		if(options.size !== 'normal')
		{
			options.cap = options.size + '_' + options.cap;
		}
		// The full construct:
		// cdn version / img / (path?) group / cap
		
		return pre+dd.m.cdn+options.version+'img/'+options.path+options.group+'/'+options.cap+post;
	};
	
	/**
	 * Selects elements based on a class name, starting from an optional point in the DOM
	 * @param {String} class The class name to hunt for
	 * @param {HTMLElement} context The optional element to search from
	 * @return {HTMLElement[]} The selected elements.
	 */
	fn.getElementsByClassName = (function()
	{
		var body = document.getElementsByTagName('body')[0];
		if(document.getElementsByClassName)
		{
			return function(className, context)
			{
				context = context || body;
				return context.getElementsByClassName(className);
			}
		}
		else
		{
			return function(className, context)
			{
				context = context || body;
				
				var elems = context.getElementsByTagName('*'),
					i, j, el, r = [];
				
				for(i=0, j = elems.length; i<j; ++i)
				{
					el = elems[i];
					if(fn.hasClass(el, className))
					{
						r.push(el);
					}
				}
				return r;
			};
		}
	})();
	
	
	// This is the caching area for fn.$
	dd.fn$data = {};
	
	/**
	 * A mappable selector function. The default is a very very simple selector service.
	 * @param {String} selector The selector string.
	 * @param {HTMLElement} context The root element to start the selection from.
	 * @return {HTMLElement[]} The selected elements.
	 */
	dd.fn$serve = function(selector,context)
	{
		var context = context || document,h;
		switch(selector.charAt(0))
		{
			case '#':
				h = context.getElementById(selector.substring(1));
				if(h === null) return [];
				return [h];
			case '.':
				return fn.getElementsByClassName(selector.substring(1), context);
			default:
				return context.getElementsByTagName(selector);
		}
	};
	
	/**
	 * @method
	 * Executes the given selector returning the result. Also gives the option of caching the
	 * result.
	 * @param {String} selector The selector string.
	 * @param {boolean} preselect Whether or not to cache the results.
	 * @return {HTMLElement[]} The selected elements.
	 */
	fn.$ = function(selector, preselect)
	{
		var target;
		if(preselect)
		{
			target = dd.fn$data[selector];
		}
		if(typeof(target) === 'undefined')
		{
			target = dd.fn$serve(selector);
			if(preselect)
			{
				dd.fn$data[selector] = target;
			}
		}
		return target;
	};
	
	// Error facing
	fn.er = function(error,loc,message)
	{
		var e = 'ERROR: '+message+' at [ddragon.'+loc+']';
		if(typeof(console) !== 'undefined' && typeof(console.log) !== 'undefined')
		{
			console.log(e);
		}
        setTimeout((function()
        {
            throw error;
        }), 1);
		return '<p><b>'+e+'</b></p>';
	};
	
	/**
	 * @method
	 * This is based on Dean Edward's event bind system but has been mutilated heavily. The actual
	 * event passed around by it is a partially normalized wrapper.
	 * @param {HTMLElement} element The element to attach an event to.
	 * @param {String} type The event type to listen for.
	 * @param {Function} callback The function to call when the event fires.
	 * @return {Function} The generated handler.
	 */
	fn.addEvent = function(element, type, callback)
	{
		if(typeof(element) === 'string')
		{
			element = fn.$(element)[0];
		}
		// create a hash table of event types for the element, as well event type data
		if(!element.events) element.events = {};
		
		// The real handler
		function handler(event)
		{
			var data = {
				target:(fixEvent.windowTarget?event.srcElement:event.target),
				event:event,
				type:type,
				button:false,
				buttonRestrict:-1
			};
			if(type === 'mousedown' || type === 'mouseup')
			{
				data.button = fixEvent.buttonData[event.button];
			}
			callback.call(this ,data);
		};
		// create a hash table of event handlers for each element/event pair. This also gives us an array for easy obliteration
		element.events[type] = element.events[type] || {
			handles:[]
		};
		
		// Store the handler for easy obliteration
		element.events[type].handles.push(handler);
		
		if(element.addEventListener)
		{
			element.addEventListener(type, handler, false);
		}
		else
		{
			// assign each event handler a unique ID
			if(!handler.$$guid) handler.$$guid = fn.addEvent.guid++;
			// store the event handler in the hash table
			element.events[type][handler.$$guid] = handler;
			// assign a global event handler to do all the work
			element["on" + type] = handleEvent;
		}
		
		// Return the handler so we can obliterate it later if we want
		return handler;
	};
	// a counter used to create unique IDs
	fn.addEvent.guid = 1;
	
	/**
	 * @method
	 * Removes a listener from the specified element.
	 * @param {HTMLElement} element The element to remove the listener from.
	 * @param {String} type The event type the handler is listening for.
	 * @param {Function} handler The handler created by {@link #addEvent}
	 */
	fn.removeEvent = function(element, type, handler)
	{
		// Single removal
		if(handler)
		{
			if(element.removeEventListener)
			{
				element.removeEventListener(type, handler, false);
			}
			else
			{
				// delete the event handler from the hash table
				if(element.events && element.events[type])
				{
					delete element.events[type][handler.$$guid];
				}
			}
		}
		// Mass removal
		else if(element.events && element.events[type])
		{
			var handler;
			while(handler = element.events[type].handles.pop())
			{
				fn.removeEvent(element, type, handler);
			}
		}
	};
	
	function handleEvent(event)
	{
		var returnValue = true,
			handlers, i;
		// grab the event object (IE uses a global event object)
		event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
		// get a reference to the hash table of event handlers
		handlers = this.events[event.type];
		// execute each event handler
		for(i in handlers)
		{
			if(handlers.hasOwnProperty(i) && typeof handlers[i] === 'function')
			{
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false)
				{
					returnValue = false;
				}
			}
		}
		return returnValue;
	};
	
	function fixEvent(event)
	{
		// add W3C standard event methods
		event.preventDefault = fixEvent.preventDefault;
		event.stopPropagation = fixEvent.stopPropagation;
		fixEvent.windowTarget = true;
		return event;
	};
	// window detection target type
	fixEvent.windowTarget = false;
	
	fixEvent.preventDefault = function()
	{
		this.returnValue = false;
	};
	
	fixEvent.stopPropagation = function()
	{
		this.cancelBubble = true;
	};
	
	// Figure out which button was pressed
	// Detect for a modern browser
	if(window.addEventListener)
	{
		fixEvent.buttonData = [0,0,2,0,1];
	}
	else
	{
		fixEvent.buttonData = [-1,0,1,2];
	}
	
	/**
	 * @method
	 * Watch a digged property of target element while that element is focused. Fires a callback
	 * on change.
	 * @param {HTMLElement} elem The element to watch.
	 * @param {String} dig The dig path for the property that needs to be watched. See: {@link #objectDig}.
	 * @param {Function} callback The function to call when the element changes.
	 */
	fn.watch = function(elem, dig, callback)
	{
		fn.addEvent(elem, 'focus', function(data)
		{
			function c()
			{
				var v = fn.objectDig(c.target,c.dig);
				if(v !== c.store)
				{
					callback(c.target,v,c.store);
					c.store = v;
				}
				c.timer = setTimeout(c,32);
			};
			function k()
			{
				clearTimeout(c.timer);
				fn.removeEvent(data.target, 'blur', k);
			};
			c.target = data.target;
			c.dig = dig;
			c.timer = setTimeout(c,32);
			c.store = false;
			fn.addEvent(data.target, 'blur', k);
		});
	};
	
	/**
	 * @class Riot.DDragon.fn.fire
	 * @singleton
	 * Fire group event system. This system allows us to setup and merge two different coding
	 * systems together, one system planning and another executing, without the issues.
	 */
	fn.fire = {
		data: {},
		/**
		 * @method
		 * Plans for an event execution.
		 * @param {String} group The event group to expect.
		 * @param {Object} planData A data objec that needs to be passed to the callback when the event fires.
		 * @param {Function} callback The callback to execute when the event fires. Has parameters planData, execData, then fireId
		 * @return {Number} A fireId that can be used to scrap the event
		 */
		plan: function(group,planData,callback)
		{
			if(typeof(fn.fire.data[group]) !== 'object')
			{
				fn.fire.data[group] = [];
			}
			return fn.fire.data[group].push({'planData': planData, 'callback': callback})-1;
		},
		/**
		 * @method
		 * Removes the specified plan.
		 * @param {String} group The event group to remove from.
		 * @param {Number} id The id of the plan to remove.
		 */
		scrap: function(group,id)
		{
			if(typeof(fn.fire.data[group]) === 'object')
			{
				fn.fire.data[group].splice(id,1);
			}
		},
		/**
		 * @method
		 * Executes a set of plans.
		 * @param {String} group The event group to execute.
		 * @param {Object} execData The data that needs to be passed to each handler.
		 */
		exec: function(group,execData)
		{
			if(typeof(fn.fire.data[group]) === 'object')
			{
				var i;
				for(i=0;i<fn.fire.data[group].length;i++)
				{
					fn.fire.data[group][i].callback(fn.fire.data[group][i].planData,execData,i);
				}
			}
		}
	};
})();


// This executes only once loader is ready to execute it.
// This is the start of the primary ddragon application.
Riot.DDragon.fn.init = function(selectorEngine)
{
	var w = window, rg = Riot, dd = Riot.DDragon, fn = dd.fn;
	
	// Remap the selectorEngine if one was passed
	if(arguments.length > 0) dd.fn$serve = selectorEngine;
/* END OF FILE - core.js */
// The models object stores the individual models that are created
// This allows all models to be accessed in a semi-global manner
// The standard format is simply dd.models[data type], however a call to dd.remodel may change this
dd.models = {};

// Model parsers are run based on reported data type
// Each model parser takes in the individual data object it's parsing
// This object is a reference, and can be manipulated directly here
// The overall context for the modelParser (this) refers to the whole model
dd.modelParsers = {
	'champion': [function(obj)
	{
		if(typeof obj.loadedPartial === 'undefined')
		{
			// Base attack speed should be calculated on the fly
			obj.stats.attackspeed = fn.calcAspd(1, obj.stats.attackspeedoffset, obj.stats.attackspeedperlevel);
			
			// Level 1 evaluations for fast reference
			var l1s = ['armor', 'attackdamage', 'hp', 'hpregen', 'mp', 'mpregen', 'spellblock'],
				l1, base, per;
			
			while(l1 = l1s.pop())
			{
				base = obj.stats[l1] * 1000;
				per = obj.stats[l1 + 'perlevel'] * 1000;
				obj.stats['l1' + l1] = (base + per) / 1000;
			}
			
			obj.loadedPartial = true;
		}
		if(obj.loadedFull)
		{
			
			// Spells should have versions on them
			var count = obj.spells.length;
			while(count--)
			{
				obj.spells[count].version = obj.version;
			}
		}
	}]
};

// General model parsers that affect an entire model
// Currently only used for the weird profileicon behaviour in the platform
dd.addModelParser('profileicon', function()
{
	this.remapFunc = function(id)
	{
		var numID = parseInt(id, 10);
		if(numID > dd.m.profileiconmax && numID < 500)
		{
			return '0';
		}
		return id;
	};
});

/**
 * @class Riot.DDragon.model
 * A wrapper class used to encompass the retrieval and manipulation of a type of data.
 * @param {String} dataSource Describes the overall model name and stored source location When this
 * has no specified data, dataSource will also specify data type.
 * @param {String} [dataVersion] specifies a specific version type to use 'single' may be used here
 * to specify a simple / individual break.
 * @param {Object[]} [data] A full data block, allowing specific data to be injected in to the
 * model.
 */
dd.model = function(dataSource,dataVersion,data)
{
	// Remapper
	var that = this;
	
	// If this model has finished initializing
	this.init = false;
	
	// An object reference to make sure we don't repeat AJAX calls
	// This can either contain 'all' or each id, with a status of true or false
	this.loading = {all:false};
	
	//java -jar compiler.jar --js $(FULL_CURRENT_PATH) --compilation_level ADVANCED_OPTIMIZATIONS --js_output_file $(CURRENT_DIRECTORY)\$(NAME_PART)-compiled.js
	
	// If this model is a special override case
	this.override = false;
	
	// This is a detector for if the keys are loaded (since they might be loaded in async)
	this.keysLoaded = false;
	
	// A name for this model. Important for keeping model recall functioning.
	this.name = dataSource;
	
	// We assume that we can't translate models by default (though usually language loading syncs up to where you always can)
	// Note: This is just auxilary translations, such as tags
	this.translated = false;
	
	// The methodology to loading the data.
	// By default, we load it all.
	this.format = 'all';
    
    // Pull out 'Full' types
    if(dataSource.substr(-4,4) === 'Full')
    {
        this.type = dataSource.substr(0, dataSource.length-4);
    }
    else
    {
        // Initial Type Info
        this.type = dataSource;
    }
	
	// We can use either manifest controlled versions or we can use specified versions of data
	if(typeof(dataVersion) === 'string')
	{
		this.version = dataVersion;
	}
	else
	{
		this.version = dd.m.n[this.type];
	}
	
	// Used to overwrite the remap functionality
	this.remapFunc = function(id)
	{
		return this.remapKeys[id];
	};
	
	// These two keys are used to help control localStorage
	// dl stores returned localstorage info, preparse
	// lsKey is the localStorage key to read and write from
	// lsKey also contains information about specific versions if this is a special version override call
	// This can be a different storage method as well. No data storage method is used for models by default as model data can get pretty big
	var dl;
	this.lsKey = 'rg_data_' + dd.m.l + '_' + dataSource + (this.override?'_'+this.version:'');
	
	
	// Data source location for faster ajax processing
	this.source = dd.m.cdn+this.version+'/data/'+dd.m.l+dataSource;
	
	// If Data was specified, it will attempt to load that
	// loadAll will parseJSON
	if(typeof(data) === 'string')
	{
		this.loadAll(data);
	}
	else
	{
		// This is where we would hook in storage methods
		// @TODO: Storage hook
		
		
		// If the data didn't initiate by this point, then we start loading from the CDN
		if(!this.init)
		{
			// Make sure we're not repeating ajax calls
			if(!this.loading.all)
			{
				this.loading.all = true;
				fn.getJSON(this.source+'.json',function(d)
				{
					that.loadAll(d);
					if(that.init)
					{
						that.makeKeys(that.data);
						fn.fire.exec('model',{'name':that.name});
					}
					that.loading.all = false;
				});
			}
		}
	}
};

/**
 * @method rename
 * Renames the model.
 * @param {String} name The new name of the model.
 * @return {Riot.DDragon.model} The renamed model.
 */
dd.model.prototype.rename = function(name)
{
	this.name = name;
	return this;
};

/**
 * @method makeKeys
 * Converts a data object into an array of data keys.
 * @param {Object} keySource The data source containing the desired keys.
 * @return {String[]} The resulting keys.
 */
dd.model.prototype.makeKeys = function(keySource)
{
	this.keys = [];
	this.remapKeys = {};
	for(var key in keySource)
	{
		if(keySource.hasOwnProperty(key))
		{
			if(keySource[key].key)
			{
				this.remapKeys[keySource[key].key] = key;
			}
			this.keys.push(key);
		}
	}
	this.keysLoaded = true;
};

/**
 * @method loadAll
 * Loads all data provided.
 * @param {String/Object} data Either a data object, or a parse-able JSON string.
 */
dd.model.prototype.loadAll = function(data)
{
	if(typeof(data) === 'string')
	{
		data = JSON.parse(data);
	}
	if(data.version === this.version)
	{
		this.data = data.data;
		this.keys = data.keys;
		this.init = true;
		if(typeof(data.basic) !== 'undefined')
		{
			this.basic = data.basic;
		}
		else
		{
			this.basic = false;
		}
		if(typeof(data.tree) !== 'undefined')
		{
			this.tree = data.tree;
		}
		else
		{
			this.tree = {};
		}
		if(typeof(data.format) !== 'undefined')
		{
			this.format = data.format;
		}
		else
		{
			this.format = 'all';
		}
		this.runFullParsers();
	}
};

/**
 * @method runFullParsers
 * Runs all model parsers associated with this model.
 */
dd.model.prototype.runFullParsers = function()
{
	if(dd.mps[this.type])
	{
		var that = this;
		fn.each(dd.mps[this.type],function(mp)
		{
			mp.call(that);
		});
	}
};

/**
 * @method addModelParser
 * @member Riot.DDragon
 * Adds a model parser and runs it on the given model type.
 * @param {String} type The model type this parser is associated with.
 * @param {Function} mp The data parsing function.
 */
dd.addModelParser = function(type, mp)
{
	dd.amp(type,mp);
	for(model in dd.models)
	{
		if(dd.models.hasOwnProperty(model))
		{
			if(model.type === type)
			{
				mp.call(model);
			}
		}
	}
};

/**
 * @method loadSingle
 * Loads a single piece of data into the model. This is normally called from {@link #getFull}.
 * @param {Object} data The data to load.
 */
dd.model.prototype.loadSingle = function(data)
{
	if(this.format === 'standAloneComplex')
	{
		if(typeof(data) === 'string')
		{
			data = JSON.parse(data);
		}
		fn.rebase(this.data,data.data);
	}
};

/**
 * @method parseData
 * Adds post-processing variables to the given object. Data added includes basic data, searchHash,
 * searchString, and whatever the associated modelParsers add.
 * @param {String} id The id of the data that needs to be parsed.
 */
dd.model.prototype.parseData = function(id)
{
	var obj = this.data[id];
	if(!obj.parsed || !this.translate)
	{
		if(!obj.parsed)
		{
			// Add the basics to this object
			if(typeof(this.basic) === 'object')
			{
				obj = fn.rebase(obj,this.basic);
			}
			
			// Run all the modelparsers
			if(typeof(dd.modelParsers[this.type]) !== 'undefined')
			{
				var i,j;
				for(i=0,j=dd.modelParsers[this.type].length;i<j;++i)
				{
					dd.modelParsers[this.type][i].call(this,obj);
				}
			}
			
			// For standAloneComplex data, we don't set the parse unless the individual data is loaded
			// This is incase models parsers wish to use full data information
			if(this.format === 'standAloneComplex')
			{
				if(!obj.loadedFull)
				{
					obj.loadedFull = false;
				}
				else
				{
					obj.parsed = true;
				}
			}
			else
			{
				obj.parsed = true;
			}
			
			// Add id field
			obj.id = id;
		}
		
		// See if the language model is ready
		this.translate = dd.useModel('language').init;
		
		// Building out a hash and string system to do simultaneous full text + fuzzy search
		// On the most common property groups (name and tags)
		if(typeof(obj.name) === 'string')
		{
			obj.searchName = fn.tFilter(obj.name);
			obj.searchHash = {};
			obj.searchRaw = '';
			obj.searchString = '';
			var s,i,j;
			
			// Splitting the Object's name in to search areas
			s = obj.searchName.split(' ');
			for(i=0,j=s.length;i<j;++i)
			{
				obj.searchHash[s[i]] = true;
				obj.searchRaw += ';'+s[i];
				obj.searchString += ';'+s[i];
			}
			
			// Adding basic colloquialisms
			if(obj.colloq)
			{
				obj.searchString += obj.colloq;
			}
			
			// Splitting the Object's tags in to search areas
			if(obj.tags)
			{
				for(i=0,j=obj.tags.length;i<j;++i)
				{
					obj.searchHash[obj.tags[i]] = true;
					obj.searchRaw += ';' + obj.tags[i];
                    var colloqTag = 'colloq_' + obj.tags[i];
                    var translatedColloqTag = fn.t(colloqTag);
                    if(translatedColloqTag === colloqTag)
                    {
                        translatedColloqTag = '';
                    }
                    
					obj.searchString += ';' + fn.tFilter(fn.t(obj.tags[i])) + translatedColloqTag;
				}
			}
		}
		
	}
};

/**
 * @method parseAllData
 * Attempts to parse all currently managed data in a single pass.
 */
dd.model.prototype.parseAllData = function()
{
	if(!this.parsed && this.init)
	{
		var i,j;
		for(i=0,j=this.keys.length;i<j;++i)
		{
			this.get(this.keys[i]);
		}
		this.parsed = true;
	}
};

/**
 * @method get
 * Retrieves a single peice of data from the model.
 * @param {String} id The id of the desired data.
 * @param {Boolean} [remap=false] If we should use the alternate ID system associated with this model
 * @param {Function} [callback=null] A function to call once the model has finished loading,
 * or immediately if it already has. The callback's "this" is the model and the first param is the
 * desired data from get
 * @return {Object} The desired data or a failure object the can be retried (see retryModel);
 */
dd.model.prototype.get = function(id, remap, callback)
{
	remap = remap || false;
	var that = this;
	if(remap)
	{
		id = this.remapFunc.call(this, id);
	}
	if(this.init)
	{
		var data = this.data[id];
		if(typeof(data) === 'object')
		{
			this.parseData(id);
			if(typeof callback !== 'undefined')
			{
				callback.call(this, data);
			}
			return data;
		}
		else if(typeof(data) === 'string')
		{
			if(typeof callback !== 'undefined')
			{
				callback.call(this, data);
			}
			return data;
		}
	}
	else if(typeof(callback) !== 'undefined')
	{
		fn.fire.plan('model', {name: type}, function(planData, execData, fireId) {
			if(execData.name === planData.name) {
				fn.fire.scrap('model', fireId);
				callback.call(that, that.get(id, remap));
			}
		});
	}
	return {
		_action: 'get',
		_name: this.name,
		id: id
	};
};

/**
 * @method getFull
 * Initializes a single piece of data based on id. If the data is not already in the mode then it
 * will be requested from the server.
 * @param {String} id The id of the desired data.
 * @param {Boolean} [remap=false] If we should use the alternate ID system associated with this model
 * @param {Function} [callback=null] A function to call once the model has finished loading,
 * or immediately if it already has. The callback's "this" is the model and the first param is the
 * desired data from get
 * @return {Object} The desired data, or an ajax status object.
 */
dd.model.prototype.getFull = function(id, remap, callback)
{
	remap = remap || false;
	var that = this;
	if(remap)
	{
		id = this.remapFunc.call(this, id);
	}
	if(this.init)
	{
		var data = this.get(id);
		// If we're getting noncomplex data, or if the complex data is already loaded, we can safely return the full data object
		if(this.format !== 'standAloneComplex' || data.loadedFull)
		{
			if(typeof callback !== 'undefined')
			{
				callback.call(this, data);
			}
			return data;
		}
		
		// Don't reproduce ajax calls
		if(!this.loading[id])
		{
			this.loading[id] = true;
			fn.getJSON(dd.m.cdn+data.version+'/data/'+dd.m.l+this.type+'/'+id+'.json',function(data)
			{
				that.loadSingle(data);
				that.get(id, remap).loadedFull = true;
				that.loading[id] = false;
				fn.fire.exec('model',{'name':that.name,'sub':id});
				if(typeof(callback) !== 'undefined')
				{
					callback.call(that, that.get(id, remap));
				}
			});
		}
	}
	else if(typeof(callback) !== 'undefined')
	{
		fn.fire.plan('model', {name: type, sub: id}, function(planData, execData, fireId) {
			if(execData.name === planData.name && execData.id === planData.id) {
				fn.fire.scrap('model', fireId);
				callback.call(that, that.get(id, remap));
			}
		});
	}
	return {
		_action: 'getFull',
		_name: this.name,
		id: id
	};
}

/**
 * @method getImg
 * Returns an image path for a single data object.
 * @param {String} id The id of the desired data.
 * @param {Object} options The options object for creating the image. See {@link Riot.DDragon.fn#getImg}.
 *
 * In addition to the standard options available to getImg, this version fills in the version parameter
 * automatically and it allows the wrap parameter to go up to 3.
 *
 * In case of wrap: 3, this adds data-rg-name="" and data-rg-id="" attributes automatically.
 * This will cause the result to have the default tooltips and modals.
 * @param {Boolean} [remap] If we should use the alternate ID system associated with this model
 * for more details.
 */
dd.model.prototype.getImg = function(id, options, remap)
{
	remap = remap || false;
	if(remap)
	{
		id = this.remapFunc.call(this, id);
	}
	if(this.init)
	{
		// Options and default options
		var basic = {
			version: this.version
		};
		if(typeof(options) !== 'object')
		{
			var options = basic;
		}
		else
		{
			// If wrap is 3 or greater, we assume the standard rg data attrs should be present
			if(options.wrap)
			{
				if(options.wrap > 2)
				{
					if(typeof(options.attrs) === 'undefined')
					{
						options.attrs = '';
					}
					options.attrs += ' data-rg-name="'+this.name+'" data-rg-id="'+id+'"';
				}
			}
			options = fn.rebase(options,basic);
		}
		
		return fn.getImg(this.get(id),options);
	}
	return '';
};

/**
 * @method all
 * Retrieves an array of all item id's.
 * @return {String[]} The ids of all currently managed data.
 */
dd.model.prototype.all = function()
{
	return this.keys.slice(0);
};

/**
 * @method collect
 * @member Riot.DDragon
 * Controls the collection system and shouldn't be used outside of it.
 */
dd.collect = function(parent)
{
	this.parent = parent;
	this.sData = {};
	this.fData = [];
	if(parent.init)
	{
		this.keys = parent.keys.slice(0);
	}
};

/**
 * @method filterInit
 * Initializes a filter.
 * @param {Object} filter The desired filter.
 */
dd.collect.prototype.filterInit = function(filter)
{
	this.f = true;
	this.fData = filter;
	this.fKeys = {};
	this.test = false;
};

/**
 * @method sortInit
 * Initializes the sort.
 * @param {Object} sort The sort data.
 */
dd.collect.prototype.sortInit = function(sort)
{
	this.s = true;
	this.sData = sort;
};

/**
 * @method filter
 * Checks to see if the item at the specified position needs to be removed. If the data at the
 * specified position has not been parsed, it will be parsed.
 * @param {Number} pos The position of the item being filtered.
 * @return {Boolean} Whether the item needs to be removed or not.
 */
dd.collect.prototype.filter = function(pos)
{
	if(!this.f) return false;
	if(typeof(this.fKeys[this.keys[pos]]) !== 'undefined') return false;
	this.fKeys[this.keys[pos]] = 1;
	
	// Filter exec takes a bool value
	// On true, it filters out the current position (truthfully failing a filter)
	// On false, it says "test is true"
	function filterExec(stat)
	{
		if(stat) this.keys.splice(pos,1);
		this.test = true;
		return stat;
	};
	
	var obj = this.parent.data[this.keys[pos]];
	var fi, fi_, fj_, fm, ftemp, fholder, f, fr = false, typeOfFData;
	for(fi=0;fi<this.fData.length;++fi)
	{
		typeOfFData = typeof(this.fData[fi]);
		// We map it in to an object if it hasn't yet been done
		if(typeOfFData === 'boolean')
		{
			// Any true filters we just skip. They've succeeded. Yay.
			if(this.fData[fi] === true) continue;
			// Otherwise, we have a bad filter. We fail the filter.
			return filterExec.call(this,true);
			
		}
		// We need to map strings in to test objects
		// Unlike core's test system, models get to deal with a special type of searching using "searchKey:"
		// This is a much more language aware and dynamic search than standard
		else if(typeOfFData === 'string')
		{
			// searchKey is special
			if(fm = /^searchKey:(.*)$/.exec(this.fData[fi]))
			{
				// This hunts out all possible word spacers for:
				// Indo-European languages, Korean, Chinese (all), Japanese, and Arabic
				// And replaces them with a single space (for us to later split)
				// Truncating end of line and beginning of line is important for sensible searches
				fm = fn.tFilter(fm[1]).split(' ');
				ftemp = fm.length-1;
				for(fi_=0,fj_=fm.length;fi_<fj_;++fi_)
				{
					// fi is the overall filter loop. We replace the current filter loop with one of the split searchKey filters.
					// Beyond that, we add them at the end of the filters
					// Also, all a searchkey is is a parsed and divided series of searchString includes
					this.fData[(ftemp === fi_ ? fi : this.fData.length)] = fn.makeTest('searchString*='+fm[fi_]);
				}
				// If we break the searchstring, rehash the loop to check for duped filters
				--fi;
				continue;
			}
			//  In cases not search string, the core test system will handle our needs
			else
			{
				this.fData[fi] = fn.makeTest(this.fData[fi]);
			}
		}
		
		// Run the filter test
		fr |= !fn.runTest(obj,this.fData[fi]);
		
		// Kill early if a filter checks
		if(fr) return filterExec.call(this,true);
	}
	
	// Return the filtering results
	return filterExec.call(this,fr);
};

/**
 * @method sortDefault
 * The default sort algorithm.
 */
dd.collect.prototype.sortDefault = function(a,b)
{
	return a>b;
};

/**
 * @method sort
 * The sort worker function. This uses the positions of keya and keyb, checks by the initialized
 * sort key and then swap the positions if it is required.
 * @param {String} keya The key for the first data item.
 * @param {String} keyb The key for the second data tiem.
 * @return {Boolean} Whether the items were switched or not.
 */
dd.collect.prototype.sort = function(keya,keyb)
{
	var sa = fn.objectDig(this.parent.data[keya],this.sData.key),
			sb = fn.objectDig(this.parent.data[keyb],this.sData.key),
			holder,
	r = this.sData.callback(sa,sb);
	if(r)
	{
		holder = keya;
		keya = keyb;
		keyb = holder;
	}
	return r;
};

/**
 * @method merge
 * The central sort algorithm. preforms a bottom up merge sort. Unlike convential bottom up merge
 * sorts, this one uses a position flip to direct which arrays this bounces data between. Which
 * means constant array mapping isn't required.
 */
dd.collect.prototype.merge = function(sA,sB,Left,Right,End)
{
	var iL = Left, iR = Right, j, iRSwitch;
	for(j = Left; j < End; ++j)
	{
		// Sort Algorithm Here
		if(typeof(sA[iR]) === 'undefined')
		{
			iRSwitch = true;
		}
		else
		{
			iRSwitch = !this.sort(sA[iL],sA[iR]);
		}
		if(iL < Right && (iR >= End || iRSwitch))
		{
			sB[j] = sA[iL++];
		}
		else
		{
			sB[j] = sA[iR++];
		}
	}
};

/**
 * @method collect
 * The core collect function, allows for both filtering and sorting.
 * @param {Object/String/String[]} filter The filter strings used to filter the data. If this is the
 * only parameter, it will be a sort object.
 * 
 * There are multiple methods a filter rule can be written. The most common pattern is the following:
 * object property keyoperatorcomparison value
 * 
 * For example:
 * gold.total>1000
 * Would produce a rule where 'gold.total' is the object property key, '>' is the operator, and '1000' is the comparison value.
 * 
 * A filter rule removes objects that do not satisfy the given condition. In this case, this is saying that "If an object has a total gold cost greater than 1000, keep it. Otherwise, remove it."
 * 
 * The main piece that directs how this type of filter rule behaves is the operator. The possible operators are:
 * 
 * <table>
 * <tr><th>Operator</th><th>Function</th></tr>
 * <tr><td>=</td><td>Tests if the two pieces are equal.</td></tr>
 * <tr><td>></td><td>Tests if the object property is greater than the comparison value</td></tr>
 * <tr><td>&lt;</td><td>Tests if the object property is lesser than the comparison value</td></tr>
 * <tr><td>>=</td><td>Tests if the object property is greater than or equal to the comparison value</td></tr>
 * <tr><td>&lt;=</td><td>Tests if the object property is lesser than or equal to the comparison value</td></tr>
 * <tr><td>+,-,*,/,%</td><td>Mathematical operators. Removes the object if the result is 0</td></tr>
 * <tr><td>*=</td><td>(String only, case insensitive) Tests if the comparison value is contained within the object property</td></tr>
 * <tr><td>^=</td><td>(String only, case insensitive) Tests if the comparison value is at the beginning of the object property</td></tr>
 * <tr><td>$=</td><td>(String only, case insensitive) Tests if the comparison value is at the end of the object property</td></tr>
 * <tr><td>-></td><td>(Array only) Tests if the comparison value is one of the array elements within the object property</td></tr>
 * </table>
 * 
 * As an example, a possible list of filters may include:
 * ["name*=razor","into->3126"]
 * This will find any item with a name that contains "razor" and builds into item id 3126.
 * 
 * Then there is the "look for" pattern. This is simply:
 * object property key
 * 
 * With this pattern, if the object property exists and it does not contain a value of false, it will return true.
 * 
 * An example of this would be:
 * "maps.CrystalScar"
 * Would detect if an item is enabled on CrystalScar.
 * 
 * Finally, a "searchKey" pattern:
 * searchKey:operator value
 * 
 * This pattern divides the comparison value in to multiple strings, and then checks if the object's tags or name includes each of these strings, in any combination. this allows for searches such as:
 * "searchKey:ca,mage,iop"
 * Which would find cassiopeia correctly from the champions listing.
 * 
 * searchKey is case insensitive, and accepts many different types of separations between words.
 * Separations include: space, tabs, newlines, commas, interpuncts, japanese commas, arabic reverse commas, and periods.
 *
 *
 * String patterns may contain multiple searches that are to be "or"ed. In this case, seperate each test with a vertical bar "|".
 * For example:
 * "maps.CrystalScar|maps.TwistedTreeline"
 * would inform you if an item is on either Crystal Scar OR Twisted Treeline.
 *
 * @param {Object} [sort] The sort object.
 * The sort object has two possible properties that it handles all sorts with, the key and callback properties.
 * 
 * key defines what object property value to sort by. This uses the same method that filter uses to find data, such that a key value of 'gold.total' would map to object.gold.total.
 * 
 * callback is optional. If present, it is an a|b compare function, where a return value of true keeps the current order and a return value of false reorders the sort.
 * If this is not present, it uses the default callback function:
 * 
 * 	sortDefault = function(a,b)
 * 	{
 * 	    return a>b;
 * 	};
 */
dd.model.prototype.collect = function(filter,sort)
{
	var c;
	// Prepare the collection
	if(typeof(this.collection) === 'undefined')
	{
		this.collection = new dd.collect(this);
	}
	c = this.collection;
	c.s = false;
	c.f = false;
	
	// Filter might actually be sort (if it's an object that isn't an array)
	if((typeof(filter) === 'object') && !(filter instanceof Array))
	{
		c.sortInit(filter);
	}
	// Otherwise, we do our tests here for what information we actually have to work with
	else
	{
		if(typeof(filter) === 'string')
		{
			filter = [filter];
		}
		if(typeof(filter) !== 'undefined')
		{
			if(filter[0] !== '') c.filterInit(filter);
			if(typeof(sort) === 'object')
			{
				c.sortInit(sort);
			}
		}
	}
	
	// Init switch
	if(this.init)
	{
		var r = [],i=0,tryagain;
		this.parseAllData();
		
		// Filter
		if(c.f)
		{
			while(i < c.keys.length)
			{
				if(!c.filter(i))
				{
					++i;
				}
			}
		}
		
		// Sort
		c.sN = c.keys.length;
		if(c.s && c.sN > 1)
		{
			if(!c.sData.callback)
			{
				c.sData.callback = c.sortDefault;
			}
			var sK = [c.keys.slice(0),[]],
				sA = 0, sB = 1, sW, sI;
			
			for(sW = 1; sW < c.sN; sW *= 2)
			{
				for(sI = 0;sI < c.sN; sI += 2 * sW)
				{
					c.merge(sK[sA],sK[sB],sI, Math.min(sI + sW, c.sN), Math.min(sI + 2 * sW, c.sN));
				}
				
				sA ^= 1;
				sB ^= 1;
			}
			c.keys = sK[sA].slice(0);
		}
		
		// Return
		return c.keys;
	}
	// Fail
	this.deleteCollect();
	
	return {
		_action: 'collect',
		_name: this.name,
		s: c.s,
		f: c.f,
		sData: c.sData,
		fData: c.fData
	};
};

/**
 * @method deleteCollect
 * Deletes the current collection. When collect is called, it will regenerate itself.
 */
dd.model.prototype.deleteCollect = function()
{
	delete this.collection;
};

/**
 * @method datamap
 * Maps an array of ids to an array of objects. Generally this shouldn't be used except as part of a
 * model working behaviour (see {@link #remodel}) because placing this behaviour within the view or
 * controller is the difference between n time and 2n time.
 * @method {Object[]} dataArray The data array to map.
 */
dd.model.prototype.datamap = function(dataArray)
{
	var i, ndata = {};
	for(i=0;i<dataArray.length;++i)
	{
		ndata[this.data[dataArray[i]].id] = this.data;
	}
	return ndata;
};

/**
 * @method remodel
 * Creates a new model out of the current model. This will either use the keys specified or the
 * current collection state. The model simply provides the name for use with useModel. It's
 * recommended to destroy remodel's after use, otherwise they can risk memory leaks.
 * @param {String} newModel The name of the new model.
 * @param {String[]} newKeys The list of keys that will be added to the model.
 * @return {Riot.DDragon.model} The new model, or false if it could not be created.
 */
dd.model.prototype.remodel = function(newModel, newKeys)
{
	if(typeof(newKeys) === 'undefined')
	{
		newKeys = this.collect();
	}
	if(this.init)
	{
		return dd.models[newModel] = (new dd.model(this.type,this.version,JSON.stringify({
			'data': this.datamap(newKeys),
			'keys': newKeys,
			'basic': this.basic
		}))).rename(newModel);
	}
	else
	{
		return false;
	}
};

/**
 * @method rmModel
 * @member Riot.DDragon
 * Removes the specified model type. This is important for remodeling, as remodels can risk memory
 * leaks.
 * @param {String} name The name of the model that needs to be removed.
 */
dd.rmModel = function(name)
{
	delete dd.models[name];
};

/**
 * @method useModel
 * @member Riot.DDragon
 * Pulls a model based on the given type. If the type is an object, and the desired model does not
 * already exist, the model will be created.
 * @param {String/Object} type The desired model type.
 * @param {String} [version=null] The version of the model desired.
 * @param {Function} [callback=null] A function to call once the model has finished loading,
 * or immediately if it already has. The callback's "this" is the model.
 * @return {Riot.DDragon.model} The desired model.
 */
dd.useModel = function(type,version,callback)
{
	var t = type, model;
	if(typeof(version) === 'string')
	{
		t += '_'+version;
		if(typeof(dd.models[t]) !== 'object')
		{
			model = dd.models[t] = (new dd.model(type,version)).rename(t);
		}
		else
		{
			model = dd.models[t];
		}
	}
	else
	{
		if(typeof(dd.models[t]) !== 'object')
		{
			model = dd.models[t] = (new dd.model(type)).rename(t);
		}
		else
		{
			model = dd.models[t];
		}
	}
	if(model.init && typeof(callback) !== 'undefined')
	{
		callback.call(model);
	}
	else if(typeof(callback) !== 'undefined')
	{
		fn.fire.plan('model', {name: type}, function(planData, execData, fireId) {
			if(execData.name === planData.name) {
				fn.fire.scrap('model', fireId);
				callback.call(model);
			}
		});
	}
	return model;
};

/**
 * @method retryModel
 * @member Riot.DDragon
 * Attempts to use a failed return object and reexecute it, returning the new result.
 * @param {Object} action A failed model action.
 * @return {Object} The new action object.
 */
dd.retryModel = function(action)
{
	if(typeof(action) === 'object')
	{
		if(typeof(action._name) === 'string')
		{
			var model = dd.useModel(action._name);
			switch(action._action)
			{
				case 'collect':
					if(action.s && action.f) return model.collect(action.fData,action.sData);
					if(action.f) return model.collect(action.fData);
					if(action.s) return model.collect(action.sData);
					return model.collect();
				break;
				
				case 'get':
					return model.get(action.id);
				break;
				
				case 'getFull':
					return model.getFull(action.id);
				break;
			}
		}
	}
	return false;
};

/**
 * @method modelAux
 * @member Riot.DDragon
 * Performs a series of special actions against the target element based on model information extracted from it
 * as well as the data-rg-aux attribute of that element. Each action must be space seperated.
 * The actions, as well as the order they act in, are as follows:
 * remap_keys: Replace the data-rg-id attribute with an id remap of that key (important for champions)
 * empty: Empty the div
 * wrap={Number}: Set the wrap property of the images generated by img
 * img={String}: Append an image piece in to the element. String defines the image type
 * size={String}: The size of the sprite image (for img=sprite only). Default is 'normal'. 'small' and 'tiny' are also available.
 * query={String}: Query's the data via fn.objectDig and appends it to the element
 * no_inline: The div does not get an inline-block property set.
 * strip_data: This strips the data-rg tags used for modelAux from the element
 * @param {HTMLElement} The element to fill
 */
dd.modelAux = function(el)
{
	var info = fn.rgInfo(el,1);
	
	function infoAux(key, action)
	{
		var val;
		if(fn.hasWord(info.aux, key))
		{
			action();
			info.aux = fn.removeWord(info.aux, key);
			el.setAttribute('data-rg-aux', info.aux);
		}
	}
	
	function valueAux(key, action)
	{
		var val;
		if(val = fn.hasValue(info.aux, key))
		{
			action(val);
			info.aux = fn.removeValue(info.aux, key);
			el.setAttribute('data-rg-aux', info.aux);
		}
	}
	
	if(info && info.aux)
	{
		dd.addApp([info.name], function()
		{
			info.inline = true;
			info.wrap = 2;
			info.size = 'normal';
		
			infoAux('remap_keys', function()
			{
				var model = dd.useModel(info.name);
				info.id = model.remapFunc.call(model, info.id);
				el.setAttribute('data-rg-id', info.id);
			});
			
			infoAux('empty', function()
			{
				el.innerHTML = '';
			});
			
			valueAux('wrap', function(value)
			{
				info.wrap = parseInt(value,10);
			});
			
			valueAux('size', function(value)
			{
				info.size = value;
			});
			
			valueAux('img', function(value)
			{
				el.innerHTML += dd.useModel(info.name).getImg(info.id, {src: value, wrap: info.wrap, size: info.size});
			});
			
			valueAux('query', function(value)
			{
				var obj = dd.useModel(info.name).get(info.id);
				if(!obj.hasOwnProperty("_action"))
				{
					el.innerHTML += fn.objectDig(dd.useModel(info.name).get(info.id), value);
				}
			});
			
			infoAux('no_inline', function()
			{
				info.inline = false;
			});
			
			// This MUST be last, or it will get clobbered
			infoAux('strip_data', function()
			{
				el.setAttribute('data-rg-name', '');
				el.setAttribute('data-rg-id', '');
				el.setAttribute('data-rg-aux', '');
			});
			
			if(info.inline)
			{
				el.style.display = 'inline-block';
			}
		});
	}
};

/**
 * @method dynamicScan
 * @member Riot.DDragon
 * Scans the DOM starting at the target element. The scan strips data-rg- classes out and resets them as
 * attributes, as well as performs a modelAux on each element.
 * Commas (,) are used in place of spaces for complex data values.
 * @param {HTMLElement} The element to start the scan at.
 */

dd.dynamicScan = (function()
{
	var dataReg = /(data-rg-[a-zA-Z]+)=([a-zA-Z0-9_\.,]+)/;
	function dynamicScan(el)
	{
		var m, i, j, child;
		for(i=0, j=el.childNodes.length; i<j; ++i)
		{
			child = el.childNodes[i];
			while(m = dataReg.exec(child.className))
			{
				child.setAttribute(m[1], m[2].replace(/,/g,' '));
				child.className = child.className.replace(dataReg, '');
			}
			dd.modelAux(child);
			dynamicScan(child);
		}
	}
	return dynamicScan;
})();

/**
 * @method t
 * @member Riot.DDragon.fn
 * Translates a string based on the given key.
 * @param {String} key The key to the string that needs to be translated.
 */
fn.t = function(key)
{
	var tr = dd.useModel('language').get(key);
	if(typeof(tr) === 'string')
	{
		return tr;
	}
	return key;
};

/**
 * @method tFilter
 * @member Riot.DDragon.fn
 * Sanitizes a string for multi language purposes
 * @param {String} text The text to sanitize
 */
fn.tFilter = function(text)
{
	var f,s,i,l = dd.useModel('language').tree;
	if(l)
	{
		// Apply searchKeyIgnore rules
		s = l.searchKeyIgnore;
		if(s !== '')
		{
			f = new RegExp('['+s+']','g');
			text = text.replace(f,'');
		}
		
		// Apply searchKeyRemap rules
		s = l.searchKeyRemap;
		i = s.length;
		while(i--)
		{
			f = new RegExp('['+s[i].v+']','g');
			text = text.replace(f,s[i].k);
		}
		
		text = text.toLowerCase().replace(/(\s+|\t+|(\n\r)+|\n+|,+|·+|\u3001+|\u3002+|\u060C+)/g,' ').replace(/\.|'/g,'').replace(/(^\s+|\s+$)/g,'');
	}
	return text;
};

// We'll want to start grabbing the current language early
dd.useModel('language');
// The primary css file the default displays use
fn.getCSS(dd.m.cdn+dd.m.css+'/css/view.css');

// The default display fail
dd.displayFail = function()
{
	return '<img src="'+dd.m.cdn+'img/global/load01.gif" />';
};

/**
 * @class Riot.DDragon.display
 * @singleton
 * An object that stores all displays, built in and app created.
 */
dd.display = {};

/**
 * @method addDisplay
 * @member Riot.DDragon
 * Adds a display definition.
 * @param {Object} config The display contig.
 * @param {String} config.type The display type.
 * @param {Function} config.success
 * The function to execute when data is returned successfully. This function needs to return an html
 * string to be placed in the view. In most cases this function will recieve a data object as its
 * only parameter.
 * @param {Function} config.fail
 * This function is used when the model fails to retrieve data. This should generally return
 * placeholder html.
 * @param {Function} config.onFill
 * This function is called when the display is finished rendering. The scope of this function is
 * the controller, not the view.
 */
dd.addDisplay = function(display)
{
	dd.display[display.type] = display;
};

/**
 * @method displayList
 * @member Riot.DDragon
 * Creates a list of display executions.
 * @param {String} subname The display part used to render a peice of the list.
 * @param {Object[]} data A list of data to pass to each of the pieces.
 * @return {String} The generated html.
 */
dd.displayList = function(subName, data)
{
	var r = '',
		j = data.length,
		i = 0,
		subDisplay = dd.display[subName].success;
	
	for(;i < j;++i)
	{
		r += subDisplay.call(this,this.model.get(data[i]));
	}
	return r;
};

/*
 * DISPLAY STRUCTURE *
 ****
 
	{
		// This type string simply gives a name for the display
		type: '',
		
		success: function(data)
		{
			// Returns an html string describing how to display data
			// data tends to be either an object or array
			
			// In most cases, when taking in an array, the return might look something like:
			//   return dd.displayList.call(this,'itempiece',data);
			// This is taking advtange of displayList to list out a different display (a subdisplay) multiple times
			
			// "this" keyword during the success function will refer to the view
			// "this.model" can easily be used to get the model we're pulling from
		},
		
		fail: function()
		{
			// This is optional and will default to dd.displayFail (which can, in of itself, be overwritten)
			// The fail function should return placeholder html when the model responds with a fail action
		},
	
		onFill: function()
		{
			// This is a callback for when this display finishes filling out.
			// This is called only only from the uppermost display, it is not inherited through any parent displays
			// The "this" keyword during an onFill event is the controller using the populated data, not the view
		},
		
		onWipe: function()
		{
			// This is a callback for when the display gets deconstructed, usually by a controller
		}
	}
 
 ****
 */

// ITEMS
/**
 * @property item_tree
 * @member Riot.DDragon.display
 * Draws an item builds from tree.
 *
 * **Draw Data Type:** item object
 *
 * **Displays:** Item build from tree, using the data as the top of the tree.
 */
dd.addDisplay({
	type: 'item_tree',
	success: function(data)
	{
		// item_tree_worker uses the select data in order to determine if it should select the first item in the tree
		this.workingData.select = true;
		this.workingData.depth = data.depth;
		return '<div class="rg-item-tree"><div class="treebox">'+this.applyDisplay('item_tree_worker',data)+'</div></div>';
	}
});
	
dd.addDisplay({
	type: 'item_tree_worker',
	success: function(data)
	{
		var j = data.from.length,
			r, i,
			select = false,
			self = dd.display.item_tree_worker.success,
			width, spread;
	
		if(this.workingData.select)
		{
			select = this.workingData.select;
			this.workingData.select = false;
		}
		
			// The top of the tree
		r = this.model.getImg(data.id,{
			size: (this.workingData.depth > 3 ? 'small' : 'normal' ),
			wrap: 3,
			classes: this.runClassTest(data)+(select?'selected ':'')+'treeimg'
		});
		
		// Begin tree building if there are children
		if(j !== 0)
		{
			width = 100/j,
			spread = (j===1?'single':'multi');
			
			// Wrap the parent in the head of the tree. Then build the horizontal bar
			r = '<div class="treehead '+spread+'">' + r;
			if(spread === 'multi')
			{
				r += '<div class="branch multi"></div><div class="branch limb" style="width: '+(100-width)+'%;"></div>';
			}
			r += '</div>'; // </treehead>
			
			// Each child potentially has its own tree
			for(i=0;i<j;i++)
			{
				// Callback
				r += '<div class="treebox" style="width: '+width+'%;"><div class="branch '+spread+'"></div>'+self.call(this,this.model.get(data.from[i]))+'</div>';
			}
		}
		return r;
	}
});


/**
 * @property item_tooltip
 * @member Riot.DDragon.display
 * Draws an item tooltip.
 *
 * **Draw Data Type:** item object
 *
 * **Displays:** The contents of an item tooltip.
 */
dd.addDisplay({
	type: 'item_tooltip',
	// Expects: Individual Item Object
	success: function(data)
	{
		return this.model.getImg(data.id)+
		'<div class="info">'+
			'<div class="name">'+data.name+'</div>'+
			'<div class="description">'+data.description+'</div>'+
			'<div class="cost">'+fn.t('Cost_')+' <span class="gold">' + (data.specialRecipe !== 0 ? fn.t('SpecialRecipeLarge') : data.gold.total+' ('+data.gold.base+')') + '</span></div>'+
		'</div>';
	}
});



/**
 * @property item_modal
 * @member Riot.DDragon.display
 * Draws an item modal.
 *
 * **Draw Data Type:** item object
 *
 * **Displays:** A modal content piecing together an item's build into, build from (using {@link Riot.DDragon.display#item_tree}),
 * and a description box. This display hooks events up to be traversable.
 */
dd.addDisplay({
	type: 'item_modal',
	// Expects: Individual Item Object
	success: function(data)
	{
		return ''+
		'<div class="item-into">'+this.applyDisplay('item_modal_build',data)+'</div>'+
		this.applyDisplay('item_tree',data)+
		'<div class="item-desc">'+this.applyDisplay('item_modal_description',data)+'</div>';
	},
	onFill: function()
	{
		var that = this;
		
		fn.addEvent(this.box,'mousedown',function(data)
		{
			var d = fn.rgInfo(data.target,3);
			if(d)
			{
				var item = dd.useModel(d.name).get(d.id);
				if(fn.hasClass(data.target, 'treeimg'))
				{
					fn.removeClass(fn.$('.selected',  this.box)[0], 'selected');
					fn.addClass(data.target, 'selected');
					fn.$('.item-desc', this.box)[0].innerHTML = that.view.applyDisplay('item_modal_description',item);
					fn.$('.item-into', this.box)[0].innerHTML = that.view.applyDisplay('item_modal_build',item);
				}
				else if(fn.hasClass(data.target,'intoimg'))
				{
					that.redraw('getFull',d.id);
				}
			}
		});
	},
	onWipe: function()
	{
		fn.removeEvent(this.box,'mousedown');
	}
});

dd.addDisplay({
	type: 'item_modal_description',
	success: function(data)
	{
		return ''+
		'<div class="title">'+
			this.model.getImg(data.id,{src:'full'})+
			'<div class="name">'+data.name+'</div>'+
			'<div class="cost">'+fn.t('Cost_')+' <span class="gold">' + (data.specialRecipe !== 0 ? fn.t('SpecialRecipeLarge') : data.gold.total+' ('+data.gold.base+')') + '</span></div>'+
		'</div>'+
		'<div class="description">'+data.description+'</div>';
	}
});

dd.addDisplay({
	type: 'item_modal_build',
	success: function(data)
	{
		var i,j, r = '';
		for(i = 0, j = data.into.length; i < j; ++i)
		{
			// Wrap 3 includes the data-rg information for reactive hooking
			r += this.model.getImg(data.into[i],{wrap:3,classes:'intoimg'});
		}
		return r;
	}
});

/**
 * @property rune_tooltip
 * @member Riot.DDragon.display
 * Draws a rune tooltip.
 *
 * **Draw Data Type:** rune object
 *
 * **Displays:** The contents of a rune tooltip.
 */
dd.addDisplay({
	type: 'rune_tooltip',
	// Expects: Individual Rune Object
	success: function(data)
	{
		return this.model.getImg(data.id)+
		'<div class="info">'+
			'<div class="name">'+data.name+'</div>'+
			'<div class="description">'+data.description+'</div>'+
		'</div>';
	}
});

/**
 * @property mastery_trunk
 * @member Riot.DDragon.display
 * Draws a single mastery column.
 *
 * **Draw Data Type:** mastery trunk object, contained in model.tree
 *
 * **Displays:** A measured out, full mastery column. Normally, this display is best called
 * by a different display.
 *
 * For example: var Offense = Riot.DDragon.display.mastery_trunk.success(this.model.tree.Offense);
 */
dd.addDisplay({
	type: 'mastery_trunk',
	success: function(trunk)
	{
		var top = trunk.length,
			left,
			r = '',
			data;
		r += '<div class="rg-mastery-trunk">';
		while(top--)
		{
			left = trunk[top].length;
			while(left--)
			{
				if(trunk[top][left] !== null)
				{
					data = this.model.get(trunk[top][left].masteryId);
					r += '<div class="mastery left'+left+' top'+top+'" data-rg-name="'+this.model.name+'" data-rg-id="'+data.id+'">'+
						this.model.getImg(data.id)+
					'</div>';
				}
			}
		}
		return r + '</div>';
	}
});


/**
 * @property champion_tooltip
 * @member Riot.DDragon.display
 * Draws a champion tooltip.
 *
 * **Draw Data Type:** champion object
 *
 * **Displays:** The contents of a champion tooltip.
 */
dd.addDisplay({
	type: 'champion_tooltip',
	success: function(data)
	{
		return this.model.getImg(data.id)+
			'<div class="info">'+
				'<div class="name">'+data.name+'</div>'+
				'<div class="description">'+data.blurb+'</div>'+
			'</div>';
	}
});


/**
 * @property summoner_tooltip
 * @member Riot.DDragon.display
 * Draws a summoner tooltip.
 *
 * **Draw Data Type:** summoner object
 *
 * **Displays:** The contents of a summoner tooltip.
 */
dd.addDisplay({
	type: 'summoner_tooltip',
	success: function(data)
	{
		return this.model.getImg(data.id)+
		'<div class="info">'+
			'<div class="name">'+data.name+'</div>'+
			'<div class="description">'+data.description+'</div>'+
		'</div>';
	}
});
/**
 * @class Riot.DDragon.view
 * A class used to render the specified display type. This allows for a display to execute methods
 * prior to doing various tasks, such as onWipe and onReactive. This class should not be created
 * directly, instead use the {@link Riot.DDragon#useView}.
 */
 
dd.views = {};

dd.view = function(display)
{
	this.init = false;
	this.display = dd.display[display];
	this.content = '';
	this.model = false;
	
	// Working data is used and reset whenever a display is loaded.
	// It's not used internally, it simply provides a reliably resetting data holder for displays
	this.workingData = {};
	
	// onFill is an event called by the controller that's specific to each display
	if(dd.display[display].onFill)
	{
		this.onFill = function()
		{
			var that = this;
			// onFill commonly relies on rendered content to manipulate
			// setTimeout forces a frame draw, allowing us to manipulate the real rendered content
			setTimeout(function()
			{
				that.view.display.onFill.call(that);
			},0);
		};
	}
	else
	{
		this.onFill = function(){};
	}
	
	// The teardown side of onFill
	this.onWipe = dd.display[display].onWipe || function(){};
	
	// views can respond to controller reactive as well
	this.onReactive = dd.display[display].onReactive || function(){};
	
	// These holds data tester information
	// This can be used (see addClassTest below) to optionally add classes based on information in the data
	this.classTestsHash = {};
	this.classTests = [];
};

/**
 * @method loadModel
 * Sets the model type this view uses.
 * @param {Riot.DDragon.model} model The model type that this view uses.
 */
dd.view.prototype.loadModel = function(model)
{
	this.model = model;
};

/** 
 * @method applyDisplay
 * This executes the specified display but sets the scope to this view. This method will also catch
 * errors that are thrown by the fired during the execution of the display.
 * @param {String} display The display type to execute.
 * @param {Object} data The data that will be passed to the display.
 * @return {String} The result of calling the display's success method.
 */
dd.view.prototype.applyDisplay = function(display,data)
{
	var r;
	try
	{
		r = dd.display[display].success.call(this,data);
	}
	catch(e)
	{
        if(typeof(dd.display[display]) === 'undefined')
		{
			r = fn.er(e, 'view.applyDisplay','Nonexistent display ('+display+')');
		}
		else
		{
			r = fn.er(e, 'view.applyDisplay','Invalid data used for display ('+display+')');
		}
	}
	return r;
};

/**
 * @method load
 * Loads the managed display with the specified data and executes it.
 * @param {Object} data The data to pass to the display.
 */
dd.view.prototype.load = function(data)
{
	this.data = data;
	if(typeof(data) === 'object' && typeof(data._action) === 'string')
	{
		if(typeof(this.display.fail) === 'object')
		{
			this.content = this.display.fail.call(this);
		}
		else
		{
			this.content = dd.displayFail();
		}
		this.init = false;
	}
	else
	{
		// Reset working data
		this.workingData = {};
		
		// Run the display
		this.content = this.applyDisplay(this.display.type,data);
		this.init = true;
	}
};

/**
 * @method reload
 * Attempts to retrieve data after a failure.
 */
dd.view.prototype.reload = function()
{
	if(!this.init || (typeof(data) === 'object' && typeof(data._action) === 'string'))
	{
		this.load(dd.retryModel(this.data));
	}
};

/**
 * @method addClassTest
 * Adds a class test that will be executed when the view renders. If the test passes, then the
 * specified classes will be added to the view's container.
 * @param {String} test A test that will be passed to the {@link Riot.DDragon.fn#makeTest} method.
 * @param {String[]} classes The classes that will be added when the test passes.
 */
dd.view.prototype.addClassTest = function(test,classes)
{
	// Make the test and add the potential classes
	var testObj = fn.makeTest(test);
	testObj.classes = classes;
	
	// If we already have the key we're comparing to in, we replace that test
	if(typeof(this.classTestsHash[testObj.key]) !== 'undefined')
	{
		this.classTests[this.classTestsHash[testObj.key]] = testObj;
	}
	else
	{
		// the testshash just has an array position of the classTests
		// We do this due to the speed of looping through arrays
		this.classTestsHash[testObj.key] = this.classTests.push(testObj) - 1;
	}
};

/**
 * @method runClassTest
 * Executes all classTests on the specified data.
 * @param {Object} data The data to execute the tests against.
 * @return {String} The classes that need to be added to the view.
 */
dd.view.prototype.runClassTest = function(data)
{
	// We can run down since loop order doesn't matter when running the class tests
	var i = this.classTests.length, classes = '';
	while(i--)
	{
		// If it matches the test, we add the classes
		if(fn.runTest(data,this.classTests[i]))
		{
			classes += this.classTests[i].classes + ' ';
		}
	}
	return classes;
};

/**
 * @method useView
 * Creates a new view using a specific display id. Wrapper function.
 * @member Riot.DDragon
 * @param {String} display The id of the display type this view will execute.
 * @return {Riot.DDragon.view} The created view.
 */
dd.useView = function(display)
{
	return new dd.view(display);
};dd.box = {
  modal: {
    overrides:['target'],
  
   /*
    * The type field is a unique identifier for this type field, used as the reference in the rgbox field
    */
    type: 'modal',
    
   /*
    * dataTarget defines what type of location the target needs to refer to
    * It can be one of target, rel, box, or commonbox
    *  target: This fills the data in to a target element, defined by the target field
    *  rel: This fills the data in to a target element, defined by rel field in the target field
    *  box: This creates a new box within the target field, then fills the data in to that
    *  commonbox: This uses a common box based on this object's type, only allowing a single box. Otherwise works as a box does
    */
    dataTarget: 'commonbox',
    
   /*
    * target is used as either the fill target, fill reference target, or parent of the box used by the dataTarget
    * This is a jQuery selector string
    * a selector string of 'this' will cause it to use jQuery $(this), referring to the DOM element where this box type was called from
    */
    target: 'body',
    
   /*
    * If this should empty the target before append
    * This is ignored on commonbox and box
    * With rel, this refers to emptying the rel target, not the initial target
    */
    empty: false,
    
   /*
    * preselect allows the target selector, as well as the rel selector, to be saved as a whole selector
    * This will increase performance, but won't allow the script to detect changes to the particular element
    * If the target is 'body', this is suggested to be turned on always
    */
    preselect: true,
    
   /*
    * wrapsChildren is a binary switch that defines if the children of the target element should be extracted and wrapped in to
    * a z-index breakdown, then places the data 'above' everything else.
    * This is most commonly used for modals
    */
    wrapsChildren: true,
    
   /*
    * position is used only with box and commonbox dataTargets
    * It's used to define against what the box is positioned. This can either be: none, target, or mouse
    *  none: This drops the box in to the target with no positioning declared,
    *    If none is used, 'from', 'to', 'offsetX', and 'offsetY' are not used.
    *  target: This positions it relative to the target element.
    *  mouse: This positions it based on mouse movement.
    *  viewport: This positions it based on the viewport (visible page).
    */
    position: 'viewport',
    
   /*
    * drawFrom defines the start position to start drawing the box from, relative to the position
    * This is a combo string consisting of a vertical and horizontal positioning, using standard css words.
    * For example, 'top left' or 'bottom right' are valid.
    * 'center' is also used, which tries to center the box relative to the target
    * 'viewport' is used to draw from a direction that has the further coordinates from the sides of the viewport
    *   so that if an element is in the top left quadrant of the viewport, it draws the box from the bottom right of the target
    *
    * In the case of position: mouse, drawFrom is not used. Instead, the drawFrom is assumed to just be the mouse.
    */
    drawFrom: 'center',
    
   /*
    * drawTo defines which direction the box draws in relation to the drawFrom
    * this uses the same wordings that drawFrom uses, then draws in that direction
    */
    drawTo: 'center',
    
   /*
    * offsetX and offsetY are used to offset the resulting position
    */
    offsetX: 0,
    offsetY: 0,
    
   /*
    * classes attaches a number of a classes on to the initial box element
    */
    classes: '',
    
   /*
    * Events are completely optional.
    * There are two types of events for controllers: box events that you define here, and controller events that you define on controller creation
    * They are all the same four: "onCreate", "onDestroy", "onShow", and "onHide". The box event always occurs before the controller event.
    * Generally, it's best to place events in the controller stage, as at this stage is very box dependent
    * Modals are a special case as they should deconstruct in the same way for all modals, when you click the background (wDown)
    */
    onCreate: function()
    {
      var modal = this;
      fn.addEvent(this.wDown, 'mousedown', function()
      {
        modal.destroy();
      });
    },
	onDestroy: function()
	{
	  if(this.wDown)
	  {
	    fn.removeEvent(this.wDown, 'mousedown');
	  }
	}
  },
  tooltip: {
    type: 'tooltip',
    dataTarget: 'commonbox',
    target: 'body',
    empty: false,
    preselect: true,
    wrapsChildren: false,
    position: 'mouse',
    drawTo: 'center',
    offsetX: 30,
    offsetY: 30,
    classes: ''
  },
  container: {
    overrides: ['target'],
    type: 'container',
    dataTarget: 'target',
    target: 'body',
    empty: false,
    preselect: true,
    wrapsChildren: false,
    position: 'none',
    classes: ''
  }
};

// This really only exists as syntactic sugar
dd.addBox = function(box)
{
  dd.box[box.type] = box;
};
/**
 * @class Riot.DDragon.controller
 * Used to house event event executions and view renders while passing the proper data to said
 * views. To add a controller please refer to {@link Riot.DDragon#buildController}.
 */

dd.controllers = {cur:0};

dd.controller = function(boxType)
{
	var overrides = [],i;
	
	// Load the box data. Split based on if there were overrides specified
	if(boxType.indexOf('_') !== -1)
	{
		overrides = boxType.split('_');
		// The box type is the first argument
		this.loadBox(overrides.shift());
		
		// Everything else is an override
		for(i = 0;i<overrides.length;i++)
		{
			this.boxData[this.boxData.overrides[i]] = overrides[i];
		}
	}
	else
	{
		this.loadBox(boxType);
	}
	
	// Default view just has empty content
	this.view = false;
	this.model = false;
	
	// Default display properties
	this.visible = false;
	this.repos = false;
	this.refix = dd.fixed==='absolute';
	this.ranView = false;
	
	// There is no starting box DOM object
	this.box = false;
	
	// Additional classes to add to the box
	this.classes = '';
	
	// Controllers, since they must interact with each other, has direct control over the controllers group
	// id keeps this tracing sane
	this.id = 'cont'+(++dd.controllers.cur);
	dd.controllers[this.id] = this;
	
	// Some storage area for various box types
	this.wrapper = [];
	this.wDown = false;
	this.wChildren = [];
	this.current = '';
	this.store = {};
	
	// Events
	this.onCreate = function(){};
	this.onDestroy = function(){};
	this.onShow = function(){};
	this.onHide = function(){};
	this.onReactive = function(){};
};

/**
 * @method loadBox
 * Initializes the box events of this controller.
 * @param {String} type The box type to use as the base for this controller.
 */
dd.controller.prototype.loadBox = function(type)
{
	this.boxData = fn.rebase({},dd.box[type],{
		onCreate: function(){},
		onDestroy: function(){},
		onShow: function(){},
		onHide: function(){},
		onReactive: function(){}
	});
	
	this.initSingleWrap = false;
	if(window.rg_force_reducereflow && this.boxData.wrapsChildren && this.boxData.dataTarget === 'commonbox')
	{
		this.singleWrap = true;
	}
	else
	{
		this.singleWrap = false;
	}
};

/**
 * @method create
 * Creates the box element that will be controlled.
 */
dd.controller.prototype.create = function()
{
	// Shorthand
	var bd = this.boxData,
		bSelect = '',
		i, j;
	
	if(typeof bd.target === 'string')
	{
		this.target = fn.$(bd.target, bd.preselect)[0];
	}
	else
	{
		this.target = bd.target;
	}
	
	// Destroy the box if it exists, so we don't have wandering lost elements
	if(this.box !== false)
	{
		this.destroy();
	}
	
	// Make the box
	this.box = fn.mkDiv({
		classes:'ninja rg-box-'+bd.type+this.classes,
		data: [{k:'control',v:this.id}]
	});
	
	// There are multiple methods that may happen depending on what type the dataTarget is
	switch(bd.dataTarget)
	{
		// rel shifts the target to be the one defined by the first target's rel attribute
		case 'rel':
			this.target = fn.$(this.target.getAttribute('rel'),bd.preselect)[0];
			
		// If it's just target (or rel morphing in to target), there's only one choice path:
		// Whether or not to empty out the target
		case 'target':
			if(bd.empty) this.target.innerHTML = '';
		break;
		
		// Common boxes are single box restrictions for specific box types
		case 'commonbox':
			bSelect = 'rg-commonbox-'+bd.type;
			
			// If this ID already exists, we kill it
			if((holder = fn.$('#'+bSelect,true)).length)
			{
				dd.destroyBox(holder[0]);
			}
			
			// We set the container to be the new commonbox
			this.box.id = bSelect;
			
		case 'box':
			if(bd.position === 'target')
			{
				this.box.style.position = 'absolute';
				this.repos = true;
			}
			switch(bd.position)
			{
				case 'mouse':
					bd.drawFrom = 'mouse';
			 
				case 'viewport':
					this.repos = true;
					this.box.style.position = dd.fixed;
					this.refix &= true;
				
				case 'target':
					this.target.style.position = 'relative';
				break;
			}
			
			if(this.repos)
			{
				// Divides the positioning in to something more easy to programatically read
				// drawFrom
				switch(bd.drawFrom)
				{
					case 'mouse':
					case 'center':
					case 'page':
						this.repos = [bd.drawFrom,bd.drawFrom];
					break;
					
					default:
						this.repos = bd.drawFrom.split(' ');
					break;
				}
				
				// drawTo
				switch(bd.drawTo)
				{
					case 'center':
					case 'page':
						this.repos.push(bd.drawTo,bd.drawTo);
					break;
					
					default:
						this.repos = this.repos.concat(bd.drawTo.split(' '));
					break;
				}
			}
			
			// If the box wraps its children, then we need to do some div moving magic
			if(bd.wrapsChildren)
			{
				this.box.className += ' wrap-ceil';
				if(this.singleWrap && this.initSingleWrap)
				{
					fn.removeClass(this.wDown, 'ninja');
				}
				else
				{
					// We need a non-living list of the target's children
					// This is because they will change
					this.wChildren = fn.deadChildren(this.target);
					
					// Build the wrappers
					this.groupWrapper = fn.mkDiv({classes:'wrap-floor',append:this.target});
					this.wDown = fn.mkDiv({classes:'wrap-wall',append:this.target,style:'position:'+dd.fixed+';'});
						
					if(this.singleWrap)
					{
						this.initSingleWrap = true;
					}
					else
					{
						this.wrapper = [
							this.groupWrapper,
							this.wDown,
							this.box
						];
					}
					
					// Move all the dead children in to the first wrapper
					for(i=0,j=this.wChildren.length;i<j;i++)
					{
						this.groupWrapper.appendChild(this.wChildren[i]);
					}
				}
			}
			
		break;
	}
	this.target.appendChild(this.box);
	
	// The actual repositioning must occur after the element is already present
	this.move();
	
	// event triggers
	this.boxData.onCreate.call(this);
	this.onCreate.call(this);
};

/**
 * @method addClass
 * Adds a css class to the managed box element.
 * @param {String} class_ The css class to add.
 */
dd.controller.prototype.addClass = function(class_)
{
	// Only add classes that aren't there
	if(!fn.hasWord(this.classes,class_))
	{
		this.classes += ' '+class_;
		if(this.box !== false)
		{
			fn.addClass(this.box,class_);
		}
	}
};

/**
 * @method removeClass
 * Removes a css class from the managed box element.
 * @param {String} class_ The css class to remove.
 */
dd.controller.prototype.removeClass = function(class_)
{
	this.classes = fn.removeWord(this.classes,class_);
	if(this.box !== false)
	{
		fn.removeClass(this.box,class_);
	}
};

/**
 * @method destroy
 * Destroys the controller including the managed box element. This will execute the box's onDestroy
 * method.
 */
dd.controller.prototype.destroy = function()
{
	if(this.singleWrap && this.initSingleWrap)
	{
		fn.addClass(this.wDown, 'ninja');
		this.target.removeChild(this.box);
	}
	else
	{
		var i,j;
		if(this.boxData.wrapsChildren)
		{
			for(i=0, j=this.wChildren.length;i<j;++i)
			{
				this.target.appendChild(this.wChildren[i]);
			}
			for(i=0, j=this.wrapper.length;i<j;++i)
			{
				this.target.removeChild(this.wrapper[i]);
			}
			this.wDown = false;
		}
		else
		{
			fn.rmDiv(this.box);
		}
	}
	this.box = false;
	this.visible = false;
	if(this.view)
	{
		this.view.onWipe.call(this);
		this.ranView = false;
	}
	this.boxData.onDestroy.call(this);
	this.onDestroy.call(this);
};

/**
 * @method newMV
 * Updates both the current model and the current view being used.
 * @param {String} model The new model type that will be used.
 * @param {String} [view]
 * The new view type that will be used. If this is not supplied, it will attempt to determine which
 * view is desired based on the {modelName}_{controllerBoxType}.
 */
dd.controller.prototype.newMV = function(model,view)
{
	// If no view was specified, 
	if(arguments.length < 2)
	{
		var view = model+'_'+this.boxData.type;
	}
    this.removeClass('rg-display-[A-Za-z_0-9.]+');
	this.model = dd.useModel(model);
	this.view = dd.useView(view);
	this.view.controller = this;
	this.addClass('rg-display-'+this.view.display.type);
	this.view.loadModel(this.model);
};

/**
 * @method fillInView
 * Sets the innerHTML of the box with the specified view. Generally this is not needed.
 * @param {Riot.DDragon.view} view The view that needs to be rendered.
 */
dd.controller.prototype.fillInView = function(view)
{
	if(this.ranView)
	{
		view.onWipe.call(this);
	}
	else
	{
		this.ranView = true;
	}
	this.box.innerHTML = view.content;
};

/**
 * @method runView
 * Runs the view and places the data in the box's html. Any fire plans in place will be called at
 * this time. This can only run after the controller has been created.
 */
dd.controller.prototype.runView = function()
{
	if(this.box !== false && this.view)
	{
		this.fillInView(this.view);
		if(this.view.init === false)
		{
			fn.fire.plan('model',{'view': this.view, 'controller': this},function(p,e,fireId)
			{
				if(typeof(p.view.data) !== 'undefined' && p.view.data._name === e.name)
				{
					p.view.reload();
					p.controller.fillInView(p.view);
					p.controller.view.onFill.call(p.controller);
					fn.fire.scrap(fireId);
				}
			});
		}
		else
		{
			this.view.onFill.call(this);
		}
	}
};

/**
 * @method redraw
 * Redraws the controller using the specified model call.
 * @param {String} modelCall The method to call. These parameters are mapped as such:
 * 
 * - get => get(arg[1])
 * - get => get(arg[1], arg[2])
 * - getFull => getFull(arg[1])
 * - getFull => getFull(arg[1], arg[2])
 * - collect => collect()
 * - collect => collect(arg[1])
 * - collect => collect(arg[1], arg[2])
 *
 * @param {Object...} args Any other arguments that need to be passed to the model's call.
 */
dd.controller.prototype.redraw = function(modelCall)
{
	switch(modelCall+arguments.length)
	{
		case 'get2':
			this.view.load(this.model.get(arguments[1]));
		break;
		
		case 'get3':
			this.view.load(this.model.get(arguments[1],arguments[2]));
		break;
		
		case 'getFull2':
			this.view.load(this.model.getFull(arguments[1]));
		break;
		
		case 'getFull3':
			this.view.load(this.model.getFull(arguments[1],arguments[2]));
		break;
		
		case 'collect1':
			this.view.load(this.model.collect());
		break;
		
		case 'collect2':
			this.view.load(this.model.collect(arguments[1]));
		break;
		
		case 'collect3':
			this.view.load(this.model.collect(arguments[1],arguments[2]));
		break;
	};
	
	this.runView();
};


/**
 * @method moveXY
 * Repositions the box to the specified location.
 * @param {Number} x The left position of the box.
 * @param {Number} y The top position of the box.
 */
dd.controller.prototype.moveXY = function(x,y)
{
	if(this.refix)
	{
		x += document.documentElement.scrollLeft;
		y += document.documentElement.scrollTop;
	}
	this.box.style.left = x+'px';
	this.box.style.top = y+'px';
};

/**
 * @method move
 * Moves the box based on the given settings and the supplied event. This allows for the box to be
 * positioned in line with the mouse cursor easily.
 * @param {Object} event The event object supplied by a handler. 
 */
dd.controller.prototype.move = function(event)
{
	if(typeof(event) === 'undefined')
	{
		event = {
			clientY: 0,
			clientX: 0
		};
	}
	// Dynamic Repositioning
	if(this.repos)
	{
		var top, left, vs;
		
		// There are different ways to position based on what we measure against
		switch(this.boxData.position)
		{
			case 'target':
				vs = [this.target.offsetHeight,this.target.offsetWidth];
			break;
			
			case 'mouse':
			case 'viewport':
				vs = [
					window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
					window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
				];
			break;
		}
		
		// The actual repositioning
		// repos[0] is positioning from, top or bottom
		switch(this.repos[0])
		{
			case 'center':
				top = vs[0]/2;
			break;
			
			case 'page':
				top = vs[0];
			break;
			
			case 'mouse':
				top = event.clientY;
				if(top < (vs[0]/2))
				{
					this.repos[2] = 'bottom';
				}
				else
				{
					this.repos[2] = 'top';
				}
			break;
		}
		// repos[1] is positioning from, left or right
		switch(this.repos[1])
		{
			case 'center':
				left = vs[1]/2;
			break;
			
			case 'page':
				left = vs[1];
			break;
			
			case 'mouse':
				left = event.clientX;
				if(left < (vs[1]/2))
				{
					this.repos[3] = 'right';
				}
				else
				{
					this.repos[3] = 'left';
				}
			break;
		}
		// repos[2] is positioning to, top or bottom
		switch(this.repos[2])
		{
			case 'center':
				top -= this.box.offsetHeight/2;
			break;
			
			case 'top':
				top -= this.box.offsetHeight + this.boxData.offsetY;
			break;
			
			case 'bottom':
				top += this.boxData.offsetY;
			break;
		}
		// repos[3] is positioning to, left or right
		switch(this.repos[3])
		{
			case 'center':
				left -= this.box.offsetWidth/2;
				//msh(top + ' -- ' + left + ' & ' + this.box.offsetHeight + ' -- ' + this.box.offsetWidth);
			break;
			
			case 'left':
				left -= this.box.offsetWidth + this.boxData.offsetX;
			break;
			
			case 'right':
				left += this.boxData.offsetX;
			break;
		}
		
		this.moveXY(left,top);
	}
};

/**
 * @method show
 * Shows the box.
 */
dd.controller.prototype.show = function()
{
	if(!this.visible)
	{
		fn.removeClass(this.box,'ninja');
		this.visible = true;
		this.boxData.onShow.call(this);
		this.onShow.call(this);
	}
};

/** 
 * @method hide
 * Hides the box.
 */
dd.controller.prototype.hide = function()
{
	if(this.visible)
	{
		fn.addClass(this.box,'ninja');
		this.visible = false;
		this.boxData.onHide.call(this);
		this.onHide.call(this);
	}
};

// Uses fn.addEvent, but 'this' is the controller, and target is box
/**
 * @method addEvent
 * Adds an event to the box, however the scope of the callback will be the controller.
 * @param {String} event The event to listen for.
 * @param {Function} callback The function to execute when the event fires.
 */
dd.controller.prototype.addEvent = function(event,callback)
{
	var self = this;
	fn.addEvent(this.target || fn.$(this.boxData.target)[0], event, (function(e)
	{
		callback.call(self,e);
	}));
};


/**
 * @method reactive
 * This is the most commmon method for controllers to react to event information it controls digging
 * for data, button handling, similar event propogation restriction and success/fail events. It
 * expects a data object returned by fn.addEvent callbacks. This data object can be manipulated
 * before hand in order to change how reactive reacts
 * @param {Object} data The data object passed from an {@link Riot.DDragon.fn#addEvent} callback.
 */
dd.controller.prototype.reactive = function(data)
{
	// First: Extending out the event data
	var basic = {
		action:'get',
		reactDepth:5,
		stopSimilar:false,
		allowShow:true,
		allowMove:true,
		allowHide:true,
		allowModelChange:true,
		allowBoxCreate:true,
		onReactive:function(){},
		success:function(){},
		fail:function(){},
		execute:true
	},
		potential;
	data = fn.rebase(data,basic);
	
	// Button Settings kill early
	if(data.buttonRestrict !== -1 && data.button !== data.buttonRestrict) return;
	
	// Get more data and kill process if there was no event to react to
	data.info = fn.rgInfo(data.target,data.reactDepth);
	if(data.info === false)
	{
		if(data.allowHide)
		{
			this.hide();
		}
		data.fail.call(this,data);
		return;
	}
	
	// We give the controller and view a chance to respond to the data, then the onReactive setting here
	// Reactive events can return false to kill this process
	if(this.onReactive(data) === false ||
		(this.view && this.view.onReactive.call(this,data) === false) ||
		(data.onReactive.call(this,data) === false)
	){
		data.execute = false;
	}
	
	// Kill false executes by this point
	if(data.execute === false)
	{
		data.fail.call(this,data)
		return;
	}
	
	// Potential model change
	data.info.wrongModel = (data.info.name !== this.model.name);
	data.info.modelChange = data.info.wrongModel && data.allowModelChange;
	if(data.info.modelChange)
	{
		this.newMV(data.info.name);
	}
	else if(data.info.wrongModel)
	{
		return;
	}
	
	// Potential box creation
	if(data.allowBoxCreate && this.box === false)
	{
		this.create();
		// Force a redraw
		this.current = '';
	}
				
	// Check for an id change (or model change)
	// Run action if there was a change
	data.info.idChange = (data.info.id !== this.current) || data.info.modelChange;
	if(data.info.idChange)
	{
		if(data.action === 'collect')
		{
			this.redraw('collect');
		}
		else
		{
			this.redraw(data.action,data.info.id);
		}
		this.current = data.info.id;
	}
	
	// stop similar events
	if(data.stopSimilar)
	{
		var subEvent = function(_data)
		{
			_data.event.stopPropagation();
		};
		fn.addEvent(this.box,data.type,subEvent);
		this.onDestroy = function()
		{
			fn.removeEvent(this.box,data.type,subEvent);
		};
	}
	
	// show and move
	if(data.allowShow)
	{
		var moveTest = this.visible;
		this.show();
		if(data.allowMove || !moveTest)
		{
			this.move(data.event);
		}
	}
	data.success.call(this,data);
};

/*
 * Mixes addEvent with reactive
 */
/**
 * @method addReactiveEvent
 * Combines the functionality of reactive and addEvent. This also allows for a global default to be
 * applied to the eventData prior to the call to reactive.
 * @param {String} event The event to listen for.
 * @param {Object} extendData The data to be applied to the eventData prior to execution.
 */
dd.controller.prototype.addReactiveEvent = function(event,extendData)
{
	this.addEvent(event,function(eventData)
	{
		this.reactive(fn.rebase(eventData,extendData || {}));
	});
};

/**
 * @method
 * @member Riot.DDragon
 * Destroys the controller associated with the specified box element.
 * @param {HTMLElement} elem The element that is being managed.
 */
dd.destroyBox = function(elem)
{
	var contId = elem.getAttribute('data-control');
	if(contId !== null || contId !== '')
	{
		dd.controllers[contId].destroy();
	}
	else
	{
		fn.rmDiv(elem);
	}
};

/**
 * @method
 * @member Riot.DDragon
 * Creates a new controller with the specified box.
 * @param {String} box The box this controller manages.
 */
dd.useController = function(box)
{
	return new dd.controller(box);
};

/**
 * @method
 * @member Riot.DDragon
 * Combines a modle, view, and controller into a single object.
 * @param {Boolean} create
 * Whether to create the box element or not. If this is not required, it can be dropped from the
 * argument list.
 * @param {String} model The name of the model to use in the view.
 * @param {String} view The name of the view to use.
 * @param {String} box The box the controller will manage.
 * @return {Riot.DDragon.controller} The created controller.
 */
dd.buildController = function()
{
	// Optional create parameter. If there are 4 parameters
	var i = arguments.length, create = true;
	if(i === 4) create = arguments[0];
	
	var c = dd.useController(arguments[i-1]);
	c.newMV(arguments[i-3],arguments[i-2]);
	
	if(create) c.create();
	return c;
};
dd.players = {};

/**
 * @class Riot.DDragon.player
 * A data container class representing total player character data, intended to be a bucket data holder
 * @param {Object} [options] Default data to store on to the player object at creation
 */
dd.player = function(options)
{
	options = options || {};
	fn.rebase(this, options, {
		name: '',
		summonerlevel: 30,
		champion: false,
		level: 1,
		summoner: [],
		item: [],
		rune: {
			red: [],
			yellow: [],
			blue: [],
			black: []
		},
		mastery: {},
		masteryString: '',
		stacks: {}
	});
	
	var masteryC = 3*6*4;
	while(masteryC--) {
		this.masteryString += '0';
	}
	
	this.stats = this.basicStats();
};

dd.player.prototype.basicStats = function()
{
	return {
		armor: 0,
		basearmor: 0,
		bonusarmor: 0,
		spellblock: 0,
		basespellblock: 0,
		bonusspellblock: 0,
		attackdamage: 0,
		spelldamage: 0,
		dodge: 0,
		flatarmorpenetration: 0,
		flatmagicpenetration: 0,
		percentarmorpenetration: 0,
		percentmagicpenetration: 0,
		cooldown: 0,
		cooldownsummoner: 0,
		attackrange: 0,
		attackspeed: 0,
		crit: 0,
		critdamage: 2,
		hp: 0,
		hpregen: 0,
		mp: 0,
		mpregen: 0,
		movespeed: 300,
		goldper10: 0,
		timedead: 0
	};
};

dd.player.prototype.setMastery = function(id, points)
{
	this.mastery[id] = points;
	this.updateMasteryStringFor(id);
	return true;
};

dd.player.prototype.addMastery = function(id)
{
	var masteryModel = dd.useModel('mastery');
	if(!masteryModel.init)
	{
		return false;
	}
	var mastery = masteryModel.get(id),
		count = this.getMastery(id);
	if(count >= mastery.ranks)
	{
		return false;
	}
	
	this.mastery[id] += 1;
	this.updateMasteryStringFor(id);
	return true;
};

dd.player.prototype.setMasteryByString = function(masteryString)
{
	var tree = 3+1,
		col = 6+1,
		row = 4+1,
		pos, points, id;
	
	while(--tree)
	{
		while(--col)
		{
			while(--row)
			{
				pos = tree*24 + col*4 + row;
				points = parseInt(masteryString.charAt(pos), 10);
				if(points) {
					id = (tree + '' + col + '' + row);
					this.mastery[id] = points;
				}
			}
		}
	}
	this.masteryString = masteryString;
};

dd.player.prototype.updateMasteryStringFor = function(id)
{
	var tree = parseInt(id.charAt(0), 10) -2,
		col = parseInt(id.charAt(1), 10) -1,
		row = parseInt(id.charAt(2), 10) -1,
		pos = tree*24 + col*4 + row;
	
	this.masteryString = this.masteryString.slice(0, pos) + this.mastery[id] + this.masteryString.slice(pos + 1);
};

dd.player.prototype.getMastery = function(id)
{
	if(typeof this.mastery[id] === 'undefined')
	{
		this.mastery[id] = 0;
	}
	return this.mastery[id];
};

dd.player.prototype.setRune = function(id)
{
	var runeModel = dd.useModel('rune');
	if(!runeModel.init)
	{
		return false;
	}
	var rune = runeModel.get(id),
		type = rune.rune.type,
		count = this.rune[type].length;
	
	if(
		(type === 'black' && count >= 3) ||
		(count >= 9)
	)
	{
		return false;
	}
	
	this.rune[type].push(rune.id);
	return true;
};

dd.player.prototype.setChampion = function(id)
{
	this.champion = id;
	return true;
};

dd.defaultPlayer = new dd.player();/**
 * @method
 * @member Riot.DDragon.fn
 * Uses a series of stats to figure out a champion's current attack speed
 * @param {Number} level The current champion level
 * @param {Number} offset The current champion's attack speed offset (in stats)
 * @param {Number} aspdper The current champion's attack speed per level
 * @param {Number} aspd (Optional) Attack speed bonus from other sources
 */
fn.calcAspd = function(level, offset, aspdper, aspd)
{
	aspd = aspd || 0;
	var i = 1/(1.6 * (1+offset)) * (1+aspd + aspdper*(level-1)/100);
	return Math.round(i*1000)/1000;
};

dd._spellDataLink = function(calc, spell, spellLevel, player)
{
	this.calc = calc;
	this.spell = spell;
	this.spellLevel = spellLevel;
	this.player = player;
	
	this.data = {};
	this.generateLinks();
};

dd._spellDataLink.prototype.generateLinks = function()
{
	var i,j, v;
	
	// vars
	for(i=0, j=this.spell.vars.length; i<j; ++i)
	{
		v = this.spell.vars[i];
		this.data[v.key] = this.generateLink(v);
	}
	
	// effects
	for(i=1, j=this.spell.effect.length; i<j; ++i)
	{
		this.data['e'+i] = ( this.calc === 0 ?
			this.spell.effectBurn[i] :
			this.spell.effect[i][this.spellLevel-1]
		);
	}
};

/*
 * Basic Link Types:
 *   bonusattackdamage, attackdamage, bonushealth, health, abilitypower,
 *   bonusarmor, armor, bonusspellblock, spellblock, bonusmovespeed, movespeed,
 *   bonusmana, mana
 *
 * All basic links can be preceded by @dynamic. in order to clear out the ( ) around
 * them in calc levels less than 2 (calc by player == calc 2)
 *
 * Special Link Types:
 *   @text = should always be equivalent to default
 *   @cooldownchampion = uses spell cooldown reduction (player.cooldown)
 *   @cooldownsummoner = uses summoner spell cooldown reduction (player.cooldownsummoner)
 *   @stacks = Multiplicative based on spell stacks
 *   @player.* = Gets a direct stat from the player object (usually level)
 *   @special.* = Must have specialized code written just for it
 */
dd._spellDataLink.prototype.generateLink = function(v)
{
	// No Calculations, using primarily burned in values
	if(this.calc === 0)
	{
		switch(v.link)
		{
			case '@player.level':
				return v.coeff[0] + ' - ' + v.coeff[v.coeff.length-1];
			
			case '@cooldownsummoner':
			case '@cooldownchampion':
				return this.spell.cooldownBurn;
				
			case '@stacks':
				if(typeof(v.coeff) === 'object')
				{
					return v.coeff.join('/') + ' ' + fn.t('perStack');
				}
				return v.coeff + ' ' + fn.t('perStack');
				
			default:
				if(v.link.indexOf('@dynamic.') === 0)
				{
					return ''; // (+{{ ... }}) / ({{ }})
				}
				if(typeof(v.coeff) === 'object')
				{
					return v.coeff.join('/');
				}
				return v.coeff;
		}
	}
	// Calculations are via the individual spell itself. No player calculations.
	else if(this.calc === 1)
	{
		switch(v.link)
		{
			case '@player.level':
				return v.coeff[0] + ' - ' + v.coeff[v.coeff.length-1];
				
			case '@stacks':
				if(typeof(v.coeff) === 'object')
				{
					return v.coeff[this.spellLevel-1] + ' ' + fn.t('perStack');
				}
				return v.coeff + ' ' + fn.t('perStack');
			
			case '@cooldownsummoner':
			case '@cooldownchampion':
				return this.spell.cooldown[this.spellLevel-1];
				
			default:
				if(typeof(v.coeff) === 'object')
				{
					return v.coeff[this.spellLevel-1];
				}
				return v.coeff;
		}
	}
	// Calculations use all player stats, multiplying out coefficients and similar.
	else if(this.calc === 2)
	{
		switch(v.link)
		{
			default:
				break;
		}
	}
	
	return '';
};



dd._spellDataLink.prototype.getLeveltip = function()
{
	//return fn.format(this.spell.leveltip[].replace(/{%/g,'{{').replace(/%}/g,'}}'), data);
};

dd._spellDataLink.prototype.getTooltip = function()
{
	return fn.format(this.spell.tooltip, this.data);
};

/**
 * @method
 * @member Riot.DDragon.fn
 * Creates tooltip text out of a spell object and all the data that goes in to it
 * This is an expensive process, use it sparingly.
 * @param {Number} calc A determination of we're going to pull data and show the data.
 * Possible values:
 *   0: No calculations are performed and the preburned values are used.
 *   1: spellLevel is used to determine how spells are shown
 *   2: Same as 1, except coefficients are also calculated in to player data.
 * @param {Object} spell The spell object we're trying to get tooltip data off of
 * @param {Number} [spellLevel=1] The spell level we're referencing
 * @param {Riot.DDragon.player} [player=defaultPlayer] A player object to fill data in with
 */
dd.spellDataLink = function(calc, spell, spellLevel, player)
{
	spellLevel = spellLevel || 1;
	player = player || dd.defaultPlayer;
	return new dd._spellDataLink(calc, spell, spellLevel, player);
};
if(typeof(w.rg_force_endapp) !== 'undefined')
{
	w.rg_force_endapp();
}
else
{
	// The Default End Application
	dd.dynamicScan(fn.$('body')[0]);
	
	dd.endApp = {
		tooltip: dd.buildController('item','item_tooltip','tooltip'),
		itemmodal: dd.buildController(false, 'item', 'item_modal', 'modal')
	};
	
	// Tooltips (All)
	dd.endApp.tooltip.addReactiveEvent('mousemove');
	
	// item modal
	dd.endApp.itemmodal.addReactiveEvent('click', {
		buttonRestrict: 0,
		stopSimilar: true,
		allowModelChange: false,
		action: 'getFull',
		success: function () {
			dd.endApp.tooltip.hide();
		}
	});
}

(function()
{
	// Takes app data (as produced by addApp), checks for requirements
	// Executes based on presence of requirements. Otherwise delay executes
	function appCycle(app)
	{
		var m;
		reqstrip: for(m = 0;m < app.ms.length;++m)
		{
			// Strip out all requirements that are already loaded
			while(dd.useModel(app.ms[m]).init)
			{
				app.ms.splice(m,1);
				if(typeof(app.ms[m]) === 'undefined')
				{
					break reqstrip;
				}
			}
			
			// Respond to applications that will soon load
			fn.fire.plan('model',{index: m, app: app},function(planData,execData,fireId)
			{
				if(planData.app.ms[planData.index] === execData.name)
				{
					planData.app.ms.splice(planData.index,1);
					if(planData.app.ms.length === 0)
					{
						planData.app.app();
						fn.fire.scrap(fireId);
					}
				}
			});
		}
		if(app.ms.length === 0)
		{
			app.app();
		}
	};
	
	/**
	* @method
	* @member Riot.DDragon
	* Adds an application definition to DataDragon.
	* @param {Array} ms The required models that need to be loaded before the app can be run.
	* @param {Function} app The function to execute once the models have been loaded.
	*/
	dd.addApp = function(ms,app)
	{
		appCycle({'app':app,'ms':ms});
	};
	
	// Execute all the apps added before
	var i,j;
	for(i = 0,j = dd.app.length;i<j;++i)
	{
		appCycle(dd.app[i]);
	}
})();
};

/* END OF DDRAGON */