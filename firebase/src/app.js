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
            <li v-for="list in lists">
              {{ list.report }}<button v-on:click="showResult(number)">結果表示</button>
            </li>

            <div class="list" id="list"></div>
            <div>レポート内容</div>
            <iframe ></iframe>
        </div>
        <div class="body-inner" v-else>
          <div class="domain-list">集計結果を確認<button v-on:click="showOutput">表示</button></div>
          <li v-for="list in outputs">
            {{ list }}
          </li>
        </div>
      </div>
    </transition>
  </div>`,
  data: function(){
    return{
      show:false,
      lists:[],
      paths:[],
      outputs:[],
      url:null
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
      var i=0;
      var j=0;
      //firebase DBからリスト取得
      //var list = document.getElementById('list');
      database.ref('html').once('value').then((snapshot) => {
        var json_data = snapshot.val();
        for(var item in json_data){
          for(var subItem in json_data[item]){
            //console.log(subItem);
            if (typeof json_data[item][subItem] === 'object') {
              for (var sub2Item in json_data[item][subItem]) {
                  //console.log(item + ': ' + subItem + ': ' + sub2Item + ': ' + json_data[item][subItem][sub2Item]);
                  //console.log(sub2Item);
                  //console.log(json_data[item][subItem][sub2Item]);
                  //html_report[subItem]=json_data[item][subItem][sub2Item];
                  //console.log(html_report);

                  if (sub2Item == 'report'){
                    //console.log(html_report);
                    //lists = {sub2Item: json_data[item][subItem][sub2Item]};
                    //this.lists.push({report:'a'});
                    var repo= "report["+i+"]";
                    this.lists.push({report: json_data[item][subItem][sub2Item]});
                    console.log(i);
                    i = i+1;
                  }else if (sub2Item == 'path'){
                    //html_path[sub2Item] = json_data[item][subItem][sub2Item];
                    //this.lists.push({path:json_data[item][subItem][sub2Item]});
                    var pa = "path["+j+"]";
                    this.paths.push({path: json_data[item][subItem][sub2Item]});
                    //console.log(html_path);
                    j = j+1;
                  }else {
                    //console.log(json_data[item][subItem][sub2Item]);
                    console.log('here!');
                  }
              }
            }
          }
        }
        this.lists.push({report:'success!!!'});
      });
    },
    showResult: function(number){
      var pathRef = storage.ref(this.paths.path[number]);
      console.log(pathRef);
    },
    showOutput: function(){
      database.ref('json').once('value').then((snapshot) => {
        var json_data = snapshot.val();
        for(var item in json_data){
          for(var subItem in json_data[item]){
            if (typeof json_data[item][subItem] === 'object') {
              for (var sub2Item in json_data[item][subItem]) {
                  if (sub2Item == 'date'){
                    this.outputs.push({date: json_data[item][subItem][sub2Item]});
                  }else if (sub2Item == 'first_meaningful_paint'){
                    this.outputs.push({first_meaningful_paint: json_data[item][subItem][sub2Item]});
                  }else if (sub2Item == 'first_meaningful_paint_value'){
                    this.outputs.push({first_meaningful_paint_value: json_data[item][subItem][sub2Item]});
                  }else if (sub2Item == 'speed_index'){
                    this.outputs.push({speed_index: json_data[item][subItem][sub2Item]});
                  }else if (sub2Item == 'speed_index_value'){
                    this.outputs.push({speed_index_value: json_data[item][subItem][sub2Item]});
                  }else {
                    console.log('here!');
                  }
              }
            }
          }
        }
        this.lists.push({report:'success!!!'});
      });
    }
  }
});

