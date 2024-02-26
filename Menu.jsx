import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled, { css } from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);

  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  ${(props) => {
    if (props.$position.toLowerCase() == "bottom-left")
      return css`
        right: 32px;
        bottom: -${props.$height}px;
      `;
    else if (props.$position.toLowerCase() == "top-left")
      return css`
        right: 32px;
        top: -${props.$height}px;
      `;
  }}
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenuContext = createContext({
  id: null,
  isOpen: null,
  setIsOpen: () => undefined,
});
function Menu({ id, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ id, isOpen, setIsOpen }}>
      <StyledMenu data-contain={id}>{children}</StyledMenu>
    </MenuContext.Provider>
  );
}
function Toggle({ disabled = false }) {
  const { setIsOpen, id } = useContext(MenuContext);
  function handleClick() {
    setIsOpen((open) => !open);
  }
  return (
    <StyledToggle
      onClick={(e) => handleClick(e)}
      data-close={id}
      disabled={disabled}
    >
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ children, position }) {
  const { isOpen, setIsOpen, id } = useContext(MenuContext);
  const [height, setHeight] = useState(0);
  const handleClose = (e) => {
    // if I set directly the open state to false and it's open
    // then the toggle handler will keep it open so here check if the clicked
    // the toggler it's handler will take care of this part
    // that's also why the useOutsideClick hook pass the event to
    // the handler that you pass to it
    e.target.closest("button")?.dataset?.close != id && setIsOpen(false);
  };
  const ref = useOutsideClick(handleClose);
  // because the nature of this hook
  // (runs before the element get painted on the screen)
  useLayoutEffect(() => {
    if (document.querySelector(`[data-list='${id}']`))
      setHeight(document.querySelector(`[data-list='${id}']`).clientHeight);
  }, [isOpen, id]);
  return isOpen
    ? createPortal(
        <StyledList
          ref={ref}
          $position={position}
          $height={height}
          data-list={id}
        >
          {children}
        </StyledList>,
        document.querySelector(`div[data-contain='${id}']`)
      )
    : null;
}

function Button({ children, icon, onClick }) {
  const { setIsOpen } = useContext(MenuContext);
  // const data = useContext(MenuContext);
  function handleClick() {
    setIsOpen(false);
    onClick?.();
    // data.setIsOpen(false);
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon !== undefined && icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}
Menu.Toggle = Toggle;
Menu.List = List;
Menu.Button = Button;
export default Menu;
