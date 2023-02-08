// Use block scope to suppress `has already been declared` error.
// FYI: https://stackoverflow.com/questions/41699451/snippets-identifier-has-already-been-declared
{
  const COMMENT_BUTTON_QUERY =
    ".review-thread-reply button.review-simple-reply-button,button.review-simply-reply-button";

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const COMMENT_ALL_BUTTON_ID = "commit_all_btn__created_by_extension";

  const addBtnIfAbsent = () => {
    if (document.getElementById(COMMENT_ALL_BUTTON_ID) === null) {
      const commentAllBtn = document.createElement("button");
      commentAllBtn.id = COMMENT_ALL_BUTTON_ID;
      commentAllBtn.type = "button";
      commentAllBtn.onclick = () => {
        document
          .querySelectorAll(COMMENT_BUTTON_QUERY)
          .forEach(async (value) => {
            if (!value.disabled) {
              value.click();
              await sleep(500);
            }
          });
      };
      commentAllBtn.innerText = "Comment All!!";
      commentAllBtn.setAttribute(
        "style",
        `
    position: fixed;
    right: 20px;
    bottom: 20px;
  `
      );
      commentAllBtn.classList.add("btn-primary", "btn");
      document.body.appendChild(commentAllBtn);
    }
  };

  const removeBtn = () => {
    const btnElement = document.getElementById(COMMENT_ALL_BUTTON_ID);
    if (btnElement !== null) {
      btnElement.remove();
    }
  };

  /** @returns {boolean} */
  const replyCommentExists = () => {
    let clickableCommentBtnCount = 0;
    document
      .querySelectorAll(COMMENT_BUTTON_QUERY)
      .forEach((value, key, parent) => {
        if (!value.disabled) {
          clickableCommentBtnCount++;
        }
      });
    return clickableCommentBtnCount > 0;
  };

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.attributeName === "disabled") {
        if (replyCommentExists()) {
          addBtnIfAbsent();
        } else {
          removeBtn();
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  document
    .querySelectorAll(COMMENT_BUTTON_QUERY)
    .forEach((value, key, parent) => {
      observer.observe(value, config);
    });
}
