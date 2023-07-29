import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';

const _mapProps = (props) => ({
    ...props,
    escapeHtml: false,
    plugins: [
      RemarkMathPlugin
    ],
    renderers: {
      ...props.renderers,
      math: ({ value }) => `math: ${value}`,
      inlineMath: ({ value }) => `inlineMath: ${value}`
    }
  });

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown;