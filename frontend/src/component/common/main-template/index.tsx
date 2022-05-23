import React from 'react';

import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NoteIcon from '@mui/icons-material/Note';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';

import { Whole } from 'component/container/whole';
import { Header } from 'component/organism/header';
import { MenuItem, Sidebar } from 'component/organism/sidebar';

import styles from './index.module.scss';
import { useCurrentUserInfo } from 'client/hooks';

export const MainTemplate = ({ children }: { children: React.ReactNode }) => {
  const userInfo = useCurrentUserInfo();
  const projectId = userInfo?.project.id || '';
  const projectName = userInfo?.project.name || '';
  return (
    <Whole>
      <Sidebar menuItems={menuItems(projectId || '')} />
      <div className={styles.content}>
        <Header project={{ name: projectName, id: projectId }} />
        <div className={styles.main}>{children}</div>
      </div>
    </Whole>
  );
};

const menuItems = (projectId: string): MenuItem[] => [
  { Icon: HomeIcon, text: 'ホーム', path: `/${projectId}/projects` },
  { Icon: AddIcon, text: '課題の追加', path: `/${projectId}/add` },
  {
    Icon: FormatListBulletedIcon,
    text: '課題',
    path: `/${projectId}/find?simpleSearch=true&sort=updatedAt&order=false`,
  },
  { Icon: ViewKanbanIcon, text: 'ボード', path: `/${projectId}/board` },
  { Icon: EventNoteIcon, text: 'ガントチャート', path: `/${projectId}/gantt` },
  { Icon: NoteIcon, text: 'Wiki', path: `/${projectId}/wiki` },
  { Icon: FolderIcon, text: 'ファイル', path: `/${projectId}/file` },
  { Icon: StorageIcon, text: 'Git', path: `/${projectId}/git` },
  { Icon: SettingsIcon, text: 'プロジェクト設定', path: `/${projectId}/settings` },
];
