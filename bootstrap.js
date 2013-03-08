/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Components.utils.import("resource:///modules/imServices.jsm");

var originalAddConversationFunction;

function replaceNicks(aString) {
    var replacements = {
        "First Last": "@FirstLast"
    };

    for(var replacement in replacements) {
        if(!replacements.hasOwnProperty(replacement)) continue;

        aString = aString.replace(replacement, replacements[replacement]);
    }

    return aString;
}

function startup (data, reason) {
  let cs = Services.conversations.wrappedJSObject;
  originalAddConversationFunction = cs.addConversation;
  cs.addConversation = function (aPurpleConversation) {
    let wrapper = {
      __proto__: aPurpleConversation,
      _conv: aPurpleConversation,
      sendMsg: function(aMsg) {
        if(this._conv.account.name.indexOf("chat.hipchat.com") != -1) {
            //Components.utils.reportError("Yes");
            aMsg = replaceNicks(aMsg);
        }

        this._conv.sendMsg(aMsg);
      }
    };
    originalAddConversationFunction.call(cs, wrapper);
  };
}
function shutdown (data, reason) {
  let cs = Services.conversations.wrappedJSObject;
  cs.addConversation = originalAddConversationFunction;
}
