//import Vue from "Vue"
new Vue({
  el: '#app'
});

Vue.component('accordion',{
  props: ['theme', 'content'],
  template: `<div class="accordion" v-bind:class="theme">
    <div class="header" v-on:click="toggle">
      <slot name="header">レポート</slot>
      <i class="fa fa-2x fa-angle-down header-icon" v-bind:class="{rotate: show}"></i>
    </div>
    <transition
      v-on:before-enter="onBeforeEnter" v-on:enter="onEnter"
      v-on:before-leave="onBeforeLeave" v-on:leave="onLeave">
      <div class="body" v-show="show">
        <div class="body-inner" v-if="content === 'html'">
          html
        </div>
        <div class="body-inner" v-else>
          json
        </div>
      </div>
    </transition>
  </div>`,
  data: function(){
    return{
      show:false
    };
  },
  methods: {
    toggle: function(){
      this.show = !this.show;
    },
    onBeforeEnter: function(el){
      el.style.height = 0
    },
    onEnter: function(el){
      el.style.height = el.scrollHeight + 'px'
    },
    onBeforeLeave: function(el){
      el.style.height = el.scrollHeight + 'px'
    },
    onLeave: function(el){
      el.style.height = 0
    },
  }
});

