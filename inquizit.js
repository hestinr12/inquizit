// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Presentations = new Meteor.Collection("presentations")
Questions = new Meteor.Collection("questions");

if (Meteor.isClient) {
  // Finds all presentations and sorts them in descending order
  Template.directory.presentations = function () {
    return Presentations.find({}, {sort: {_id: 1}});
  };

  Template.directory.questions = function () {
    return Questions.find({presentation:Session.get("selectedPresentation")}, {sort: {votes: -1}});
  };

  Template.directory.selectedPresentation = function () {
    var presentation = Presentations.findOne(Session.get("selectedPresentation"));
    return presentation && presentation.name;
  };

  Template.directory.events = {
    'click button.addPresentation': function () {
      var newPresentation = document.getElementById("newPresentationName").value;
      document.getElementById("newPresentationName").value = "";
      if(newPresentation !== ""){
        Presentations.insert({name: newPresentation});
      }
    },

    'click button.addQuestion': function () {
      var newQuestion = document.getElementById("newQuestionName").value;
      document.getElementById("newQuestionName").value = "";
      if(newQuestion !== ""){
        Questions.insert({
          presentation: Session.get("selectedPresentation"),
          question: newQuestion,
          votes: 1
        });

        var self = this;
        $('.addQuestion').attr('disabled','disabled');
        setTimeout(function() {
          var x = self.id;
          $('.addQuestion').removeAttr('disabled')
        }, 15000);
      }
    }
  };





  Template.presentation.selected = function () {
    return Session.equals("selectedPresentation", this._id) ? "selected" : '';
  };


  Template.presentation.events({
    'click': function () {
      Session.set("selectedPresentation", this._id);
    }
  });




  Template.question.events({
    'click button.upvote' : function () {
      //current = Questions.find({_id:this.});
      var self = this;
      Questions.update({_id:this._id}, {$inc: {votes: 1}});
      $('#' + this._id).attr('disabled', 'disabled');
      setTimeout(function() {
        var x = self._id;
        $('#' + x).removeAttr('disabled');
      }, 20000);
    }

  });




}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Presentations.remove({});
    Questions.remove({});
  });
}
