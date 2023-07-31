import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css';

const _mapProps = (props) => ({
  ...props,
  skipHtml: false,
  remarkPlugins: [
    RemarkMathPlugin
  ],
  rehypePlugins: [
    rehypeKatex
  ]
});

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown;