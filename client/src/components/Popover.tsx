import { Placement } from '@popperjs/core';
import { PropsWithChildren, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

interface Props {
  reference: any;
  placement?: Placement;
  style?: any;
}

const Arrow = styled.div`
  width: 0.6rem;
  height: 0.6rem;

  &::before {
    content: '';
    background: white;
    width: 0.6rem;
    height: 0.6rem;
    transform: translate(-50%, -50%) rotate(45deg);
    position: absolute;
    border-radius: 2px;
    top: 0;
    left: 0;
  }
`;

const Wrapper = styled.div`
  transition: visibility 150ms linear, opacity 150ms linear;
  background: white;
  border: 1px solid #ececec;
  box-shadow: -1px 0px 10px 7px rgb(0 0 0 / 4%);
  border-radius: 8px;
  z-index: 999;

  &[data-popper-placement^='right'] {
    ${Arrow} {
      left: 0px;
    }
  }

  &[data-popper-placement^='left'] {
    ${Arrow} {
      right: 0px;
    }
  }

  &[data-popper-placement^='top'] {
    ${Arrow} {
      bottom: 0px;
    }
  }

  &[data-popper-placement^='bottom'] {
    ${Arrow} {
      top: 0px;
    }
  }
`;

export const Popover = ({
  children,
  reference,
  placement = 'bottom-start',
  style,
}: PropsWithChildren<Props>) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [arrowElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 24] } },
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
    ],
  });
  const [show, setShow] = useState(false);
  const [toggleTimeout, setToggleTimeout] = useState<any>();

  const toggleShow = (shown: boolean) => {
    if (shown) {
      clearTimeout(toggleTimeout);
      setShow(true);
    } else {
      clearTimeout(toggleTimeout);
      setToggleTimeout(setTimeout(() => setShow(false), 200));
    }
  };

  return (
    <div style={style}>
      <span
        ref={setReferenceElement}
        onMouseEnter={() => toggleShow(true)}
        onMouseLeave={() => toggleShow(false)}
      >
        {reference}
      </span>
      <Wrapper
        onMouseEnter={() => toggleShow(true)}
        onMouseLeave={() => toggleShow(false)}
        ref={setPopperElement}
        style={{ ...styles.popper, visibility: show ? 'visible' : 'hidden', opacity: +show }}
        {...attributes.popper}
      >
        {children}
      </Wrapper>
    </div>
  );
};

export default Popover;
