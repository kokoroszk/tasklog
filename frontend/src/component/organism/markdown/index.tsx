import React, { useEffect, useMemo, useState } from 'react';
import { compose } from 'ramda';

import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

import { escape } from 'html-escaper';
import { marked } from 'marked';

import styles from './index.module.scss';

const safeStr = (s: string) => s || '';
const parseMarkdown = compose(marked as (s: string) => string, escape, safeStr);

const editorOptions: EasyMDE.Options = {
  spellChecker: false,
  sideBySideFullscreen: false,
  hideIcons: ['guide', 'fullscreen', 'side-by-side', 'image'],
  showIcons: ['table'],
  maxHeight: '300px',
  previewRender: parseMarkdown,
  previewClass: ['editor-preview', styles.previewMarkdown],
  inputStyle: 'textarea',
};

const options = (arg: { toolbar?: boolean; maxHeight?: `${number}px` }): EasyMDE.Options => ({
  ...editorOptions,
  toolbar: !!arg.toolbar ? editorOptions.toolbar : false,
  maxHeight: arg.maxHeight !== undefined ? arg.maxHeight : editorOptions.maxHeight,
});

export const MarkdownViewer = (props: { markdown: string }) => (
  <div className={styles.previewMarkdown} dangerouslySetInnerHTML={{ __html: parseMarkdown(props.markdown) }} />
);

export const MarkdownEditor = (props: {
  value: string;
  updateOnBlur: (s: string) => void;
  toolbar?: boolean;
  maxHeight?: `${number}px`;
}) => {
  // onChange関数の頻繁な変更による描画遅延を回避する
  const [buffer, setBuffer] = useState(props.value);
  useEffect(() => setBuffer(props.value), [props.value]);

  const option = useMemo(
    () => options({ toolbar: props.toolbar, maxHeight: props.maxHeight }),
    [props.toolbar, props.maxHeight],
  );

  return (
    <SimpleMDE
      className={styles.editor}
      options={option}
      value={props.value}
      defaultValue={props.value}
      onChange={setBuffer}
      onBlur={() => props.updateOnBlur(buffer)}
    />
  );
};
