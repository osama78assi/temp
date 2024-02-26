import { createContext, useContext, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Menu from "./Menu";
import { useMediaQueryEffect } from "../hooks/useMediaQueryEffect";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const StyledFilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
  @media (max-width: 600px) {
    & {
      width: 100%;
      margin: 0.1rem 0rem;
    }
  }
`;

const FilterContext = createContext();
function Filter({ filterFor, children }) {
  const [toggle, setToggle] = useState(false);
  const onMatch = () => {
    setToggle(true);
  };
  const onNotMatch = () => {
    setToggle(false);
  };
  useMediaQueryEffect(600, onMatch, onNotMatch);
  return (
    <FilterContext.Provider value={{ filterFor }}>
      {!toggle ? (
        <StyledFilter>{children}</StyledFilter>
      ) : (
        <Menu id={"filter"}>
          <Menu.Toggle />
          <Menu.List position="bottom-left">{children}</Menu.List>
        </Menu>
      )}
    </FilterContext.Provider>
  );
}
function FilterButton({ filter, children }) {
  const { filterFor } = useContext(FilterContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggle, setToggle] = useState(false);
  const onMatch = () => {
    setToggle(true);
  };
  const onNotMatch = () => {
    setToggle(false);
  };
  useMediaQueryEffect(600, onMatch, onNotMatch);
  function handleFilter(filter) {
    searchParams.set(filterFor, filter);
    setSearchParams(searchParams);
  }
  return !toggle ? (
    <StyledFilterButton onClick={() => handleFilter(filter)}>
      {children}
    </StyledFilterButton>
  ) : (
    <Menu.Button onClick={() => handleFilter(filter)}>{children}</Menu.Button>
  );
}
Filter.FilterButton = FilterButton;
export default Filter;
