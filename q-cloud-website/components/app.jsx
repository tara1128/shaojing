/*
  components/app.jsx
*/

var React = require('react');

var App = React.createClass({

  getInitialState: function() {
    return {
      title: 'TTTitle'
    }  
  },

  changeSearch: function(e) {
  },

  render: function() {
    return (
      <div className="component">
        <span>You are searching for: {this.state.title}</span>
      </div>
    )
  }

});

module.exports = App;
