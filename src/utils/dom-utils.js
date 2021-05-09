import { Utils } from './index';

const eleMethodsObjectName = 'gridCompMethods';
const inputFilterRegExpMapping = {
  integer: /^-?\d*$/,
  positiveInteger: /^\d*$/,
  floatNumber: /^-?\d*[.]?\d*$/,
};

export class DomUtils {
  static addClass($ele, className) {
    if (!$ele) {
      return;
    }

    className = className.split(' ');

    DomUtils.getElements($ele).forEach(($this) => {
      $this.classList.add(...className);
    });
  }

  static removeClass($ele, className) {
    if (!$ele) {
      return;
    }

    className = className.split(' ');

    DomUtils.getElements($ele).forEach(($this) => {
      $this.classList.remove(...className);
    });
  }

  static toggleClass($ele, className, isAdd) {
    if (!$ele) {
      return;
    }

    if (isAdd !== undefined) {
      isAdd = Boolean(isAdd);
    }

    let isAdded;

    DomUtils.getElements($ele).forEach(($this) => {
      isAdded = $this.classList.toggle(className, isAdd);
    });

    return isAdded;
  }

  static hasClass($ele, classNames) {
    if (!$ele) {
      return false;
    }

    classNames = classNames.split(' ');

    let result = classNames.every((className) => {
      return $ele.classList.contains(className);
    });

    return result;
  }

  static getData($ele, name, type) {
    if (!$ele) {
      return;
    }

    let value = $ele ? $ele.dataset[name] : '';

    if (type === 'number') {
      value = parseFloat(value) || 0;
    } else {
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }
    }

    return value;
  }

  static setData($ele, name, value) {
    if (!$ele) {
      return;
    }

    $ele.dataset[name] = value;
  }

  static setStyle($ele, name, value) {
    if (!$ele) {
      return;
    }

    $ele.style[name] = value;
  }

  static setInputValue($ele, value, silent) {
    if (!$ele) {
      return;
    }

    if (DomUtils.hasClass($ele, 'vscomp-ele')) {
      $ele.setValue(value, silent);
    } else if (DomUtils.hasClass($ele, 'grid-comp-checkbox')) {
      $ele.checked = value || false;
    } else {
      $ele.value = value;

      if (!silent) {
        DomUtils.dispatchEvent($ele, 'change');
      }
    }
  }

  static getInputValue($ele, trim) {
    if (!$ele) {
      return;
    }

    let value;

    if (DomUtils.hasClass($ele, 'grid-comp-checkbox')) {
      value = $ele.checked;
    } else {
      value = $ele.value;

      if (trim && typeof value === 'string') {
        value = value.trim();
      }
    }

    return value;
  }

  static getElement($ele) {
    if ($ele) {
      if (typeof $ele === 'string') {
        $ele = document.querySelector($ele);
      } else if ($ele.length !== undefined) {
        $ele = $ele[0];
      }
    }

    return $ele || null;
  }

  static getElements($ele) {
    if (!$ele) {
      return [];
    }

    if ($ele.forEach === undefined) {
      $ele = [$ele];
    }

    return $ele;
  }

  static focusEle($ele) {
    if (!$ele) {
      return;
    }

    if (DomUtils.hasClass($ele, 'vscomp-ele')) {
      $ele = $ele.querySelector('.vscomp-wrapper');
    }

    $ele.focus();
  }

  static isHidden($ele) {
    return !$ele || getComputedStyle($ele).display === 'none' ? true : false;
  }

  static reverse(array) {
    if (typeof array !== 'object') {
      return array;
    }

    let result = [];

    array.forEach((d) => {
      result.push(d);
    });

    return result.reverse();
  }

  /** element methods - start */
  static addMethod($ele, methodName, method) {
    if (!$ele || !method) {
      return;
    }

    $ele = DomUtils.getElements($ele);

    $ele.forEach(($this) => {
      Utils.objectDeepSet($this, `${eleMethodsObjectName}.${methodName}`, method);
    });
  }

  static executeMethod($ele, methodName, ...methodProps) {
    if (!$ele || !methodName) {
      return;
    }

    let method = Utils.objectDeepGet($ele, `${eleMethodsObjectName}.${methodName}`);

    if (typeof method === 'function') {
      method.call(null, ...methodProps, $ele);
    }
  }
  /** element methods - end */

  /** convert object to style attribute */
  static getStyleText(props, skipAttrName) {
    let result = '';

    for (let k in props) {
      result += `${k}: ${props[k]};`;
    }

    if (result && !skipAttrName) {
      result = `style="${result}"`;
    }

    return result;
  }

  /** convert object to dom attributes */
  static getAttributesText(data) {
    let html = '';

    if (!data) {
      return html;
    }

    for (let k in data) {
      let value = data[k];

      if (value !== undefined) {
        html += ` ${k}="${value}" `;
      }
    }

    return html;
  }

  static addEvent($ele, events, callback) {
    if (!$ele) {
      return;
    }

    events = Utils.removeArrayEmpty(events.split(' '));

    events.forEach((event) => {
      $ele = DomUtils.getElements($ele);

      $ele.forEach(($this) => {
        $this.addEventListener(event, callback);
      });
    });
  }

  static dispatchEvent($ele, eventName) {
    if (!$ele) {
      return;
    }

    $ele = DomUtils.getElements($ele);

    /** using setTimeout to trigger asynchronous event */
    setTimeout(() => {
      $ele.forEach(($this) => {
        $this.dispatchEvent(new Event(eventName, { bubbles: true }));
      });
    }, 0);
  }

  /** more shadow scroll - start */
  static initMoreShadowScroll($ele) {
    if (!$ele) {
      return;
    }

    DomUtils.addEvent($ele, 'scroll', DomUtils.onMoreShadowScroll);
    DomUtils.toggleMoreShadow($ele);
  }

  static onMoreShadowScroll(e) {
    DomUtils.toggleMoreShadow(e.target);
  }

  static toggleMoreShadow($ele) {
    if (!$ele) {
      return;
    }

    $ele = DomUtils.getElements($ele);

    $ele.forEach(($this) => {
      let $container = $this.closest('.grid-comp-more-shadow-container');
      let scrollHeight = $this.scrollHeight;
      let scrollTop = $this.scrollTop;
      let offsetHeight = $this.offsetHeight;
      let hasExtraItems = Math.round(offsetHeight) < Math.round(scrollHeight);
      let hasReachedTop = scrollTop ? false : true;
      let hasReachedBottom = Math.round(offsetHeight + scrollTop) >= Math.round(scrollHeight);

      DomUtils.toggleClass($container, 'has-top-content', hasExtraItems && !hasReachedTop);
      DomUtils.toggleClass($container, 'has-bottom-content', hasExtraItems && !hasReachedBottom);
    });
  }
  /** more shadow scroll - end */

  /** search component - start */
  static initSearchComp($ele) {
    if (!$ele) {
      return;
    }

    DomUtils.addEvent($ele.querySelector('.grid-comp-search-comp-input'), 'keyup change', DomUtils.onSearchCompInputChange);
  }

  static onSearchCompInputChange(e) {
    let $input = e.target;
    let $container = $input.closest('.grid-comp-search-comp-container');
    let $items = $container.querySelectorAll('.grid-comp-search-comp-item');
    let searchValue = $input.value.replace(/\\/g, '').toLowerCase().trim();
    let oldValue = DomUtils.getData($container, 'searchKeyword');

    if (!$items || oldValue === searchValue) {
      return;
    }

    let $moreShadowContent = $container.querySelector('.grid-comp-more-shadow-content');
    let itemsCount = $items.length;
    let hiddenItemsCount = 0;

    $items.forEach(($item) => {
      let isHidden = $item.innerText.toLowerCase().indexOf(searchValue) === -1;

      DomUtils.toggleClass($item, 'grid-comp-search-comp-hide', isHidden);

      if (isHidden) {
        hiddenItemsCount++;
      }
    });

    if ($moreShadowContent) {
      DomUtils.toggleMoreShadow($moreShadowContent);
    }

    DomUtils.toggleClass($container, 'has-no-result', itemsCount === hiddenItemsCount);
    DomUtils.setData($container, 'searchKeyword', searchValue);
  }
  /** search component - end */

  /** input clear component - start */
  static initInputClearComp($container) {
    if (!$container) {
      return;
    }

    DomUtils.addEvent($container.querySelectorAll('.grid-comp-input-clear-comp-input'), 'keyup change', DomUtils.onInputClearCompInputChange);
    DomUtils.addEvent($container.querySelectorAll('.grid-comp-input-clear-comp-clear'), 'click', DomUtils.onInputClearCompClearClick);
  }

  static onInputClearCompInputChange(e) {
    let $input = e.target;
    let $container = $input.closest('.grid-comp-input-clear-comp-container');

    if ($container) {
      DomUtils.toggleClass($container, 'has-value', $input.value);
    }
  }

  static onInputClearCompClearClick(e) {
    let $container = e.target.closest('.grid-comp-input-clear-comp-container');

    if ($container) {
      let $input = $container.querySelector('.grid-comp-input-clear-comp-input');

      DomUtils.setInputValue($input, '');
      DomUtils.focusEle($input);
    }
  }
  /** input clear component - end */

  /** accordion component - start */
  static initAccordionComp(options) {
    let $container = options.$container;

    if (!$container) {
      return;
    }

    let $sections = $container.querySelectorAll('.grid-comp-accordion-container');
    let $headers = $container.querySelectorAll('.grid-comp-accordion-header');

    DomUtils.addMethod($sections, 'afterAccordionOpen', options.afterOpen);
    DomUtils.addMethod($sections, 'afterAccordionClose', options.afterClose);
    DomUtils.addEvent($headers, 'click', DomUtils.onAccordionCompHeaderClick);
  }

  static onAccordionCompHeaderClick(e) {
    let $this = e.target;

    if (!$this.closest('.grid-comp-has-child-action')) {
      let $container = $this.closest('.grid-comp-accordion-container');
      let action = DomUtils.hasClass($container, 'active') ? 'close' : 'open';

      if (action === 'open') {
        DomUtils.addClass($container, 'active');
        DomUtils.executeMethod($container, 'afterAccordionOpen');
      } else {
        DomUtils.removeClass($container, 'active');
        DomUtils.executeMethod($container, 'afterAccordionClose');
      }
    }
  }

  static toggleAllAccordion($container) {
    let $sections = $container.querySelectorAll('.grid-comp-accordion-container');

    $sections.forEach(($section) => {
      if (DomUtils.hasClass($section, 'active')) {
        let $header = $section.querySelector('.grid-comp-accordion-header');

        DomUtils.dispatchEvent($header, 'click');
      }
    });
  }
  /** accordion component - end */

  /** input filter - start */
  static setInputFilter($ele) {
    if (!$ele) {
      return;
    }

    let onInputFilterChange = DomUtils.onInputFilterChange;

    DomUtils.getElements($ele).forEach(($this) => {
      DomUtils.addEvent($this, 'input keydown keyup mousedown mouseup select contextmenu drop', onInputFilterChange);
    });
  }

  static onInputFilterChange(e) {
    let isValid = DomUtils.validateInputFilter(e);

    if (isValid) {
      this.oldValue = this.value;
      this.oldSelectionStart = this.selectionStart;
      this.oldSelectionEnd = this.selectionEnd;
    } else if (this.hasOwnProperty('oldValue')) {
      this.value = this.oldValue;
      this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
    } else {
      this.value = '';
    }
  }

  static validateInputFilter(e) {
    let $ele = e.target;
    let value = $ele.value;
    let validationType = DomUtils.getData($ele, 'validationType');

    if (validationType === 'number') {
      if (DomUtils.getData($ele, 'validationAllowDecimal')) {
        validationType = 'floatNumber';
      } else {
        validationType = 'integer';
      }
    }

    let inputFilterRegExp = inputFilterRegExpMapping[validationType];
    let isValid = true;

    if (inputFilterRegExp) {
      isValid = inputFilterRegExp.test(value);
    }

    return isValid;
  }
  /** input filter - end */
}

window.GridCompDomUtils = DomUtils;
