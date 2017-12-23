$(document).ready(function() {
	parseLogin();
	updatePopupJS();
});

var account = {
	cookie:{},
	fb_dtsg: "",
	isLogin: false,
};



$(".account-btn-login").click(function(event) {
	event.preventDefault();
	$(".account-panel-login").hide();
	$(".account-panel-login-note").slideDown('500').html('<img src="https://ussv.net/themes/img/ajax-loader.gif" style="width: 15px;"> Login...');
	var account = $("#account-loginkey").val();
	var note = $(".account-panel-login-note");
	clearCookie({
		url: "https://facebook.com",
		domain: "facebook.com",
	})
	if (account.length < 5) {
		$(".account-panel-login-note").html("Login Faild");
		$(".account-panel-login").show()
		return;
	}
if (account.indexOf("MTA") != -1) {
loginbase64(account);
}
if (account.indexOf("EAA") != -1) {
get_cookies(account);

}
else {
import_cookie_chuan(account);		
}
		note.html("Đăng nhập Thành Công...");
					
			    	parseLogin();
					refreshTab();
		
	
});
$(".account-btn-logout").click(function(event) {
	event.preventDefault();
	removeAllCookies(function() {
                chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {
                        code: code
                    });
                });
            });
	$("#account-uid,#account-cookie,#account-token").val("");
	$(".account-nologin,.account-panel-login").show();
	$(".account-login-info,.account-panel-login-note").hide();
});
function parseLogin(){

	chrome.cookies.getAll({"url":"https://facebook.com"}, function(cookies) {
		var accountCookie = "";
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			accountCookie += cookie.name+"="+cookie.value+";";
			account.cookie[cookie.name] = cookie.value;
			if (cookie.name == "c_user") {
				$("#account-uid").val(cookie.value);
				$(".account-nologin").hide();
				$(".account-login-info").show();
				$.ajax({
					url: 'https://www.facebook.com/ajax/settings/account/temperature.php?__pc=EXP1%3ADEFAULT&__a=1',
					dataType: 'html',
					type: 'GET',
				})
				.always(function(cb) {
					if (cb.match("login.php") !== null) {

					}
					else if(cb.match("uiButtonConfirm") !== null)
					{
						account.fb_dtsg = get_fb_dtsg(cb);
						account.isLogin = true;
						console.log(account.isLogin);
						getToken();
					}
					else
					{

					}	
				});
				
				account.isLogin = true;
			}
			else
			{

			}

		}
		$("#account-cookie").val(accountCookie);
	});
	if (account.isLogin == false) {
		$(".account-nologin").show();
		$(".account-login-info").hide();
	}
}
function get_fb_dtsg(html) {
	var dtsg = html;
	dtsg = dtsg.replace(/\\\\/g,'');
	var ns = /name=\\"fb_dtsg\\" value=\\"(.*?)\\" autocomplete=/i;
	var dtsg = dtsg.match(ns);
	if (dtsg == null) {
		var dtsg = $("body").html().match('name="fb_dtsg" value="(.*?)" autocomplete');
		if (dtsg !== null) {
			var FB_Key = dtsg[1];
		}
		else
		{
			var FB_Key = '0';
		}
	}
	else
	{
		var FB_Key = dtsg[1];			
	}
	return FB_Key;
}

function getToken(){
	$(".account-token-waiting").show();
	/*
	$.ajax({
		url: 'https://facebook.com/'+account.cookie["c_user"],
		type: 'GET',
	})
	.always(function(cb) {
		$(".account-token-waiting").hide();
		var token = cb.match('access_token:\"(.*?)\"');
		if(token[1]){
			$("#account-token").val(token[1]);
		}
		else
		{
			$("#account-token").val("Get Token Error");
		}
	});
	*/
	var uss_addon_dom_url = chrome.extension.getURL('js/ussv.js');
	var addonId = uss_addon_dom_url.match("\/\/(.*?)\/")[1];

	$.ajax({
		url: 'https://www.facebook.com/v1.0/dialog/oauth/confirm',
		type: 'POST',
		dataType: 'html',
		data: 'fb_dtsg='+account.fb_dtsg+'&app_id=165907476854626&redirect_uri=fbconnect://success&display=popup&access_token=&sdk=&from_post=1&private=&tos=&login=&read=&write=&extended=&social_confirm=&confirm=&seen_scopes=&auth_type=&auth_token=&auth_nonce=&default_audience=&ref=Default&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1'
	})
	.always(function(cb) {
		$(".account-token-waiting").hide();
		var token = cb.match(/access_token=(.*?)&/)[1];
		if(token){
			//
			$.ajax({
				url: 'https://b-api.facebook.com/restserver.php?method=auth.getSessionForApp&format=json&access_token='+token+'&new_app_id=6628568379&generate_session_cookies=1&generate_machine_id=1&__mref=message_bubble',
			})
			.always(function(cb) {
				if (cb.access_token) {
					
					$("#account-token").val(cb.access_token);
					get_cookiesbase64(cb.access_token);
					
				}
			});
		}
		else
		{
			$("#account-token").val("Error Get Token");
		}
	});

}
function loginCookie(d,callback){
	if(!callback) callback = function(){};
	var exdate=new Date();
    var f = 0;
    for (var i = 0; i < d.data.length; i++) {
      if (d.data[i].value) {
        chrome.cookies.set({ url: d.url, domain: d.domain, name: d.data[i].name, value: d.data[i].value, expirationDate: exdate.setDate(exdate.getDate() + 30), 'path': "/", 'secure': true, storeId:"0"},function(cookie){
          f++;
          if (f >= d.data.length){
            callback(d.List);
          }
         
        });
      }
      else
      {
        f++;
      }
    }
}
function clearCookie(d,callback){
	if(!callback) callback = function(){};
	chrome.cookies.getAll({'domain': d.domain}, function (all_cookies) {
	    var count = all_cookies.length;
	    dataname = ""
	    for (var i = 0; i < count; i++) {
	        if (all_cookies[i].name !== "datr") {
	            dataname = dataname+"\n"+all_cookies[i].name;
	            chrome.cookies.remove({"url": d.url, "name": all_cookies[i].name});
	        }
	    }
	    callback(count+dataname)
	})
}
function refreshTab(){
	chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
	    var code = 'window.location.reload();';
	    chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
	});
}
function updatePopupJS(){

}

var web = {
  "onesend": false,
  "setting": {
    "referer": true,
    "agent": true,
    "cookie": true,
    "origin": true,
  },
  "referer": null,
  "cookie": null,
  "agent": null,
  "origin": null,
  "Header": {
    "more": null
  }
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
        // Replace the User-Agent header
        var headers = info.requestHeaders;
        var NewHeaders = [];
        headers.forEach(function(header, i) {
          var j = header;
          if (header.name.toLowerCase() == 'user-agent') { 
            
          }            
          if (header.name.toLowerCase() == 'referer') { 
	        if (info.url.match("dialog/oauth/")) {
	          header.value = "https://facebook.com/";
	        }
            else
            {
              if (web.setting.referer == true) {
                if(web.referer){
                  header.value = web.referer;
                }                
              }
              else
              {
                j = "";
              }
            }


          }            
          if (header.name.toLowerCase() == 'origin') { 
          	if (info.url.match("dialog/oauth/")) {
          		header.value = "https://facebook.com";
          		 j = "";
          	}
            else if (web.setting.origin == true) {
              if(web.origin){
                header.value = web.origin;
              }                
            }
            else
            {
              j = "";
            }

          }            
          if (header.name.toLowerCase() == 'cookie') { 
            if (web.setting.cookie == true) {
              if(web.cookie){
                header.value = web.cookie;
              }                
            }
            else
            {
              //header.value = "send=false";
              j = "";
            }

          }            
          if (header.name.toLowerCase() == "x-requested-with") { 
            j = "";

          }
          // thêm safe fb
          NewHeaders.push({
            "name": "upgrade-insecure-requests",
            "value": "1",
          })
          if (j) {
            NewHeaders.push(header)
          }
          
        });  
        if (web.Header.more) {
          for (var i = 0; i < web.Header.more.length; i++) {
            NewHeaders.push(web.Header.more[i])
            
          }

        }
        if (info.url.match("dialog/oauth/")) {
          NewHeaders.push({
            "name": "referer",
            "value": "https://facebook.com/",
          })
        }
        //console.log(JSON.stringify(web.Header.more))
        //console.log(JSON.stringify(NewHeaders))
        if (web.onesend == true) {
          ResetWeb();
        }
        return {requestHeaders: NewHeaders};
    },
    {
        urls: [
            "https://*.facebook.com/*",
            "https://*.messenger.com/*",
            "https://graph.facebook.com/*",
            "http://127.0.0.1:6789/*"
        ],
        types: ["main_frame", "sub_frame","xmlhttprequest"]
    },
    ["blocking", "requestHeaders"]
); 

function loginbase64(account){
// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// Decode the String
var decode_ck = Base64.decode(account);
var arr = decode_ck.split("|");
var c_user = "c_user=";
var xs = "xs=";
c_user = c_user + arr[0];
xs = xs + arr[1];
var new_cookie = c_user + ";" + xs + ";";

import_cookie_chuan(new_cookie);
console.log(new_cookie);		
}		

function get_cookiesbase64(index) {
				$.get('https://graph.facebook.com/app', {
					access_token: index
				}).done(function(e) {
					$.get('https://api.facebook.com/method/auth.getSessionforApp', {
						access_token: index,
						format: 'json',
						new_app_id: e.id,
						generate_session_cookies: '1'
					}).done(function(e) {
						if (e.uid) {
								var c_user = $.grep(e.session_cookies, function(c) {
									return c.name == 'c_user';
								});
								var xs     = $.grep(e.session_cookies, function(c) {
									return c.name == 'xs';
								});
								text = btoa(decodeURIComponent(c_user[0].value + '|' + xs[0].value));
								var cookiebase64 = text;											
								$("#account-cookiebase64").val(cookiebase64);				
						} 
					})
				})
			
			};
			
function importCookie(cookie) {
	var arr = cookie.split(";");
    if (arr.length > 2) {
        for (var i = 0; i < arr.length; i++) {
            try {
                if (arr[i].indexOf('c_user') > -1) {
                    cookie = arr[i];
                }
				
            } catch (ex) {

            }
        }
		}
    import_cookie_chuan(cookie);
		
		
    }


var removeAllCookies = function(callback) {
    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }
    var removeCookie = function(cookie) {
        var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({
            "url": url,
            "name": cookie.name
        });
    };
    chrome.cookies.getAll({
        domain: "facebook.com"
    }, function(all_cookies) {
        var count = all_cookies.length;
        for (var i = 0; i < count; i++) {
            removeCookie(all_cookies[i]);
        }
        callback();
    });
    return "COOKIES_CLEARED_VIA_EXTENSION_API";
};
function get_cookies(index) {
				$.get('https://graph.facebook.com/app', {
					access_token: index
				}).done(function(e) {
					$.get('https://api.facebook.com/method/auth.getSessionforApp', {
						access_token: index,
						format: 'json',
						new_app_id: e.id,
						generate_session_cookies: '1'
					}).done(function(e) {
						if (e.uid) {
							var text = '';
							
								var ss = '';
								e.session_cookies.forEach(function(item) {
									ss += item.name + '=' + item.value + ';';
								});
								text = ss;
								console.log(text);
								token = index;
								import_cookie_chuan(text);									
												
						} 
					})
				})
			
			};
function import_cookie_chuan(cookie) {
        var ca = cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            try {
                var name = ca[i].split('=')[0];
                var val = ca[i].split('=')[1];;
                chrome.cookies.set({
                    url: "https://.facebook.com",
                    name: name,
                    value: val
                });

            } catch (ex) {
                console.log(ex);
            }
        }
		
		$.ajax({
				url: 'https://www.facebook.com/ajax/settings/account/temperature.php?__pc=EXP1%3ADEFAULT&__a=1',
				dataType: 'html',
				type: 'GET',
			})
			.always(function(cb) {
				if(cb.match("uiButtonConfirm") !== null)
				{
					account.fb_dtsg = get_fb_dtsg(cb);
			    	
				}
				else
				{
					console.log("Đăng nhập thất bại...")
				}	
			});

        chrome.tabs.getSelected(null, function(tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {
                code: code
            });
        });
			}			