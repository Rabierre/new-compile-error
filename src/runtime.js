(function(exports) {
  "use strict";

  var RuntimeContext, Stack, NewRuntimeError;

  NewRuntimeError = require('./error').NewRuntimeError;

  Stack = function Stack() {
    this.$ = [];
    this.top = 0;
  };

  Stack.prototype.push = function(value) {
    this.$[this.top++] = value;
  };

  Stack.prototype.pop = function() {
    return this.$[--this.top];
  };

  Stack.prototype.set = function(index, value) {
    this.$[index] = value;
  };

  Stack.prototype.get = function(index) {
    return this.$[index];
  };

  RuntimeContext = function RuntimeContext() {
    this.stack = new Stack();
    this.frameBase = 0;
    this.functions = {};
  };

  RuntimeContext.prototype.getValue = function(decl) {
    return this.stack.get(this.frameBase + decl.$index);
  };

  RuntimeContext.prototype.setValue = function(decl, value) {
    this.stack.set(this.frameBase + decl.$index, value);
  };

  RuntimeContext.prototype.setReturn = function(value) {
    this.returnValue = value;
  };

  RuntimeContext.prototype.getReturn = function() {
    return this.returnValue;
  };

  RuntimeContext.prototype.pushFrame = function(decl) {
    this.decl = decl;
    this.stack.push(this.frameBase);
    this.frameBase = this.stack.top;
    this.stack.top += this.decl.$symbolSize;
  };

  RuntimeContext.prototype.popFrame = function() {
    this.stack.top -= this.decl.$symbolSize;
    this.frameBase = this.stack.pop();
  };

  RuntimeContext.prototype.addFunction = function(id, decl) {
    this.functions[id.value || id] = decl;
  };

  RuntimeContext.prototype.getFunction = function(id) {
    return this.functions[id.value || id];
  };

  exports.Runtime = function Runtime(ast) {
    try {
      ast.execute(new RuntimeContext());
    } catch (e) {
      if (e instanceof NewRuntimeError) {
        console.error(e.message);
        console.error(e.toString());
      } else {
        console.error(e);
      }
    }
  };
})((module || {exports: {}}).exports);
