import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css';
import './markdownEditor.css';

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

export const MarkdownEditor = (props) => {
  const value = props.value;
  const onChange = props.onChange;
  const markdownHeading = props.markdownHeading;
  return (<div>
    <textarea name="statement" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    {markdownHeading}
    <Markdown className='statement-desc'>{value}</Markdown>
  </div>);
}

export default Markdown;