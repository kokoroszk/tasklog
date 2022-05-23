import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

import { styler } from 'component/util/styler';
import { MyTooltip } from 'component/util/my-tooltip';

import styles from './index.module.scss';

interface SidebarProps {
  menuItems: MenuItem[];
}

export interface MenuItem {
  Icon: OverridableComponent<SvgIconTypeMap>;
  text: string;
  path: `/${string}`;
}

// 画面を遷移した場合でも開閉状態を維持する
const isOpenAtom = atom({
  key: 'sidebar.isOpen',
  default: false,
});
const useIsSidebarOpen = () => useRecoilState(isOpenAtom);
export const useIsSidebarOpenValue = () => useRecoilValue(isOpenAtom);

const MenuItem = ({ Icon, text, path }: MenuItem) => {
  const isSidebarOpen = useIsSidebarOpenValue();
  const route = useRouter();
  const isTooltipDisabled = isSidebarOpen;

  const menuItem = styler(styles.menuitem);

  const currentPathName = `/${route.query.projectId}/${route.pathname.split('/')[2]}`;
  if (currentPathName.startsWith(path.split('?')[0])) menuItem.add(styles.selected);

  return (
    <Link href={path}>
      <a>
        <MyTooltip title={text} placement="right" disabled={isTooltipDisabled}>
          <div className={menuItem.build()}>
            <Icon className={styles.icon} />
            <div className={styles.menutext}>{text}</div>
          </div>
        </MyTooltip>
      </a>
    </Link>
  );
};

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const [isOpen, setIsOpen] = useIsSidebarOpen();

  const siderbar = styler(styles.sidebar);
  const humburgerRow = styler(styles.menuitem, styles.humbergar);

  if (isOpen) {
    siderbar.add(styles.opened);
    humburgerRow.add(styles.justifyright);
  }

  return (
    <div className={siderbar.build()}>
      <div className={styles.wrapper}>
        <div className={humburgerRow.build()} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.icon}>
            <span className={styles.arrow}>
              <span className={styles.inner}></span>
            </span>
          </div>
        </div>
        {menuItems.map((data) => (
          <MenuItem Icon={data.Icon} text={data.text} path={data.path} key={data.text} />
        ))}
      </div>
    </div>
  );
};
