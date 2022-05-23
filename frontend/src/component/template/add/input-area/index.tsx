import React, { useContext } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useCurrentUserInfo } from 'client/hooks';

import styles from './index.module.scss';

import { IssueKindWithLabel, IssueStatusLabel } from 'domain/issue';

import { Pulldown, Option } from 'component/atom/pulldown';
import { TextInput } from 'component/atom/input';
import { DatePicker } from 'component/atom/date-picker';
import { IssueCard } from 'component/container/issue-card';

import { AddFormContext } from 'component/template/add/use-add-form';
import { MarkdownEditor } from 'component/organism/markdown';
import { MyTooltip } from 'component/util/my-tooltip';

interface Props {
  assigneeOptions: Option<string>[];
  categoryOptions: Option<number>[];
}

export const InputArea = (props: Props) => {
  const { values, updateValues } = useContext(AddFormContext);
  const userInfo = useCurrentUserInfo();
  if (!userInfo) return <></>;
  return (
    <div className={styles.inputArea}>
      <Pulldown options={IssueKindWithLabel} selected={values.kind} updateFunction={(v) => updateValues({ kind: v })} />
      <TextInput
        placeholder="件名"
        value={values.title}
        updateFunction={(v) => updateValues({ title: v })}
        updateOnChange
      />
      <IssueCard.Container>
        <div className={styles.content}>
          <MarkdownEditor
            toolbar={true}
            value={values.description}
            updateOnBlur={(v) => updateValues({ description: v })}
          />
        </div>
        <IssueCard.Properties>
          <IssueCard.PropertyItem label="状態">
            <div>{IssueStatusLabel[values.status]}</div>
          </IssueCard.PropertyItem>
          <IssueCard.PropertyItem label="担当者">
            <div style={{ width: '200px' }}>
              <Pulldown
                options={props.assigneeOptions}
                selected={values.assignee}
                updateFunction={(v) => updateValues({ assignee: v })}
                hasFilterInput
                hasClearButton
                with={
                  <MyTooltip title="私が担当" placement="top">
                    <div className={styles.assignToMyself} onClick={() => updateValues({ assignee: userInfo.id })}>
                      <AccountCircleIcon className={styles.assingtomyself} />
                    </div>
                  </MyTooltip>
                }
              />
            </div>
          </IssueCard.PropertyItem>
          <IssueCard.PropertyItem label="カテゴリー">
            <div style={{ width: '200px' }}>
              <Pulldown
                options={props.categoryOptions}
                selected={values.category}
                updateFunction={(v) => updateValues({ category: v })}
                hasFilterInput
                hasClearButton
              />
            </div>
          </IssueCard.PropertyItem>
          <IssueCard.PropertyItem label="期限日">
            <DatePicker value={values.dueDate} updateFunction={(v) => updateValues({ dueDate: v })} />
          </IssueCard.PropertyItem>
        </IssueCard.Properties>
      </IssueCard.Container>
    </div>
  );
};
