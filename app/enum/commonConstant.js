'use strict';
let searchObjectConstant = {
  "Profile":'profile',
  "Comments":'comments',
  "Tasks":'tasks',
  "Survey":"survey",
  "Quizes":"quizes",
  "Contest":"contest"
  };
function define(name, value) {
  Object.defineProperty(exports, name, {
      value:      value,
      enumerable: true
  });
}

define("searchUserCount", 7);

module.exports =
        Object.freeze(searchObjectConstant);