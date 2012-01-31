/**
 * fSession 1.1 - FreeSWITCH Session JavaSCRIPT
 *
 * Licensed under the Apache2 
 * http://www.opensource.org/licenses/apache2.0.php
 *
 * $Date: 2012-01-24 00:00:00 -0800 (Tue, 24 Jan 2012) $
 *
 * Copyright 2012 Nika Jones -- fSession.com
 */

/*
 * use cases
 *
 * oSession =fSession(); // This will try and capture the gobal freeswitch session object
 *
 * oSession =fSession(session); // Explictly pass in a session to use
 * or
 * oSession =fSession(new Session()); // passing in a new freeswitch session object
 *
 * oSession =fSession('a-leg', session); // This will name a freeswitch session that you can later use
 * oSession =fSession('a-leg');          // NOTE: your namespaces can't begin with an _
 *
 * oSession =fSession(oPrevious_oSession); // This is how you pass in a previous fSession object to use
 */

/**
 * _fSession 1.1 - FreeSWITCH Session JavaSCRIPT
 *
 * Licensed under the Apache2 
 * http://www.opensource.org/licenses/apache2.0.php
 *
 * $Date: 2012-01-24 00:00:00 -0800 (Tue, 24 Jan 2012) $
 *
 * Copyright 2012 Nika Jones -- _fSession.com
 */

/*
 * use cases
 *
 * oSession =_fSession(); // This will try and capture the gobal freeswitch session object
 *
 * oSession =_fSession(session); // Explictly pass in a session to use
 * or
 * oSession =_fSession(new Session()); // passing in a new freeswitch session object
 *
 * oSession =_fSession('a-leg', session); // This will name a freeswitch session that you can later use
 * oSession =_fSession('a-leg');          // NOTE: your namespaces can't begin with an _
 *
 * oSession =_fSession(oPrevious_oSession); // This is how you pass in a previous _fSession object to use
 */

(function(undefined){

	// Setting up the internal _fSession function
	var _fSession =function(sSession, oSession) {
	
		return new _fSession.fn.init(sSession, oSession);
	}
	
	// Private Vars
	var sEmptyS       ='',
		sTypeS        ='string',
		sTypeF        ='function',
		sTypeA        ='array',
		sTypeO        ='object',
		legs          ='ABCDEFGHIJKLMNOPQRSTUVWXYZ',   // the legs we can have
		sessions      ={},        // keep all of the sessions here (and name them)
		databases     ={},        // keep all of the db's tagged here
		rxInvalidName =/^_/,      // check the session name (can't start with _)
		rxTrim        =/^\s+|\s+$/g,
		sCurrentSession ='',
		
		fillSessionList =function() {
			
			var ary =[];
			for(a in sessions) {
				if(sessions.hasOwnProperty(a)) {
					
					ary.push(sessions[a])
				}
			}
			
			return ary;
		};
	
	_fSession.prototype =_fSession.fn ={
	
		// Public Vars
		init :function(mSession, oSession) {
			
			var sLeg ='_Leg';
			
			this.result =null;
			
			this.isFsession     =true; // for fSession object checks
			this.version        ='1.1a';
			this.aSession       =[]; // these are the sessions that we have available;
			
			// nothing to sniff... awww...
			if(mSession ==undefined && oSession ==undefined) {
			
				// generate a leg_ name
				var aSessionList =fillSessionList(),
					nSessionIndex =aSessionList.length,
					sSessionIndex =legs.charAt(nSessionIndex),
					sSessionName =sLeg+sSessionIndex;
					
				// grab the global session object
				sessions[sSessionName] =session;
				this.aSession =aSessionList; // overwrite the old aSessionArray
				this.aSession.push(sessions[sSessionName]);
				
				sCurrentSession =sSessionName;
				return this;
			}

			// sniff to see if mSession is freeswitch session object
			if(!!mSession.ready) {
				
				// grab the global session object.
				var aSessionList =fillSessionList(),
					nSessionIndex =this.aSession.length,
					sSessionIndex =legs.charAt(nSessionIndex),
					sSessionName =sLeg+sSessionIndex;
					
				sessions[sSessionName] =mSession;
				this.aSession =aSessionList; // overwrite the old aSessionArray
				this.aSession.push(sessions[sSessionName]);
				
				sCurrentSession =sSessionName;
				return this;
			}
			
			// we're passing a string name
			if(typeof mSession ==sTypeS) {
			
				// check to see if we already have a session with this name
				if(sessions[mSession] ==undefined) {
			
					// make sure that it's not invalid
					if(mSession.search(rxInvalidName) ==-1) {
					
						// Then we have to name the session. This will overrite any session with that
						// name that was previously there.
						if(_fSession.isA(oSession)) {
							
							sCurrentSession =mSession;
							return oSession;
						} else if(oSession !=undefined) {	
						
							sessions[mSession] =oSession;
						} else {
						
							sessions[mSession] =session; // using the global freeswitch session object
						}
						
						sCurrentSession =mSession;
						this.aSession.push(sessions[mSession]);
						return this;
					} else {
						
						// display error
						this.log('Invalid Session Name; can\'t contain an _ (underscore)');
					}
				} else {
					
					sCurrentSession =mSession;
					return this;
				}
			}	
			
			return false; // there was some error, so send a false back.
		},
		
		each :function(loopee, callback) {
			
			return _fSession.each(this, callback);
		},
		
		log :function (data) {
		
			if(typeof console !=undefined) {
				
				console.log(data);
			} else {
			
				console_log('info', data +"\n");
			}
			
			return this;
		},
		
		error :function (data) {
		
			if(typeof console !=undefined) {
				
				console.log(data);
			} else {
			
				console_log('error', data +"\n");
			}
			
			return this;
		}
	}
	
	_fSession.fn.init.prototype = _fSession.fn;
	
	_fSession.extend = 
	_fSession.fn.extend = function(ext, funct) {
	
		var i;
		var oAttach, oFunctions;
		
		oAttach =funct ? ext : this || {};
		oFunctions =funct || ext;
		
		for(i in oFunctions) {
			if(oFunctions.hasOwnProperty(i)) {
			
				oAttach[i] =oFunctions[i];
			}
		}
		
		return this;
	}
	
	_fSession.extend({
		each :function(loopee, callback) {
			
			var i;
			
			for(i in loopee) {
				if(loopee.hasOwnProperty(i)) {
				
					if(!this.isFunction(loopee)) {
						
						callback.apply(i, loopee[i]);
					}
				}
			}
			
			return this;
		},
		
		isFunction :function(test) {
			
			return (typeof test ==sTypeF);
		},
		
		isString :function(test) {
			
			return (typeof test ==sTypeS);
		},
		
		isArray :function(test) {
		
			return !(test.constructor.toString().indexOf(sTypeA) ==-1);
		},
		
		isObject :function(test) {
		
			return (typeof test ==sTypeO);
		},
		
		isSession :function(test) {
			
			return (typeof(test.ready) !=undefined && !!test.ready);
		},
		
		isA :function(test) {
			
			if(typeof test ==sTypeO) {
				return (!!test.isFsession);
			}
			
			return false;
		},
		
		results : function() {
			
			var that =this;
			return {
			
				toString : function() { return '' +that.result; }
			}
		},
		
		format :function() {
			
			var args =arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] !=undefined ? args[number] : match;
 			 });
		},
		
		trim :function(text) {
		
			return (text || sEmptyS).replace(rxTrim, sEmptyS);
		},
		
		constant :function(name, a, namespace) {

			console.log("a");
			if(namespace !=undefined && typeof namespace ==sTypeO) {
				
				console.log("b");
				this[namespace] = this[namespace] || {};

				if(this[namespace][name] ==undefined) {
			
					console.log("c");
					this[namespace][name] = a;
				}
				
				console.log("d");
				return this[namespace][name];
			}
			
			if(this[name] ==undefined) {
			
				console.log("e");
				this[name] = a;
			}
			
			console.log("f");
			return this[name];
		},
		
		email :function (options) {
			var sFrom, sTo, sHeaders, sBody, sFileName;
			
			if(!options.to || !options.from) {
			
				return false;
			}
			
			options.headers = options.headers || {};
			
			sTo =options.to;
			sFrom =options.from;
			sHeaders =sEmptyS;
			
			for(i in options.headers) {
				if(options.headers.hasOwnProperty(i)) {
				
					sHeaders = sHeaders+i+': '+options.headers+'\r\n';
				}
			}
			
			sBody = options.body || sEmptyS;
			sFileName = options.attachFile || sEmptyS;
			
			email(sFrom, sTo, sHeaders, sBody, sFileName);
		},
		
		time :function(time) {
			var ime, th = [], at = time.match(/(\d+\D+)/g);
			
			for(ime in at) {
				if(at.hasOwnProperty(ime)) {
				
					th.push({time: parseFloat(at[ime]), multiple: '' +at[ime].match(/\D+$/)});
				}
			}
			
			return { 
				toSecond : function() {
					var e, r = 0;
					
					for(e in th) {
						if(th.hasOwnProperty(e)) {
						
							switch(th[e].multiple) {
							
								case 'd': r += (th[e].time * 24 * 60 * 60); break;
								case 'h': r += (th[e].time * 60 * 60); break;
								case 'm': r += (th[e].time * 60); break;
								case 's': r += (th[e].time); break;
								case 'ms': r += (th[e].time /1000); break;
							}
						}
					}
											
					return r;
				},
				
				toMillisecond : function() {
				
					return this.toSecond() * 1000;
				}
			}
		}
	});
		
	_fSession.extend(_fSession.fn.init.prototype, {
		ANI :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.ani; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].ani); }
					}
				}
			}
			
			return mReturn;
		},
		
		ANI2 :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.ani2; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].ani2); }
					}
				}
			}
			
			return mReturn;
		},
		
		UUID :function(index) {
			var s, mReturn = [];
			
			
			if(index !=undefined) {
			
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.uuid; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].uuid); }
					}
				}
			}
				
			return mReturn;
		},
		
		NAME :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.name; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].name); }
					}
				}
			}
			
			return mReturn;
		},
		
		DIALPLAN :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.dialplan; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].dialplan); }
					}
				}
			}
			
			return mReturn;
		},
		
		CAUSE :function() {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.cause; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].cause); }
					}
				}
			}
			
			return mReturn;
		},
		
		CAUSECODE :function() {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.causecode; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].causecode); }
					}
				}
			}
			
			return mReturn;
		},
		
		DESTINATION :function() {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.destination; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].destination); }
					}
				}
			}
			
			return mReturn;
		},
		
		NETWORK_ADDRESS :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.network_Addr; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].network_Addr); }
					}
				}
			}
			
			return mReturn;
		},
		
		STATE :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.state; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].state); }
					}
				}
			}
			
			return mReturn;
		},
		
		CALLER_ID_NAME :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.caller_id_name; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].caller_id_name); }
					}
				}
			}
			
			return mReturn;
		},
		
		CALLER_ID_NUMBER :function(index) {
			var s, mReturn = [];
			
			if(index !=undefined) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.caller_id_num; }
			} else {
			
				for(s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].caller_id_num); }
					}
				}
			}
			
			return mReturn;
		}
	});
	
	_fSession.extend(_fSession.fn.init.prototype, {

		originate :function(dialplan, options, context) {
			// the dialplan can be a string or object
			
			if(_fSession.isString(dialplan)) {
			
				var oSession = new Session(dialplan);
				if(oSession.ready()) { return _fSession(oSession); }
				
				throw('The string dialplan could not start a session');
			}
		},
		
		bridge :function(dialplan, callback, options) {
			var oNewSession, oLegA, oLegB;
			
			if(_fSession.isString(dialplan)) {
			
				oNewSession =_fSession().originate(dialplan);
				oLegB = oNewSession.aSession[oNewSession.aSession.length -1]; // this is the last thing we setup.
			}
				
			if(_fSession.isA(dialplan)){
				
				oLegB = dialplan.aSession[dialplan.aSession.length -1];
			}
			
			// TODO: check to make sure that we have two or more sessions
			oLegA = this.aSession[this.aSession.length -2]; // the next to last session
			
			if(oLegA.ready() && oLegB.ready()){
			
				bridge(oLegA, oLegB);
				return this;
			}
			
			throw('The bridge could not be connected.');
		},
		
		stream :function(filename, callback, options) {
			
			var s; //sessions
			var fCallback, aArgs, nStartOffset;
			var aArgument = [filename];
			
			if(_fSession.isFunction(callback)) {
				
				fCallback = callback;
				aArgument.push(fCallback);
			} 
			
			if(options !=undefined) {
		
				aArgs = options.args || aArgs;
				nStartOffset = options.startOffset || nStartOffset;
				
				aArgument.push(aArgs); // args
				aArgument.push(nStartOffset); // offset
			}
			
			for(s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.aSession[s].streamFile.apply(this.aSession[s], aArgument); }
				}
			}
			return this;
		},
		
		answer :function() {
		
			for(var s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.aSession[s].answer; }
				}
			}
			
			return this;
		},
		
		preAnswer :function() {
		
			for(var s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.aSession[s].preAnswer; }
				}
			}
			
			return this;
		},
		
		hangup :function(code) {
		
			for(var s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.aSession[s].hangup(code); }
				}
			}
			
			return this;
		},
		
		record :function(filename, callback, options) {
			
			var s, //sessions
				fCallback = aArgs = nCallLength = nSilenceThreshold = nSilenceInterupt = '',
				aArgument = [filename];
			
			if(_fSession.isFunction(callback)) {
				
				fCallback = callback;
			} 
			
			if(options !=undefined) {
		
				aArgs = options.args || aArgs;
				nCallLength = options.callLength || '';
				nSilenceThreshold = options.silenceThreshold || '';
				nSilenceInterupt = options.silenceInterupt || '';
			}
			
			aArgument.push(fCallback);
			aArgument.push(aArgs); // args
			aArgument.push(nCallLength);
			aArgument.push(nSilenceThreshold);
			aArgument.push(nSilenceInterupt);
			
			for(s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.aSession[s].recordFile.apply(this.aSession[s], aArgument); }
				}
			}
			
			return this;
		},
		
		command :function(type, data) {
		
			for(var s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.result =this.aSession[s].execute(type, data); }
				}
			}
			
			return this;
		},
		
		api :function(type, data) {
			
			var s, r;
			
			for(s in this.aSession) {
				if(this.aSession.hasOwnProperty(s)) {
				
					if(this.aSession[s].ready()) { this.result =this.aSession[s].apiExecute(type, data); }
				}
			}
			
			return this;
		},
		
		xml :function(xmlString) {
			
			return new XML(xmlString);
		}
	});
	
	_fSession.extend(_fSession.fn.init.prototype, {
	
		schedHangup :function(options) {
			var sOptions =sEmptyS;
			
			options = options || {};
			options.isAbsolute = options.isAbsolute || false;
			options.inSeconds = options.inSeconds || 60;
			options.hangupCause = ' '+options.hangupCause || sEmptyS;
			
			sOptions = (options.isAbsolute ? sEmptyS : '+')+options.inSeconds+options.hangupCause
			
			this.command('sched_hangup', sOptions);
			
			return this;
		},
		
		sendDtmf :function(letters, duration) {
		
			var sDtmfCommand = letters + (duration ==undefined ? sEmptyS : '@'+duration);
			this.command('send_dtmf', sDtmfCommand);
		},
		
		info :function() {
		
			this.command('info');
			
			return this;
		},
		
		echo :function() {
		
			this.command('echo');
			
			return this;
		}
	
	});
	
	_fSession.extend(_fSession.fn.init.prototype, {

		ajax :function(oRequest) {
			
			if(!this.curl) {
				
				use('CURL');
				this.curl = new CURL();
			}
			
			oReq.credentials = null;
			oReq.timeout = null;
			
			oReq.type = oRequest.type.toUpperCase();
			oReq.url = oRequest.url; // need to parse for credentials
			oReq.data = _fSession.makeQueryString(oRequest.data);
			oReq.contentType = oRequest.contentType;
			oReq.callback = oRequest.success;
			
			this.curl.run(oReq.type, oReq.url, oReq.data, oReq.callback, null, oReq.credentials, oReq.timeout, oReq.contentType);
			
			return this;
		},

		get :function(url, data, callback, type) {
			if(_fSession.isFunction(data)) {
				callback = data;
				data = null;
			}
	
			return _fSession.ajax({
				type: "GET",
				url: url,
				data: data,
				success: callback,
				contentType: type
			});
		},
	
		post :function(url, data, callback, type) {
			if(_fSession.isFunction(data)) {
				callback = data;
				data = {};
			}
	
			return _fSession.ajax({
				type: "POST",
				url: url,
				data: data,
				success: callback,
				contentType: type
			});
		}

	});
	
	_fSession.stream ={
	
		seek :function(amount) {
			
			// do a sanity check here
			return 'seek:'+amount;
		},
		
		volume :function(amount) {
			
			return 'volume:'+amount;
		},
		
		speed :function(amount) {
		
			return 'speed:'+amount;
		},
		
		pause :function() {
		
			return 'pause';
		}
	};
	
	_fSession.record ={
	
		silenceThreshold :function(amount) {
		
			return amount;
		},
		
		silenceInterupt :function(amount) {
		
			return amount;
		}
	}
	
	_fSession.file =function(directory) {
		
		return new File(directory);
	}
	
	_fSession.db =function(connect) {
		
		var isOdbc;
		
		if(typeof(connect) ==sTypeS) {
			
			connect ={ 'name' :connect};
		}
		
		connect.type =connect.type || _fSession.DB_SQLITE;
		connect.name =connect.name || 'default';
		connect.user =connect.user || null;
		connect.pass =connect.pass || null;
				
		var _db =function() {
			
			if(connect.type ==_fSession.DB_SQLITE) {
				
				isOdbc =false;
				if(typeof(CoreDB) ==undefined) {
				
					use("CoreDB");
				}
				this.db = new CoreDB(connect.name);
			}
			
			if(connect.type ==_fSession.DB_ODBC) {
				
				isOdbc =true;
				if(typeof(ODBC) ==undefined) {
					
					use("ODBC");
				}
				this.db = new ODBC(connect.name, connect.user, connect.pass);
			}
			
			this.execute =function(query){
				
				if(isOdbc) { 
					
					this.db.execute(query); 
				} else {
				
					this.db.exec(query);
				}
				
			};
			
			this.fetch =function(){
				
				var _return;
				
				if(isOdbc) { 
					
					_return =this.db.getData(); 
				} else {
				
					_return =this.db.fetch();
				}
				
				return _return;
			};
			
			this.next =function(){
				
				if(isOdbc) { 
					
					this.db.nextRow(); 
				} else {
				
					this.db.next();
				}
			};
			
			this.prepare =function(query){
				if(isOdbc) { 
					
					this.db.query(query); 
				} else {
				
					this.db.prepare(query);
				}
			
			};
			
			this.close =function(){
				
				if(isOdbc) { 
					
					this.db.close(); 
				} else {
				
					this.db.close();
				}
			};
		}
		
		if(typeof(databases[connect.name]) ==undefined) {
			
			databases[connect.name] =new _db();
		}
		
		return databases[connect.name];
	}
	
	_fSession.extend(_fSession.fn.init.prototype, {
		
		say :function(tts) {
	
			var s, pr, pr_type, data;
			
			if(typeof(tts) ==sTypeS) {
				
				tts ={ 'phrase' :tts };
			}
			
			tts.language =tts.language || 'en';
			tts.method =tts.method || _fSession.say.NA;
			tts.engine =tts.engine || _fSession.say.ENGINE;
			tts.voice =tts.voice || _fSession.say.VOICE;
			tts.timer =tts.timer || 'soft';
			
			var preRecorded =['numbers', 'items', 'persons', 'messages', 'currency', 'measured_time', 'date', 'time', 'datetime', 'short_datetime', 'phone_number', 'phone_ext', 'url', 'ip', 'email', 'postal', 'account', 'spelled', 'phonetic'];
			
			if(tts.name !=undefined) { // then we're using an API phrase
				
				tts.data =tts.data || ( tts.phrase || null);
				tts.callback =tts.callback || null;
				tts.args =tts.args || null;
				
				if(typeof(tts.session) !=undefined && _fSession.isSession(tts.session)) {
						
					tts.session.sayPhrase(tts.name, tts.data, tts.language, tts.callback, tts.args);
				} else {
					
					for(var s in this.aSession) {
						if(this.aSession.hasOwnProperty(s)) {
						
							if(this.aSession[s].ready()) { this.aSession[s].sayPhrase(tts.name, tts.data, tts.language, tts.callback, tts.args); }
						}
					}
				}
			
				return this;
			}
			
			for(p in preRecorded) {
				
				if(preRecorded.hasOwnProperty(p)) {
				
					if(tts.phrase !=undefined) { break; } // if there is a phrase then there can be no say.
					
					pr =preRecorded[p];
					if(tts[pr] !=undefined) {
						
						switch(pr) {
							
							case 'numbers': pr_type ='number'; break;
							case 'phone_number': pr_type ='telephone_number'; break;
							case 'phone_ext': pr_type ='telephone_extension'; break;
							case 'ip': case 'email': case 'postal': pr_type =pr+'_address'; break;
							case 'account': pr_type ='account_number'; break;
							case 'spelled': case 'phonetic': pr_type ='name_'+pr; break;
							default: pr_type =pr; break;
						}
						
						data =tts.language+' '+pr_type+' '+tts.method+' '+tts[pr];
						
						if(typeof(tts.session) !=undefined && _fSession.isSession(tts.session)) {
							
							tts.session.execute('say', data);
						} else {
							
							for(var s in this.aSession) {
								if(this.aSession.hasOwnProperty(s)) {
									
									if(this.aSession[s].ready()) { this.aSession[s].execute('say', data); }
								}
							}
						}
						
						return this; // this breaks out of the loop!
					}
				}
			}
			
			if(typeof(tts.session) !=undefined && _fSession.isSession(tts.session)) {
				
				tts.session.speak(tts.engine, tts.voice, tts.phrase, tts.timer);
			} else {
				
				for(var s in this.aSession) {
					if(this.aSession.hasOwnProperty(s)) {
					
						if(this.aSession[s].ready()) { this.aSession[s].speak(tts.engine, tts.voice, tts.phrase, tts.timer); }
					}
				}
			}		
			
			return this;
		},
		
		tone :function(data) {
			
			if(typeof(TeleTone) ==undefined) {
				
				use("TeleTone");
				
				if(typeof(TeleTone) ==undefined) { this.log('TeleTone not found.'); }
			}
			
			var _session, _teltone, _sessions =[];
			
			var toneString =function(obj) {
				
				var _generic, _arguments, _return =sEmptyS;
				
				if(typeof(obj.channel) !=undefined) {
					
					_return +='c='+obj.channel+';';
				}
				
				if(typeof(obj.rate) !=undefined) {
					
					_return +='r='+obj.rate+';';
				}
				
				if(typeof(obj.duration) !=undefined) {
					
					_return +='d='+obj.duration+';';
				}
				
				if(typeof(obj.volume) !=undefined) {
					
					if(typeof(obj.volume.decibles) !=undefined) {
					
						_return +='v='+obj.volume.decibles+'dB;';
					}
					
					if(typeof(obj.volume.decrease) !=undefined) {
					
						_return +='>='+obj.volume.decrease+';';
					}
					
					if(typeof(obj.volume.increase) !=undefined) {
					
						_return +='<='+obj.volume.increase+';';
					}
					
					if(typeof(obj.volume.step) !=undefined) {
					
						_return +='<='+obj.volume.step+';';
					}
				}
				
				if(typeof(obj.wait) !=undefined) {
					
					_return +='w='+obj.wait+';';
				}
				
				if(typeof(obj.repeat) !=undefined) {
					
					if(typeof(obj.repeat.tone) !=undefined) {
					
						_return +='l='+obj.repeat.tone+';';
					}
					
					if(typeof(obj.repeat.all) !=undefined) {
					
						_return +='L='+obj.repeat.all+';';
					}
					
					if(typeof(obj.repeat.loop) !=undefined) {
					
						_return +='loop='+obj.repeat.loop+';';
					}
				}
				
				if(typeof(obj.generic) !=undefined) {
					
					if(obj.generic.duration !=undefined) {
						
						_generic.push({duration:obj.generic.duration, wait:obj.generic.wait, frequencies:obj.generic.frequencies});
						obj.generic =_generic;
					}
					
					for(i in obj.generic) {
						if(obj.generic.hasOwnProperty(i)) {
						
							obj.generic[i].duration =obj.generic.duration || '200';
							obj.generic[i].wait =obj.generic.wait || '200';
							obj.generic[i].frequencies =obj.generic.frequencies || ['400','450'];
							
							_arguments =obj.generic[i].frequencies;
							_arguments.unshift(obj.generic[i].duration, obj.generic[i].wait);
						
							_return +='%('+_arguments.join(',')+');';
						}
					}
				}
	
				return _return;
			}
			
			if(typeof(data.session) !=undefined && _fSession.isSession(data.session)) {
				
				_sessions.push(data.session);
			
			} else {
				_sessions =this.aSession;
			}
			
			for(s in _sessions) {
				if(_sessions.hasOwnProperty(s)) {
				
					_session =_sessions[s];
					_session.execute('playback', toneString(data));
				}
			}
			
			return this;
		}
	});
	
	_fSession.constant('ENGINE', 'cepstral', 'say');
	_fSession.constant('VOICE', 'David', 'say');
	_fSession.constant('NA', 'N/A', 'say');
	_fSession.constant('PRONOUNCE', 'PRONOUNCED', 'say');
	_fSession.constant('ITERATE', 'ITERATED', 'say');
	_fSession.constant('COUNT', 'COUNTED', 'say');
	
	_fSession.constant('DB_SQLITE', 'lite');
	_fSession.constant('DB_ODBC', 'odbc');
	
	_fSession.constant('DTMF', 'dtmf', 'stream');
	
	_fSession.constant('UNALLOCATED', 0, 'hangup');
	_fSession.constant('SUCCESS', 1, 'hangup');
	_fSession.constant('NO_ROUTE_TRANSIT_NET', 2, 'hangup');
	_fSession.constant('NO_ROUTE_DESTINATION', 3, 'hangup');
	_fSession.constant('CHANNEL_UNACCEPTABLE', 6, 'hangup');
	_fSession.constant('CALL_AWARDED_DELIVERED', 7, 'hangup');
	_fSession.constant('NORMAL_CLEARING', 16, 'hangup');
	
	_fSession.constant('RING_US', {generic:{duration:2000,wait:4000,frequencies:[440,480]}}, 'tone');
	_fSession.constant('RING_UK', {generic:[{duration:400,wait:200,frequencies:[400,450]}, {duration:400,wait:2200,frequencies:[400,450]}]}, 'tone');

	// FINALLY we can release to the global scope.
	fSession =f$ =_fSession; // sets the global fSession and $f objects.
})();

// Dummy Sessions and Console objects so browser testing is possiable //
session = (typeof(session) !='undefined') ? session : {
	
	ani : '0000',
	state : 'open',
	uuid : '111',
	
	ready : function() { 
		return true; 
	},
	
	streamFile : function(filename, callback) { 
		
		console.log('streaming file. '+filename); 
		return true;
	},
	
	recordFile : function(filename, callback) { 
		
		console.log('recording! file. '+filename); 
		return true;
	},
	
	hangup : function(code) { 
		
		console.log('Hanging up using code. '+code); 
		return true;
	},
	
	preAnswer : function() { 
		
		console.log('preAnswering... '); 
		return true;
	},
	
	answer : function() { 
		
		console.log('answering... '); 
		return true;
	}
}

Session = (typeof(Session) !='undefined') ? Session : function(diaplpan) {
	var i;
	var uuid = Math.random()*1024;
	this.session = {};
	
	for(i in session) {
		
		if(session.hasOwnProperty(i)) {
			
			this.session[i] = session[i];
		}
	}
	
	this.session.uuid = uuid;
	this.ready = true;
	return this.session;
}