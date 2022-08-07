// A function to handle the upvote button
async function upvoteClickHandler(event) {
    event.preventDefault();
  
    // get the post id from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    // add a vote to the post with an async function
    // if the vote is successful, reload the page, showing the new vote, otherwise display the error
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
          post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
  }
  
  document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);