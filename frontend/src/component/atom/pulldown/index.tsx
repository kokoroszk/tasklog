import React, { useEffect, useRef, useState } from 'react';
import { ap, includes, equals, compose, toUpper } from 'ramda';

import SearchIcon from '@mui/icons-material/Search';

import { toRomajiNippon, toRomajiPassport } from 'utils/kuroshiro';
import { styler } from 'component/util/styler';

import styles from './index.module.scss';

export interface PulldownProps<T> {
  title?: string;
  options: Option<T>[];
  selected: T | undefined;
  updateFunction: (value: T | undefined) => void;
  with?: React.ReactElement;
  hasFilterInput?: boolean;
  hasClearButton?: boolean;
}

export interface Option<T> {
  label: string;
  value: T;
}

const useInput = () => {
  const [value, setValue] = useState('');
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    clear: () => setValue(''),
  };
};

const usePulldownEffects = () => {
  const [isOpen, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInput = useInput();

  // focus after the search box displays.
  const open = () => {
    setOpen(true);
    setTimeout(() => searchRef.current?.focus(), 10);
  };

  // `close` is expected to be called when the focus is removed from the search box.
  // but if the open button is clicked, the pull-down menu should remain open.
  const close = (e: React.FocusEvent) =>
    setTimeout(() => {
      const curr = document.activeElement;
      if ([buttonRef.current, searchRef.current].some(equals(curr))) return;
      setOpen(false);
      searchInput.clear();
    }, 20);

  return {
    isOpen,
    open,
    close,
    refs: { search: searchRef, button: buttonRef },
    searchInput,
  };
};

// enable romaji in incremental search.
// as a side effect, option data is romanized and saved.
// convert Japanese to romaji asynchronously.
type OptionWithMatcher = Option<any> & { matcher: string[] };
const useOptionData = (options: Option<any>[]) => {
  const [data, setData] = useState<OptionWithMatcher[]>(options.map((d) => ({ ...d, matcher: [d.label] })));
  useEffect(() => {
    Promise.all(options.map(toOptionWithMatcher)).then((data) => setData(data));
  }, [options]);

  return data;
};

const makeMatchers = ap([(s: string) => Promise.resolve(s), toRomajiPassport, toRomajiNippon]);
const toOptionWithMatcher = async (o: Option<any>) => ({
  ...o,
  matcher: (await Promise.all(makeMatchers([o.label]))).map(toUpper),
});

type Includes = (a: string) => (b: string) => boolean;
const filterOption = compose(includes as Includes, toUpper);

export const Pulldown = <T extends any>(props: PulldownProps<T>) => {
  const { isOpen, open, close, refs, searchInput } = usePulldownEffects();
  const allOptionData = useOptionData(props.options);

  const button = styler(styles.button);
  const options = styler(styles.options);
  const icon = styler(styles.icon);

  if (isOpen) {
    button.add(styles.open);
    options.add(styles.open);
    icon.add(styles.open);
  }

  icon.add(props.selected !== undefined && props.hasClearButton ? styles.clear : styles.triangle);
  const iconAction: React.MouseEventHandler = props.hasClearButton
    ? (e) => {
        e.stopPropagation();
        props.updateFunction(undefined);
      }
    : () => {};

  const selectedLabel = props.options.filter((d) => d.value === props.selected).map((d) => d.label)[0] || undefined;
  const optionData = allOptionData.filter((d) => d.matcher.some(filterOption(searchInput.value)));

  return (
    <div className={styles.pulldown}>
      {props.title && <div className={styles.label}>{props.title}</div>}
      <div className={styles.select}>
        <button className={button.build()} onClick={open} ref={refs.button} onBlur={close}>
          {selectedLabel}
          <div className={icon.build()} onClick={iconAction} />
        </button>
        {props.with}
        <div className={options.build()}>
          {props.hasFilterInput && (
            <div className={styles.searcharea}>
              <input
                className={styles.searchinput}
                ref={refs.search}
                onBlur={close}
                value={searchInput.value}
                onChange={searchInput.onChange}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') e.currentTarget.blur();
                }}
              />
              <SearchIcon className={styles.searchicon} />
            </div>
          )}
          <ul className={styles.items}>
            {optionData.map((d) => (
              <li
                onMouseDown={() => props.updateFunction(d.value)}
                key={d.value}
                className={d.value === props.selected ? styles.selected : ''}
              >
                {d.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
