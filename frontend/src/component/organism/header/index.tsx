import React, { useState } from 'react';

import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';

import { Project } from 'domain/project';

import { styler } from 'component/util/styler';
import { MyTooltip } from 'component/util/my-tooltip';

import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { useSignOutFunction } from 'usecase/account/sign-out';

interface HeaderProps {
  project: Project;
}

export const Header = ({ project }: HeaderProps) => {
  const [isSearchInputFocused, setSearchInputFocused] = useState(false);
  const router = useRouter();

  const signOut = useSignOutFunction();

  const searchArea = styler(styles.searcharea);
  const searchInput = styler(styles.searchinput);

  if (isSearchInputFocused) searchArea.add(styles.focused);
  if (isSearchInputFocused) searchInput.add(styles.focused);

  const search: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      router.push({ pathname: '/find', query: { keyword: e.currentTarget.value, simpleSearch: true } });
      e.currentTarget.blur();
      e.currentTarget.value = '';
      setSearchInputFocused(!1);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <BusinessIcon />
        <div className={styles.projectname}>{project.name}</div>
        <div className={styles.projectid}>({project.id})</div>
        <div className={styles.signOut} onClick={signOut}>
          ログアウト
        </div>
      </div>
      <label className={styles.search}>
        <MyTooltip title="課題を検索" placement="left">
          <div className={searchArea.build()}>
            <input
              type="text"
              id="issuename"
              placeholder={isSearchInputFocused ? '課題を検索' : undefined}
              className={searchInput.build()}
              onFocus={() => setSearchInputFocused(!0)}
              onBlur={(e) => {
                if (!e.currentTarget.value) setSearchInputFocused(!1);
              }}
              onKeyDown={search}
            />
            <SearchIcon className={styles.icon} />
          </div>
        </MyTooltip>
      </label>
    </header>
  );
};
