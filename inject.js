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

  // Main Observer
  const commentButtonChangedCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.attributeName === "disabled") {
        if (replyCommentExists()) {
          addBtn();
        } else {
          removeBtn();
        }
      }
    }
  };

  const commentButtonChangedObserver = new MutationObserver(
    commentButtonChangedCallback
  );

  // Update function
  const observeUpdate = () => {
    commentButtonChangedObserver.disconnect();
    document
      .querySelectorAll(COMMENT_BUTTON_QUERY)
      .forEach((value, key, parent) => {
        commentButtonChangedObserver.observe(value, { attributes: true });
      });
  };
  observeUpdate();

  // Update observer when
  // 1. open/close resolved conversation panel
  // 2. fetch more ...

  // 1.
  const showResolvedPanelCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      console.log("fetchResolvedPanel");
      observeUpdate();
    }
  };
  const showResolvedPanelObserver = new MutationObserver(
    showResolvedPanelCallback
  );
  document
    .querySelectorAll(
      '.TimelineItem-body.my-0 turbo-frame > details > div[data-view-component="true"]'
    )
    .forEach((value, key, parent) => {
      showResolvedPanelObserver.observe(value, {
        childList: true,
      });
    });

  // 2.
  const doneFetchMoreCallback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      console.log("doneFetchMore");
      observeUpdate();
    }
  };
  const doneFetchMoreObserver = new MutationObserver(doneFetchMoreCallback);
  document
    .querySelectorAll(".TimelineItem-body.my-0")
    .forEach((value, key, parent) => {
      if (value.firstElementChild.tagName === "turbo-frame".toUpperCase()) {
        doneFetchMoreObserver.observe(value, { childList: true });
      }
    });
}
