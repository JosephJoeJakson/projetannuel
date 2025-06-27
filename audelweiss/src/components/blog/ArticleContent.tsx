'use client';

import { RichTextBlock, RichTextChild } from '@/types/blog';
import {JSX} from "react";

interface Props {
    content: RichTextBlock[];
}

export default function ArticleContent({ content }: Props) {
    return (
        <div className="prose prose-lg">
            {content.map((block, i) => {
                if (block.type === 'paragraph') {
                    return (
                        <p key={i}>
                            {block.children.map((child, j) => {
                                let node: string | JSX.Element = child.text;

                                if (child.bold) {
                                    node = <strong key={j}>{node}</strong>;
                                }

                                if (child.underline) {
                                    node = <u key={j}>{typeof node === 'string' ? node : node.props.children}</u>;
                                }

                                return <span key={j}>{node}</span>;
                            })}
                        </p>
                    );
                }

                return null;
            })}
        </div>
    );
}
