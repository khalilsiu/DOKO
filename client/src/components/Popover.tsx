import { makeStyles } from '@material-ui/core';
import { Placement } from '@popperjs/core';
import { PropsWithChildren, useState } from 'react';
import { usePopper } from 'react-popper';

interface Props {
  reference: any;
  placement?: Placement;
}

let toggleTimeout: any;

const Popover = ({ children, reference, placement = 'bottom-start' }: PropsWithChildren<Props>) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 24] } }
      // {
      //   name: 'arrow',
      //   options: { element: arrowElement }
      // }
    ]
  });
  const [show, setShow] = useState(false);
  const classes = useStyles();

  const toggleShow = (shown: boolean) => {
    if (shown) {
      clearTimeout(toggleTimeout);
      setShow(true);
    } else {
      clearTimeout(toggleTimeout);
      toggleTimeout = setTimeout(() => setShow(false), 100);
    }
  };

  return (
    <div>
      <span
        ref={setReferenceElement}
        onMouseEnter={() => toggleShow(true)}
        onMouseLeave={() => toggleShow(false)}
      >
        {reference}
      </span>
      <div
        onMouseEnter={() => toggleShow(true)}
        onMouseLeave={() => toggleShow(false)}
        className={classes.container}
        ref={setPopperElement}
        style={{ ...styles.popper, visibility: show ? 'visible' : 'hidden', opacity: +show }}
        {...attributes.popper}
      >
        {children}
        {/* <div className={classes.arrow} ref={setArrowElement} style={styles.arrow} /> */}
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    transition: 'visibility 150ms linear, opacity 150ms linear',
    background: 'white',
    border: '1px solid #ececec',
    boxShadow: '-1px 0px 10px 7px rgb(0 0 0 / 4%)',
    borderRadius: 8,
    zIndex: 999
  },
  arrow: {
    width: 10,
    height: 10,
    borderRadius: 2,
    zIndex: -1,
    '&::before': {
      content: '""',
      transform: 'rotate(45deg)',
      background: 'white',
      width: 10,
      height: 10,
      borderRadius: 2,
      zIndex: -1,
      display: 'block'
    }
  }
}));

export default Popover;
