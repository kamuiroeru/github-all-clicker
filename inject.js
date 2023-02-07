if (observer != null) {
  observer.disconnect();
}

// Create an observer instance linked to the callback function
observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
document
  .querySelectorAll(COMMENT_BUTTON_QUERY)
  .forEach((value, key, parent) => {
    observer.observe(value, config);
  });
