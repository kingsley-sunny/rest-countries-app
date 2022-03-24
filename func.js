class Html {
  htmlDom(selector, event = { eventName: name, eventHandler: eventFunction }) {
    if (selector) {
      selector.addEventListener(event.eventName, (e) => {
        event.eventHandler(e);
      });
    }
  }
}
