/**
 * fSession 1.0 - FreeSWITCH Session JavaSCRIPT
 *
 * Licensed under the Apache2 
 * http://www.opensource.org/licenses/apache2.0.php
 *
 * $Date: 2008-12-21 12:21:00 -0700 (Sun, 21 Dec 2008) $
 *
 * Copyright 2008 Nika Jones -- fSession.com
 */

(function(){

	fSession = f$ = function(sSession, oSession) {

		return new fSession.fn.init(sSession, oSession);
	}
	
	// Private Vars
	var sessions = {}; // keep all of the sessions here
	var mCurrent = '';
	
	// Public Vars
	fSession.prototype = fSession.fn = {
	
		init :function(mSession, oSession){
			
			this.fSession = '1.0a';
			this.aSession = []; // this are the sessions that we will be using;
			
			if(mSession ==null && oSession ==null) {

				if(typeof session =='undefined') {
		
					return false;
				} else {
		
					if(typeof sessions.legA =='undefined') {
				
							sessions.legA = session;
							this.aSession.unshift(session);
							this.length = this.aSession.length;
							return this;
					} else {
							
						this.aSession.unshift(sessions.legA);
						this.length = this.aSession.length;
						return this;
					}
				}
			}
			
			// sniff to see if mSession is a fSession object
			if(fSession.isA(mSession)) { 
			
				return mSession;
			}	
			
			// sniff to see if mSession is session
			if(!!mSession.ready) {
				
				this.aSession = [mSession];
				this.length = this.aSession.length;
				return this;
			}
			
			if(oSession !=null)
			{	
			
				// need to make sure its only one name.
				sessions[mSession] = oSession;
			}
			
			if(typeof mSession =='string') {
			
				mCurrent = mSession;
				if(typeof sessions[mSession] != 'undefined') {
					
					this.aSession.push(sessions[mSession]);
				} else {
				
					if(typeof sessions.legA =='undefined') {
				
						sessions.legA = session;
						this.aSession.unshift(session);
					} else {
							
						this.aSession.unshift(sessions.legA);
					}
				}
			}
			
			this.length = this.aSession.length;
			return this;
		},
		
		each :function(loopee, callback) {
			
			return fSession.each(this, callback);
		},
		
		log :function (data) {
		
			if(typeof console != 'undefined') {
				
				console.log(data);
			} else {
			
				console_log('info', data+"\n");
			}
			
			return this;
		}
	}
	
	fSession.fn.init.prototype = fSession.fn;
	
	fSession.extend = 
	fSession.fn.extend = function(ext, funct) {
	
		var i;
		var oAttach, oFunctions;
		
		oAttach =funct ? ext : this || {};
		oFunctions =funct || ext;
		
		for(i in oFunctions) {
		
			oAttach[i] =oFunctions[i];
		}
		
		return this;
	}
	
	fSession.extend({
		each :function(loopee, callback) {
			
			var i;
			
			for(i in loopee) {
			
				if(!this.isFunction(loopee)) {
					
					callback.apply(i, loopee[i]);
				}
			}
			
			return this;
		},
		
		isFunction :function(test) {
			
			return (typeof test =='function');
		},
		
		isString :function(test) {
			
			return (typeof test =='string');
		},
		
		isArray :function(test) {
		
			return !(test.constructor.toString().indexOf("Array") == -1);
		},
		
		isObject :function(test) {
		
			return (typeof test =='object');
		},
		
		isSession :function(test) {
			
			return (!!test.ready);
		},
		
		isA :function(test) {
			
			return (!!test.fSession);
		},
		
		trim :function(text) {
		
			return (text || '').replace(/^\s+|\s+$/g, '');
		},
		
		constant :function(name, a, namespace) {

			if(namespace != null) {
			
				this[namespace] = this[namespace] || {};

				if(typeof this[namespace][name] =='undefined') {
			
					this[namespace][name] = a;
				}
				
				return this[namespace][name];	
			}
			
			if(typeof this[name] =='undefined') {
			
				this[name] = a;
			}
			return this[name];
		},
		
		email :function (options) {
			var sFrom, sTo, sHeaders, sBody, sFileName;
			
			if(!options.to || !options.from) {
			
				return false;
			}
			
			options.headers = options.headers || {};
			
			sTo = options.to;
			sFrom = options.from;
			sHeaders = '';
			
			for(i in options.headers) {
				
				sHeaders = sHeaders+i+': '+options.headers+'\r\n';
			}
			
			sBody = options.body || '';
			sFileName = options.attachFile || '';
			
			email(sFrom, sTo, sHeaders, sBody, sFileName);
		},
		
		time :function(time) {
			var ime, th = [], at = time.match(/(\d+\D+)/g);
			
			for(ime in at) th.push({time: parseFloat(at[ime]), multiple: ''+at[ime].match(/\D+$/)});
			
			return { 
				toSecond : function() {
					var e, r = 0;
					
					for(e in th)
					{
						switch(th[e].multiple) {
						
							case 'd': r += (th[e].time * 24 * 60 * 60); break;
							case 'h': r += (th[e].time * 60 * 60); break;
							case 'm': r += (th[e].time * 60); break;
							case 's': r += (th[e].time); break;
							case 'ms': r += (th[e].time /1000); break;
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
		
	fSession.extend(fSession.fn.init.prototype, {
		ANI :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.ani; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].ani); }
			}
			
			return mReturn;
		},
		
		ANI2 :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.ani2; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].ani2); }
			}
			
			return mReturn;
		},
		
		UUID :function(index) {
			var s, mReturn = [];
			
			
			if(index != null) {
			
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.uuid; }
			} else {
			
				for(s in this.aSession)if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].uuid); }
			}
				
			return mReturn;
		},
		
		NAME :function(index) {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.name; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].name); }
			}
			
			return mReturn;
		},
		
		DIALPLAN :function(index) {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.dialplan; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].dialplan); }
			}
			
			return mReturn;
		},
		
		CAUSE :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.cause; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].cause); }
			}
			
			return mReturn;
		},
		
		CAUSECODE :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.causecode; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].causecode); }
			}
			
			return mReturn;
		},
		
		DESTINATION :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.destination; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].destination); }
			}
			
			return mReturn;
		},
		
		NETWORK_ADDRESS :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.network_Addr; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].network_Addr); }
			}
			
			return mReturn;
		},
		
		STATE :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.state; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].state); }
			}
			
			return mReturn;
		},
		
		CALLER_ID_NAME :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.caller_id_name; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].caller_id_name); }
			}
			
			return mReturn;
		},
		
		CALLER_ID_NUMBER :function() {
			var s, mReturn = [];
			
			if(index != null) {
				
				var oSession = (!!parseInt(index+1) ? this.aSession[index] : sessions[index]);
				if(oSession.ready()) { mReturn = oSession.caller_id_num; }
			} else {
			
				for(s in this.aSession) if(this.aSession[s].ready()){ mReturn.push(this.aSession[s].caller_id_num); }
			}
			
			return mReturn;
		}
	});
	
	fSession.extend(fSession.fn.init.prototype, {

		originate :function(dialplan, options, context) {
			// the dialplan can be a string or object
			
			if(fSession.isString(dialplan)) {
			
				var oSession = new Session(dialplan);
				if(oSession.ready()) { return fSession(oSession); }
				
				throw('The string dialplan could not start a session');
			}
		},
		
		bridge :function(dialplan, callback, options) {
			var oLegA, oLegB;
			
			if(fSession.isString(dialplan)) {
			
				oLegB = fSession('legB').originate(dialplan).aSession[0];
			}
				
			if(fSession.isA(dialplan)){
				
				oLegB = dialplan.aSession[0];
			}
			
			oLegA = this.aSession[0];
			this.aSession.push(oLegB);
			
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
			
			if(fSession.isFunction(callback)) {
				
				fCallback = callback;
				aArgument.push(fCallback);
			} 
			
			if(options != null) {
		
				aArgs = options.args || aArgs;
				nStartOffset = options.startOffset || nStartOffset;
				
				aArgument.push(aArgs); // args
				aArgument.push(nStartOffset); // offset
			}
			
			for(s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].streamFile.apply(this.aSession[s], aArgument); }
			
			return this;
		},
		
		answer :function() {
		
			for(var s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].answer; }
			
			return this;
		},
		
		preAnswer :function() {
		
			for(var s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].preAnswer; }
			
			return this;
		},
		
		hangup :function(code) {
		
			for(var s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].hangup(code); }
			
			return this;
		},
		
		record :function(filename, callback, options) {
			
			var s; //sessions
			var fCallback = aArgs = nCallLength = nSilenceThreshold = nSilenceInterupt = '';
			var aArgument = [filename];
			
			if(fSession.isFunction(callback)) {
				
				fCallback = callback;
			} 
			
			if(options != null) {
		
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
			
			for(s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].recordFile.apply(this.aSession[s], aArgument); }
			
			return this;
		},
		
		command :function(type, data) {
		
			for(var s in this.aSession) 
				if(this.aSession[s].ready()) { this.aSession[s].execute(type, data); }
			
			return this;
		}
	});
	
	fSession.extend(fSession.fn.init.prototype, {
	
		schedHangup :function(options) {
			var sOptions ='';
			
			options = options || {};
			options.isAbsolute = options.isAbsolute || false;
			options.inSeconds = options.inSeconds || 60;
			options.hangupCause = ' '+options.hangupCause || '';
			
			sOptions = (options.isAbsolute ? '' : '+')+options.inSeconds+options.hangupCause
			
			this.command('sched_hangup', sOptions);
			
			return this;
		},
		
		sendDtmf :function(letters, duration) {
		
			var sDtmfCommand = letters + (duration == null ? '' : '@'+duration);
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
	
	fSession.extend(fSession.fn.init.prototype, {

		ajax :function(oRequest) {
			
			if(!this.curl) {
				
				use('CURL');
				this.curl = new CURL();
			}
			
			oReq.credentials = null;
			oReq.timeout = null;
			
			oReq.type = oRequest.type.toUpperCase();
			oReq.url = oRequest.url; // need to parse for credentials
			oReq.data = fSession.makeQueryString(oRequest.data);
			oReq.contentType = oRequest.contentType;
			oReq.callback = oRequest.success;
			
			this.curl.run(oReq.type, oReq.url, oReq.data, oReq.callback, null, oReq.credentials, oReq.timeout, oReq.contentType);
			
			return this;
		},

		get :function(url, data, callback, type) {
			if(fSession.isFunction(data)) {
				callback = data;
				data = null;
			}
	
			return fSession.ajax({
				type: "GET",
				url: url,
				data: data,
				success: callback,
				contentType: type
			});
		},
	
		post :function(url, data, callback, type) {
			if(fSession.isFunction(data)) {
				callback = data;
				data = {};
			}
	
			return fSession.ajax({
				type: "POST",
				url: url,
				data: data,
				success: callback,
				contentType: type
			});
		}

	});
	
	fSession.stream ={
	
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
	
	fSession.record ={
	
		silenceThreshold :function(amount) {
		
			return amount;
		},
		
		silenceInterupt :function(amount) {
		
			return amount;
		}
	}
	
	fSession.file =function(directory) {
		
		return new File(directory);
	}
	
	fSession.constant('DTMF', 'dtmf', 'stream');
	
	fSession.constant('UNALLOCATED', 0, 'hangup');
	fSession.constant('SUCCESS', 1, 'hangup');
	fSession.constant('NO_ROUTE_TRANSIT_NET', 2, 'hangup');
	fSession.constant('NO_ROUTE_DESTINATION', 3, 'hangup');
	fSession.constant('CHANNEL_UNACCEPTABLE', 6, 'hangup');
	fSession.constant('CALL_AWARDED_DELIVERED', 7, 'hangup');
	fSession.constant('NORMAL_CLEARING', 16, 'hangup');
	
})();

// Dummy Sessions and Console objects so browser testing is possiable //
session = (typeof session !='undefined') ? session : {
	
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

Session = (typeof Session !='undefined') ? Session : function(diaplpan) {
	var i;
	var uuid = Math.random()*1024;
	this.session = {};
	
	for(i in session) {
		
		this.session[i] = session[i];
	}
	
	this.session.uuid = uuid;
	
	return this.session;
}