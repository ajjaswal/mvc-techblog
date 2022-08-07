// comment form handler
async function commentFormHandler(event) {
    event.preventDefault();

    // get the comment text from the form
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    
    // get the post id from the url, just as for the upvote.js function
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    // if there is comment text, submit the comment to the API route and reload the page to show the comment
    if (comment_text) {
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
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
  }
  
  document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);