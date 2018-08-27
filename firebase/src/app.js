//import Vue from "vue"
import firebase from "firebase";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAPU0mhCLENMKPf-Hvqp5oX2emD1foll0c",
  authDomain: "lighthouse-inspection.firebaseapp.com",
  databaseURL: "https://lighthouse-inspection.firebaseio.com",
  projectId: "lighthouse-inspection",
  storageBucket: "lighthouse-inspection.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();
var storage = firebase.storage();

document.addEventListener("DOMContentLoaded", function(event) {
  new Vue({
    el: '#app'
  });
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
          <div class="domain-list">リストを表示する<button v-on:click="showList">表示</button></div>
            <div class="list" id="list"></div>
            <div>レポート内容</div>
            <iframe></iframe>
        </div>
        <div class="body-inner" v-else>
          <p> 集計結果を確認 </p>
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
    showList: function(){
      //firebase DBからリスト取得
      var list = document.getElementById('list');
      database.ref('html').once('value').then(function(snapshot){
        console.log(snapshot.val());
      });
      var name = ['abc','def','hij'];
      for (var i = name.length - 1; i >= 0; i--) {
        list.insertAdjacentHTML('afterbegin','<li>'+name[i]+'</li>');
      }

    }
  }
});

