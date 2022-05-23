import React from 'react';
import Head from 'next/head';

interface Props {
  title?: string;
  description?: string;
  favicon?: string;
}

export const HeadMetaData = ({
  title = '',
  description = 'ポートフォリオ用のタスク管理アプリ',
  favicon = '/favicon.ico',
}: Props) => {
  return (
    <Head>
      <title>
        {title && `${title} | `}
        タスク管理アプリ
      </title>
      <meta name="description" content={description} />
      <link rel="icon" href={favicon} />
    </Head>
  );
};
