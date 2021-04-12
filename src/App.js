import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import CommentsList from './components/CommentsList';
import loader from './loading.gif';

class App extends Component {
  state = {
    stories: [],
    isLoading: true,
    isError: false
  }
  getComments = (top10Stories) => {
    let finalStories = [];
    let top20CommentIds = [];
    top10Stories.forEach((story, index) => {
      top20CommentIds = story.data.kids.slice(0, 20);
      //top20CommentIds = story.data.kids.slice(0, 2);
      let commentPromises = [];
      top20CommentIds.forEach(commentId => {
        commentPromises.push(axios.get('https://hacker-news.firebaseio.com/v0/item/' + commentId + '.json?print=pretty'));
      });
      Promise.all(commentPromises).then(commentsResponse => {
        let top20Comments = [];
        commentsResponse.forEach(eachComment => {
          top20Comments.push(eachComment.data.text);
        });
        let storyDetails = {};
        storyDetails.id = story.data.id;
        storyDetails.title = story.data.title;
        storyDetails.score = story.data.score;
        storyDetails.comments = top20Comments;

        finalStories[index] = storyDetails;
        if (index === top10Stories.length - 1) {
          console.log("finalStories ", finalStories);
          this.setState({ isError: false, isLoading: false });
          this.setState({ stories: finalStories });
        }
      }).catch(error => {
        console.log("Error", error.message);
        this.setState({ isError: true, isLoading: false });
      });

    });

  }
  componentDidMount() {
    let baseURL = "https://hacker-news.firebaseio.com/v0";
    axios.get(baseURL + '/topstories.json?print=prettyn').then(storiesResponse => {
      let storiesIDs = storiesResponse.data;
      let promises = [];
      storiesIDs.forEach(storyID => {
        promises.push(axios.get(baseURL + '/item/' + storyID + '.json?print=pretty'));
      });
      // for (let i = 0; i < storiesIDs.length - 480; i++) {
      //   promises.push(axios.get(baseURL + '/item/' + storiesIDs[i] + '.json?print=pretty'));
      // }

      Promise.all(promises).then(storiesResponse => {
        let sortedStories = storiesResponse.sort((a, b) => {
          return b.data.score - a.data.score;
        });

        let top10Stories = sortedStories.slice(0, 10);
        console.log("top10Stories ", top10Stories);
        this.getComments(top10Stories);
      }).catch(error => {
        console.log("Error", error.message);
        this.setState({ isError: true, isLoading: false });
      });;
    }).catch(error => {
      console.log("Error", error.message);
      this.setState({ isError: true, isLoading: false });
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p> Hacker New - Posts and Comments </p>
        </header>
        <div className="row">
          <div className="Posts">
            {this.state.isLoading ? (
              <div className="alert text-center alert-info">
                <img src={loader} alt="logo" />
              </div>
            ) : null}
            {this.state.stories.map((story, index) => (
              <div className="card" key={index}>
                <h5 className="card-header bg-primary text-left">
                  Story #{index + 1} (score - {story.score})- {story.title}
                </h5>
                <div className="card-body">
                  <CommentsList key={index} comments={story.comments} />
                </div><br></br>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
