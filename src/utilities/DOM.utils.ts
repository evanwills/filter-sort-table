// ========================================================
// START: Pure JS equivalent to $(document).ready()

type FCallable = () => any

/**
 * List of callback functions to be executed once the page has
 * fully loaded.
 *
 * @var onLoadCallBacks
 */
const onLoadCallBacks : Array<FCallable> = [];

/**
 * Call a function only after the page has finished loading.
 *
 * @param {function} callBack Call back function to be executed once
 *                            the page has finished loading
 *
 * @returns {void}
 */
export const queueForReady = (callBack : FCallable) : void => {
  if (typeof callBack === 'function') {
    // see if DOM is already available
    if (
      document.readyState === 'complete' ||
      document.readyState === 'interactive'
    ) {
      // call on next available tick
      setTimeout(callBack, 1);
    } else {
      onLoadCallBacks.push(callBack);
    }
  } else {
    console.error(
      'queueForReady() expects only parameter to be a function. ' +
      'Found ' + typeof callBack
    )
  }
}

// Make sure we only start doing the real work when there's
// something to work on.
document.addEventListener('DOMContentLoaded', () : void => {
  let a = 0;
  while (onLoadCallBacks.length > 0) {
    const tmp : any = onLoadCallBacks.pop();

    try {
      tmp();
    } catch (error) {
      console.error(
        'onload callback (' + a + ') failed with error message: ' +
        '"' + error + '"'
      );
    }

    a += 1;
  }
});

 // START: Pure JS equivalent to $(document).ready()
 // ========================================================

 /**
  * Put one element after another
  *
  * (Pure Javascript equivalent of jQuery's `$().append()`)
  *
  * @param {DOMElement} newNode       Element to be placed
  * @param {DOMElement} referenceNode Element the new node is to be placed after
  *
  * @returns {void}
  */
export const insertAfter = (newNode : HTMLElement, referenceNode : HTMLElement) : boolean => {
  if (typeof newNode === 'undefined') {
    console.error('newNode is undefined. Maybe this ran too early.');
    return false;
  }
  if (typeof referenceNode === 'undefined') {
    console.error('Cannot place newNode after undefined node.');
    return false;
  }
  if (referenceNode.parentNode !== null) {
    referenceNode.parentNode.insertBefore(
      newNode,
      referenceNode.nextSibling
    );
    return true;
  } else {
    console.error(
      'referenceNode does not have a parent node, so cannot have ' +
      'siblings.'
    );
    return false;
  }
}
